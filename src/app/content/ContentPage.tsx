// ContenPage.tsx (リファクタリング後)
import { useState, useCallback } from "react";
import { motion, useAnimation } from "framer-motion";
import DialogueCard from "../../components/DialogueCard"; // DialogueCardをインポート
import { Link } from "react-router-dom";
import { Home, TrendingUp, Settings } from "lucide-react";
import "./ContentPage.css";
import "../../../src/styles/common.css";
import "../../../src/styles/components.css";

// ==================== 型定義 ====================

// 個々の会話の行の型（DialogueCard.tsxと共通）
interface DialogueLine {
  speaker: "student" | "teacher";
  line: string;
}

// 会話セットの型
interface DialogueSet {
  id: number;
  title: string;
  dialogue: DialogueLine[];
}

// ==================== 定数定義 ====================

// アニメーション定数
const ANIMATION_DURATION = 0.4; // アニメーションの秒数
const SWIPE_THRESHOLD = 120; // スワイプと判定する最小移動距離 (px)
const SWIPE_X_OFFSET = 400; // スワイプ時のX軸移動距離 (px)
const SWIPE_ROTATE_DEGREE = 10; // スワイプ時の回転角度 (deg)

// ==================== 会話データ ====================

const dialogues: DialogueSet[] = [
  {
    id: 1,
    title: "フランス革命の授業",
    dialogue: [
      {
        speaker: "student",
        line: "先生、今日は革命って聞いたけど、まさかバスティーユ牢獄に突撃とかはしませんよね！？怖いんですけど！",
      },
      {
        speaker: "teacher",
        line: "安心しなさい、今日はただの歴史の授業だよ。",
      },
      {
        speaker: "student",
        line: "よかったぁ！でも先生、ちょっと熱が入りすぎじゃないですか？",
      },
      { speaker: "teacher", line: "それがフランス革命のロマンというものだ！" },
      {
        speaker: "student",
        line: "ロマンって言われても… guillotine（ギロチン）とか怖いんですけど！",
      },
      { speaker: "teacher", line: "歴史は血と情熱でできているんだ！" },
      { speaker: "student", line: "情熱の方向、ちょっと怖いです先生！" },
      {
        speaker: "teacher",
        line: "よし、じゃあ今日の宿題は『革命とは何か』を400字で書いてくること！",
      },
      { speaker: "student", line: "やっぱり先生のほうが怖いです！！" },
      { speaker: "teacher", line: "それがフランス革命のロマンというものだ！" },
      {
        speaker: "student",
        line: "ロマンって言われても… guillotine（ギロチン）とか怖いんですけど！",
      },
      { speaker: "teacher", line: "歴史は血と情熱でできているんだ！" },
      { speaker: "student", line: "情熱の方向、ちょっと怖いです先生！" },
      {
        speaker: "teacher",
        line: "よし、じゃあ今日の宿題は『革命とは何か』を400字で書いてくること！",
      },
      { speaker: "student", line: "やっぱり先生のほうが怖いです！！" },
    ],
  },
  {
    id: 2,
    title: "次の授業",
    dialogue: [
      {
        speaker: "teacher",
        line: "安心しなさい、今日はただの歴史の授業だよ。",
      },
      {
        speaker: "student",
        line: "よかったぁ！でも先生、ちょっと熱が入りすぎじゃないですか？",
      },
      { speaker: "teacher", line: "それがフランス革命のロマンというものだ！" },
      {
        speaker: "student",
        line: "ロマンって言われても… guillotine（ギロチン）とか怖いんですけど！",
      },
      { speaker: "teacher", line: "歴史は血と情熱でできているんだ！" },
      { speaker: "student", line: "情熱の方向、ちょっと怖いです先生！" },
      {
        speaker: "teacher",
        line: "よし、じゃあ今日の宿題は『革命とは何か』を400字で書いてくること！",
      },
      { speaker: "student", line: "やっぱり先生のほうが怖いです！！" },
    ],
  },
];

// ==================== コンポーネント ====================

export default function DialogueSwipe() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const controls = useAnimation();
  const currentDialogueSet = dialogues[currentIndex];

  const handleSwipe = useCallback(
    async (direction: "left" | "right") => {
      const isRight = direction === "right";

      // 現在のカードをアニメーションで画面外へ移動させる
      await controls.start({
        x: isRight ? SWIPE_X_OFFSET : -SWIPE_X_OFFSET,
        opacity: 0,
        rotate: isRight ? SWIPE_ROTATE_DEGREE : -SWIPE_ROTATE_DEGREE,
        transition: { duration: ANIMATION_DURATION },
      });

      // 次の会話セットのインデックスを計算（ループ）
      setCurrentIndex((prevIndex) => (prevIndex + 1) % dialogues.length);

      // 新しいカードのためにアニメーションの状態をリセット
      // x, opacity, rotateを初期値に戻すことで、新しいカードがスムーズに現れる
      controls.set({ x: 0, opacity: 1, rotate: 0 });
    },
    [controls]
  );

  // ★追加: DialogueCardから会話完了通知を受け取るハンドラー
  const handleDialogueCompleted = useCallback(
    (dialogueId: number, rating: number) => {
      console.log(`Dialogue ${dialogueId} completed with rating: ${rating}`);
      // 評価は後でバックエンドに送信するなどの処理を追加できる

      // 次の会話へ自動的に進める
      handleSwipe("right"); // 例えば、評価完了は「好き」と同じ右スワイプの動作と見なす
    },
    [handleSwipe] // handleSwipeが変更されたらこの関数も再生成されるように依存配列に追加
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-pink-50 p-4">
      {/* スワイプ可能な会話カードのコンテナ */}
      <motion.div
        key={currentDialogueSet.id}
        animate={controls}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={(_, info) => {
          if (info.offset.x > SWIPE_THRESHOLD) {
            handleSwipe("right");
          } else if (info.offset.x < -SWIPE_THRESHOLD) {
            handleSwipe("left");
          }
        }}
        className="bg-white w-full max-w-md shadow-2xl rounded-3xl p-4 flex flex-col items-stretch h-[calc(100vh-180px)]"
      >
        {/* DialogueCardコンポーネントに現在の会話データとハンドラーを渡す */}
        <DialogueCard
          dialogueData={currentDialogueSet}
          onDialogueCompleted={handleDialogueCompleted} // ★追加: ハンドラーを渡す
        />
      </motion.div>

      {/* ====== ボタン操作 ====== */}
      <div className="flex gap-6 mt-6">
        <button
          onClick={() => handleSwipe("left")}
          className="px-5 py-2 rounded-full bg-red-100 text-red-600 font-semibold shadow hover:bg-red-200 transition"
          aria-label="嫌い"
        >
          嫌い 👎
        </button>
        <button
          onClick={() => handleSwipe("right")}
          className="px-5 py-2 rounded-full bg-green-100 text-green-600 font-semibold shadow hover:bg-green-200 transition"
          aria-label="好き"
        >
          好き 👍
        </button>
      </div>

      {/* ====== 共通フッターナビ (SettingPage と同じ) ====== */}
      <nav className="bottom-nav">
        <div className="bottom-nav-content">
          <Link to="/" className="nav-link">
            <Home className="nav-icon" />
            <span className="nav-label">ホーム</span>
          </Link>
          <Link to="/progress" className="nav-link">
            <TrendingUp className="nav-icon" />
            <span className="nav-label">進捗</span>
          </Link>
          <Link to="/settings" className="nav-link">
            <Settings className="nav-icon" />
            <span className="nav-label">設定</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
