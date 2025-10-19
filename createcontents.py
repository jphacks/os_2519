#feaa
import os
import re
import json
import urllib.parse
import requests
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Optional

# --- 設定項目 ---
from google import genai
from google.colab import userdata

# Gemini API クライアント
api_key = userdata.get('Jphack')
client = genai.Client(api_key=api_key)

# Firestore 初期化
try:
    import firebase_admin
    from firebase_admin import credentials, firestore

    FIREBASE_CERT_PATH = "/content/sukima-knowledge-firebase-adminsdk-fbsvc-22befd2652.json"
    if not firebase_admin._apps:
        cred = credentials.Certificate(FIREBASE_CERT_PATH)
        firebase_admin.initialize_app(cred)
    db = firestore.client()
    print("Firebase connected.")
except Exception as e:
    print(f"Firebase init failed: {e}")
    db = None

# 分野リスト
FIELD_NAMES = [
    "1_社会・歴史", "2_自然・科学", "3_テクノロジー", "4_アート・エンタメ",
    "5_スポーツ", "6_生活・実用", "7_サブカル・心理", "8_グローバル・地域",
    "9_トレンド・現代社会", "10_知的・哲学"
]

# --- Wikipedia 関連 ---
def get_wikipedia_summary(title: str, lang: str = "ja") -> Optional[Dict]:
    url = f"https://{lang}.wikipedia.org/w/api.php"
    headers = {"User-Agent": "Python Wikipedia Content Generator/1.0"}
    params = {"action": "query", "prop": "extracts", "explaintext": True,
              "titles": title, "format": "json", "redirects": True}
    try:
        res = requests.get(url, headers=headers, params=params, timeout=10)
        res.raise_for_status()
        pages = res.json()["query"]["pages"]
        page = next(iter(pages.values()))
        if "extract" not in page:
            return None
        text = page["extract"]
        last_updated = page.get("touched")
        match = re.search(r"==\s*概要\s*==\n(.*?)(?:\n==|$)", text, re.DOTALL)
        # Modified to return full text if summary section not found
        summary = match.group(1).strip() if match else text.strip()
        return {"text": summary[:5000], "last_updated": last_updated}
    except Exception as e:
        print(f"Wikipedia fetch error: {e}")
        return None

# --- Gemini 生成 ---
def extract_json_from_markdown(text: str) -> Optional[str]:
    """Extracts JSON string from a markdown code block."""
    match = re.search(r"```json\n(.*?)\n```", text, re.DOTALL)
    if match:
        return match.group(1)
    return None

def generate_dialogue(text: str) -> Optional[List[Dict[str, str]]]:
    prompt = (
        "以下の文章を「生徒」と「先生」の会話形式に変換してください。"
        "生徒は疑問を投げかけ、先生は分かりやすく解説します。対話は面白いものにしてください"
        f"\n文章:\n{text[:4000]}\n"
        "出力はJSONリストで{'speaker':'student'|'teacher','line':'…'}の形式にしてください。やりとりは合計20回以内にしてください"
    )
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        json_text = extract_json_from_markdown(response.text)
        if json_text:
            return json.loads(json_text)
        else:
            print(f"Could not extract JSON from markdown: {response.text}")
            return None
    except json.JSONDecodeError as e:
        print(f"Failed to parse dialogue JSON from Gemini: {e}")
        print(f"Raw response text: {response.text}")
        return None
    except Exception as e:
        print(f"Failed to generate dialogue: {e}")
        return None

