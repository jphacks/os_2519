// ContentPage.tsx
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import DialogueCard from "./DialogueCard";
import { Link, useSearchParams } from "react-router-dom";
import { Home, TrendingUp, Settings } from "lucide-react";
import "./ContentPage.css";
import "../../../src/styles/common.css";
import "../../../src/styles/components.css";
import {
  addDailyStudyTime,
  createOrupdateUserInfo,
  getUserPreference,
  markDialogueAsRead,
  updatePreferenceVector,
} from "../../database/userInfo";
import { auth } from "../../firebase";
import { getRecommendedContents } from "../../database/contentsInfo";

// ==================== 型定義 ====================

interface DialogueLine {
  speaker: "student" | "teacher";
  line: string;
}

interface DialogueSet {
  id: string;
  title: string;
  dialogue: DialogueLine[];
  field: number[]; // コンテンツベクトル
}

// ==================== 定数定義 ====================

// アニメーション定数
const ANIMATION_DURATION = 0.4;
const SWIPE_THRESHOLD = 120;
const SWIPE_X_OFFSET = 400;
const SWIPE_ROTATE_DEGREE = 10;
const HINT_AUTOHIDE_DELAY = 5000;

// ==================== コンポーネント ====================

export default function ContentPage() {
  const user = auth.currentUser;
  const uid = user?.uid;
  if (!uid) return <></>;

  const [dialogues, setDialogus] = useState<DialogueSet[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const controls = useAnimation();
  const currentDialogueSet = dialogues[currentIndex];

  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [searchParams] = useSearchParams();
  const categoryIndexStr = searchParams.get("category");
  const n = categoryIndexStr ? parseInt(categoryIndexStr, 10) : -1;

  const startTimeRef = useRef<number>(Date.now());

  // 学習時間を記録
  const recordStudyTime = useCallback(async () => {
    const endTime = Date.now();
    const elapsedSec = Math.round((endTime - startTimeRef.current) / 1000);
    startTimeRef.current = endTime;

    await addDailyStudyTime(uid, elapsedSec);
  }, [uid]);

  // 会話コンテンツの取得
  useEffect(() => {
    const getdialogue = async () => {
      const dialogue: DialogueSet[] = await getRecommendedContents(uid, n);
      setDialogus(dialogue);
      startTimeRef.current = Date.now();
    };
    getdialogue();

    let timer: NodeJS.Timeout;
    if (showSwipeHint) {
      timer = setTimeout(() => setShowSwipeHint(false), HINT_AUTOHIDE_DELAY);
    }
    return () => clearTimeout(timer);
  }, [uid, showSwipeHint, n]);

  // 初回表示カードに3秒待機
  useEffect(() => {
    if (isFirstRender && currentDialogueSet) {
      const timer = setTimeout(() => setIsFirstRender(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isFirstRender, currentDialogueSet]);

  // ==================== カードスワイプ ====================

  const handleSwipe = useCallback(
    async (direction: "left" | "right") => {
      if (!currentDialogueSet) return;

      if (showSwipeHint) {
        setShowSwipeHint(false);
        controls.stop();
        controls.set({ x: 0, opacity: 1, rotate: 0 });
      }

      const isRight = direction === "right";

      // 学習時間記録
      await recordStudyTime();

      // スワイプ＝skipとして嗜好更新
      const P_old = await getUserPreference(uid);
      const V = currentDialogueSet.field;
      const P_new = updatePreferenceVector(P_old, V, "skip");
      await createOrupdateUserInfo(uid, { preference: P_new });

      // アニメーション
      await controls.start({
        x: isRight ? SWIPE_X_OFFSET : -SWIPE_X_OFFSET,
        opacity: 0,
        rotate: isRight ? SWIPE_ROTATE_DEGREE : -SWIPE_ROTATE_DEGREE,
        transition: { duration: ANIMATION_DURATION },
      });

      // 次のカードへ
      setCurrentIndex((prevIndex) =>
        dialogues.length > 0 ? (prevIndex + 1) % dialogues.length : 0
      );

      controls.set({ x: 0, opacity: 1, rotate: 0 });
    },
    [controls, dialogues.length, showSwipeHint, recordStudyTime, uid, currentDialogueSet]
  );

  // ==================== 会話完了 ====================

  const handleDialogueCompleted = useCallback(
    async (dialogueId: string, rating: number | "skip") => {
      if (!currentDialogueSet) return;

      await markDialogueAsRead(uid, dialogueId);
      await recordStudyTime();

      // 評価に応じた嗜好更新
      const P_old = await getUserPreference(uid);
      const V = currentDialogueSet.field;
      const P_new = updatePreferenceVector(P_old, V, rating);
      await createOrupdateUserInfo(uid, { preference: P_new });

      // アニメーションのみ
      await controls.start({
        x: SWIPE_X_OFFSET,
        opacity: 0,
        rotate: SWIPE_ROTATE_DEGREE,
        transition: { duration: ANIMATION_DURATION },
      });

      setCurrentIndex((prevIndex) =>
        dialogues.length > 0 ? (prevIndex + 1) % dialogues.length : 0
      );

      controls.set({ x: 0, opacity: 1, rotate: 0 });
    },
    [controls, dialogues.length, recordStudyTime, uid, currentDialogueSet]
  );

  if (!currentDialogueSet) return <></>;

  return (
    <div className="content-container">
      {/* スワイプヒント */}
      {showSwipeHint && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="swipe-hint-overlay"
          onClick={() => {
            setShowSwipeHint(false);
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

      {/* 会話カード */}
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
      >
        <DialogueCard
          dialogueData={currentDialogueSet}
          onDialogueCompleted={handleDialogueCompleted}
        />
      </motion.div>

      {/* フッター */}
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
