// ContenPage.tsx (リファクタリング後)
import { useState, useEffect, useCallback } from "react";
import { motion, useAnimation } from "framer-motion";
import DialogueCard from "./DialogueCard";
import { Link } from "react-router-dom";
import { Home, TrendingUp, Settings } from "lucide-react";
import "./ContentPage.css"; // CSSファイルをインポート
import "../../../src/styles/common.css";
import "../../../src/styles/components.css";
import { markDialogueAsRead } from "../../database/userInfo";
import { auth } from "../../firebase";
import { getRecommendedContents } from "../../database/contentsInfo";

// ==================== 型定義 ====================

// 個々の会話の行の型（DialogueCard.tsxと共通）
interface DialogueLine {
  speaker: "student" | "teacher";
  line: string;
}

// 会話セットの型
interface DialogueSet {
  id: string;
  title: string;
  dialogue: DialogueLine[];
}

// ==================== 定数定義 ====================

// アニメーション定数
const ANIMATION_DURATION = 0.4; // アニメーションの秒数
const SWIPE_THRESHOLD = 120; // スワイプと判定する最小移動距離 (px)
const SWIPE_X_OFFSET = 400; // スワイプ時のX軸移動距離 (px)
const SWIPE_ROTATE_DEGREE = 10; // スワイプ時の回転角度 (deg)
const HINT_AUTOHIDE_DELAY = 5000; // ヒントの自動非表示までの時間 (ms)

// ==================== コンポーネント ====================

export default function ContenPage() {
  const user = auth.currentUser;
  const uid = user?.uid;
  if (!uid) return <></>;

  const [dialogues, setDialogus] = useState<DialogueSet[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const controls = useAnimation(); // カードのスワイプアニメーションを制御
  const currentDialogueSet = dialogues[currentIndex];

  const [showSwipeHint, setShowSwipeHint] = useState(true); // 初期値をtrueに
  const [isFirstRender, setIsFirstRender] = useState(true); // 最初の文章を表示中かどうか

  useEffect(() => {
    // コンテンツデータの取得
    const getdialogue = async () => {
      const dialogue: DialogueSet[] = await getRecommendedContents(uid);
      setDialogus(dialogue);
    };
    getdialogue();

    // ヒントの自動非表示タイマーを設定
    let timer: NodeJS.Timeout;
    if (showSwipeHint) {
      timer = setTimeout(() => {
        setShowSwipeHint(false);
      }, HINT_AUTOHIDE_DELAY);
    }

    return () => clearTimeout(timer); // クリーンアップ
  }, [uid, showSwipeHint]);

  // 最初の文章表示を終わらせるための処理
  useEffect(() => {
    if (isFirstRender && currentDialogueSet) {
      // 最初の会話セットを表示中はスワイプ不可にする
      const firstDialogue = currentDialogueSet.dialogue[0];
      console.log("最初の文章:", firstDialogue.line);

      // 少し待ってからスワイプ可能にする
      const timer = setTimeout(() => {
        setIsFirstRender(false); // 文章表示後、スワイプ可能にする
      }, 3000); // 3秒後にスワイプ可能に

      return () => clearTimeout(timer); // クリーンアップ
    }
  }, [isFirstRender, currentDialogueSet]);

  const handleSwipe = useCallback(
    async (direction: "left" | "right") => {
      // スワイプヒントが表示中であれば非表示にする
      if (showSwipeHint) {
        setShowSwipeHint(false);
        // 揺れアニメーションを停止し、スワイプアニメーションへ引き継ぐ
        controls.stop();
        controls.set({ x: 0, opacity: 1, rotate: 0 }); // スワイプアニメーションの開始状態をリセット
      }

      const isRight = direction === "right";

      // 現在のカードをアニメーションで画面外へ移動させる
      await controls.start({
        x: isRight ? SWIPE_X_OFFSET : -SWIPE_X_OFFSET,
        opacity: 0,
        rotate: isRight ? SWIPE_ROTATE_DEGREE : -SWIPE_ROTATE_DEGREE,
        transition: { duration: ANIMATION_DURATION },
      });

      // 次の会話セットのインデックスを計算（ループ）
      setCurrentIndex((prevIndex) =>
        dialogues.length > 0 ? (prevIndex + 1) % dialogues.length : 0
      );

      // 新しいカードのためにアニメーションの状態をリセット
      controls.set({ x: 0, opacity: 1, rotate: 0 });
    },
    [controls, dialogues.length, showSwipeHint] // showSwipeHint を依存配列に追加
  );

  const handleDialogueCompleted = useCallback(
    async (dialogueId: string, rating: number) => {
      console.log(rating);
      await markDialogueAsRead(uid, dialogueId);
      handleSwipe("right");
    },
    [handleSwipe, uid]
  );

  if (!currentDialogueSet) return <></>;

  return (
    <div className="content-container">
      {/* スワイプヒントのオーバーレイ */}
      {showSwipeHint && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="swipe-hint-overlay"
          onClick={() => {
            // ヒントをクリックで非表示に
            setShowSwipeHint(false);
            // 揺れアニメーションを停止し、元の位置に戻す
            controls.stop();
            controls.set({ x: 0, opacity: 1, rotate: 0 });
          }}
        >
          <div className="swipe-hint-content">
            <span role="img" aria-label="left arrow">
              👈
            </span>{" "}
            左右にスワイプしてスキップ{" "}
            <span role="img" aria-label="right arrow">
              👉
            </span>
          </div>
        </motion.div>
      )}

      {/* スワイプ可能な会話カードのコンテナ */}
      <motion.div
        key={currentDialogueSet.id}
        animate={controls} // ここで `controls` をアニメーションに指定
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
        <DialogueCard
          dialogueData={currentDialogueSet}
          onDialogueCompleted={handleDialogueCompleted}
        />
      </motion.div>

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