def generate_field(text: str) -> Optional[List[float]]:
    prompt = (
        f"文章を分析し、10個の分野に関連する度合いを0~1で評価してください。\n"
        f"分野: {FIELD_NAMES}\n文章:\n{text[:4000]}\n"
        "出力はJSONリストで、合計が1になるようにしてください。"
        "もし辞書形式で出力された場合は、度合いだけを取り出して10次元リストにしてください。"
    )
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        json_text = extract_json_from_markdown(response.text)
        if not json_text:
            print(f"Could not extract JSON from markdown: {response.text}")
            return None

        parsed = json.loads(json_text)

        # もしリストの中身が dict 形式なら度合いだけ取り出す
        if isinstance(parsed, list) and parsed and isinstance(parsed[0], dict) and "度合い" in parsed[0]:
            field_list = [d.get("度合い", 0.0) for d in parsed]
        elif isinstance(parsed, list):
            # 数字のリストならそのまま
            field_list = [float(v) for v in parsed]
        else:
            print(f"Unexpected format for field JSON: {parsed}")
            return None

        # 念のため長さを10に調整（足りない場合は0を補完）
        if len(field_list) < 10:
            field_list += [0.0] * (10 - len(field_list))
        elif len(field_list) > 10:
            field_list = field_list[:10]

        return field_list

    except json.JSONDecodeError as e:
        print(f"Failed to parse field JSON from Gemini: {e}")
        print(f"Raw response text: {response.text}")
        return None
    except Exception as e:
        print(f"Failed to generate field: {e}")
        return None



# --- Firestore 保存 ---
def save_to_firestore(contents_id: str, data: dict):
    if not db or not contents_id:
        print("Skipping Firestore save")
        return
    try:
        ref = db.collection("contents").document(contents_id)
        data_copy = data.copy()
        data_copy["updatedAt"] = firestore.SERVER_TIMESTAMP
        ref.set(data_copy, merge=True)
        doc = ref.get()
        if not doc.exists or "createdAt" not in doc.to_dict():
            ref.update({"createdAt": firestore.SERVER_TIMESTAMP})
        print(f"Saved to Firestore: {contents_id}")
    except Exception as e:
        print(f"Firestore save error: {e}")

# --- クイズ生成関数 ---
def generate_quiz(text: str, title: str) -> Optional[Dict]:
    """
    テキストからクイズを生成。
    question, correct_answer, incorrect_answers (3つ) を含む辞書を返す。
    """
    prompt = (
        f"以下の文章に基づいて、1問のクイズを生成してください。\n"
        f"文章:\n{text[:4000]}\n\n"
        "出力はJSON形式で、次の構造にしてください:\n"
        "{\n"
        '  "question": "問題文",\n'
        '  "correct_answer": "正解",\n'
        '  "incorrect_answers": ["不正解1", "不正解2", "不正解3"]\n'
        "}"
    )
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        json_text = extract_json_from_markdown(response.text)
        if json_text:
            quiz = json.loads(json_text)
            # 必須キーがあるか確認
            if "question" in quiz and "correct_answer" in quiz and "incorrect_answers" in quiz:
                return quiz
            else:
                print(f"Quiz JSON missing required keys: {quiz}")
                return None
        else:
            print(f"Could not extract JSON from quiz response: {response.text}")
            return None
    except json.JSONDecodeError as e:
        print(f"Failed to parse quiz JSON: {e}")
        print(f"Raw response: {response.text}")
        return None
    except Exception as e:
        print(f"Failed to generate quiz: {e}")
        return None


# --- Firestore クイズ保存 ---
def save_quiz_to_firestore(quiz_id: str, quiz_data: dict):
    """
    quizzesコレクションにクイズを保存
    """
    if not db or not quiz_id:
        print("Skipping quiz save to Firestore")
        return
    try:
        ref = db.collection("quizzes").document(quiz_id)
        quiz_data_copy = quiz_data.copy()
        quiz_data_copy["updatedAt"] = firestore.SERVER_TIMESTAMP
        ref.set(quiz_data_copy, merge=True)

        doc = ref.get()
        if not doc.exists or "createdAt" not in doc.to_dict():
            ref.update({"createdAt": firestore.SERVER_TIMESTAMP})

        print(f"Saved quiz to Firestore: {quiz_id}")
    except Exception as e:
        print(f"Quiz Firestore save error: {e}")



# --- メイン処理 ---
def add_content(title: str):
    print(f"Processing: {title}")
    summary_data = get_wikipedia_summary(title)
    print(f"Wikipedia summary data: {summary_data}") # Added print statement
    if not summary_data or not summary_data.get("text"): # Added check for empty text
        print(f"Failed to get Wikipedia summary or summary is empty for {title}")
        return

    text = summary_data["text"]
    print(f"Extracted text length: {len(text) if text else 0}") # Added print statement
    last_updated = summary_data["last_updated"]

    dialogue = generate_dialogue(text)
    field = generate_field(text)
    quiz = generate_quiz(text, title)

    if not dialogue or not field:
        print(f"Gemini generation failed for {title}")
        return

    contents_id = title.replace(" ", "_").replace("/", "_").lower()
    updated_str = "不明"
    if last_updated:
        dt_utc = datetime.fromisoformat(last_updated.replace("Z", "+00:00"))
        dt_jst = dt_utc.astrze(timezone(timedelta(hours=9)))
        updated_str = dt_jst.strftime("%Y年%m月%d日")
    encoded_title = urllib.parse.quote(title)
    source = f"「{title}」『ウィキペディア日本語版』(最終更新 {updated_str}, https://ja.wikipedia.org/wiki/{encoded_title})"

    data = {
        "title": title,
        "type": "knowledge",
        "dialogue": dialogue,
        "field": field, # This will now be a list of floats
        "text": text,
        "source": source,
        "quiz": quiz if quiz else None
    }

    save_to_firestore(contents_id, data)

    if quiz:
        quiz_id = f"quiz_{contents_id}"
        quiz_data = {
            "id": quiz_id,
            "title": title,
            "question": quiz["question"],
            "correct_answer": quiz["correct_answer"],
            "incorrect_answers": quiz["incorrect_answers"],
            "category": title,  # カテゴリとしてタイトルを設定
            "source": source
        }
        save_quiz_to_firestore(quiz_id, quiz_data)

    print(f"Finished: {title}\n")

# --- 実行例 ---
if __name__ == "__main__":
    titles = [
    # 1_社会・歴史
    "鎖国", "産業革命", "ナポレオン", "重商主義", "大航海時代", "ピューリタン革命", "明治維新", "アヘン戦争", "ベルリン会議", "ロシア革命",

    # 2_自然・科学
    "DNA", "ブラックホール", "光合成", "量子トンネル効果", "熱力学第二法則", "カタストロフ理論", "共生進化", "カオス理論", "ドップラー効果", "ミトコンドリア・イブ",

    # 3_テクノロジー
    "人工知能", "量子コンピュータ", "ブロックチェーン", "ニューラルネットワーク", "エッジコンピューティング", "暗号資産", "クラウドソーシング", "自動運転技術", "量子暗号通信", "拡張現実",

    # 4_アート・エンタメ
    "印象派", "モナリザ", "アニメーション", "シュルレアリスム", "立体派", "フレスコ画", "コンセプチュアル・アート", "演劇即興", "現代音楽", "グラフィティ・アート",

    # 5_スポーツ
    "サッカー", "オリンピック", "柔道", "パルクール", "フリーダイビング", "スポーツ心理学", "ウルトラマラソン", "スケルトン", "ボルダリング", "eスポーツ",

    # 6_生活・実用
    "発酵食品", "睡眠サイクル", "防災", "タイムマネジメント", "マインドフルネス", "フェアトレード", "食品ロス", "ゼロウェイスト", "エシカルファッション", "セカンドハーベスト",

    # 7_サブカル・心理
    "心理学実験", "オタク文化", "ゲーム理論", "集合的無意識", "コンフォートゾーン", "認知的不協和", "マズローの欲求段階説", "ペルソナ心理学", "バタフライ効果", "アニメファンダム",

    # 8_グローバル・地域
    "EU", "アマゾン川", "世界遺産", "アフリカ連合", "シルクロード経済圏", "メコン川流域開発", "中東和平", "BRICS", "北欧福祉国家", "バスク地方",

    # 9_トレンド・現代社会
    "サステナビリティ", "SNS", "キャッシュレス", "デジタル・デトックス", "ギグエコノミー", "メタバース", "リモートワーク文化", "脱炭素社会", "AI倫理", "情報過多社会",

    # 10_知的・哲学
    "プラトン", "倫理学", "思考実験", "功利主義", "存在論", "決定論", "実存主義", "認識論", "シミュレーション仮説", "構造主義"
]

    if not api_key:
        print("Set GEMINI_API_KEY first.")
    else:
        for t in titles:
            add_content(t)