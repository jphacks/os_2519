import { useState, useCallback, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import DialogueCard from "./DialogueCard";
import { Link } from "react-router-dom";
import { Home, TrendingUp, Settings } from "lucide-react";
import "./ContentPage.css";
import "../../../src/styles/common.css";
import "../../../src/styles/components.css";
import { addDailyStudyTime, markDialogueAsRead } from "../../database/userInfo"; // ←★時間加算関数を追加
import { auth } from "../../firebase";
import { getRecommendedContents } from "../../database/contentsInfo";

interface DialogueLine {
  speaker: "student" | "teacher";
  line: string;
}

interface DialogueSet {
  id: string;
  title: string;
  dialogue: DialogueLine[];
}

export default function ContenPage() {
  const user = auth.currentUser;
  const uid = user?.uid;
  if (!uid) return <></>;

  const [dialogues, setDialogus] = useState<DialogueSet[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const controls = useAnimation();

  // ★ 現在のカードの表示開始時間を記録
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const getdialogue = async () => {
      const dialogue: DialogueSet[] = await getRecommendedContents(uid);
      setDialogus(dialogue);
      startTimeRef.current = Date.now(); // 初回も記録
    };
    getdialogue();
  }, [uid]);

  const currentDialogueSet = dialogues[currentIndex];

// 学習時間を記録
const recordStudyTime = useCallback(async () => {
  const endTime = Date.now();
  const elapsedSec = Math.round((endTime - startTimeRef.current) / 1000);
  startTimeRef.current = endTime; // 次のカードに備えて更新

  await addDailyStudyTime(uid, elapsedSec); // ← ★日別加算
}, [uid]);

  const handleSwipe = useCallback(
    async (direction: "left" | "right") => {
      const isRight = direction === "right";

      // 現在のカードでの滞在時間を記録
      await recordStudyTime();

      await controls.start({
        x: isRight ? 400 : -400,
        opacity: 0,
        rotate: isRight ? 10 : -10,
        transition: { duration: 0.4 },
      });

      setCurrentIndex((prevIndex) => (prevIndex + 1) % dialogues.length);
      controls.set({ x: 0, opacity: 1, rotate: 0 });
    },
    [controls, dialogues.length, recordStudyTime]
  );

  const handleDialogueCompleted = useCallback(
    async (dialogueId: string, rating: number) => {
      await markDialogueAsRead(uid, dialogueId);
      await recordStudyTime(); // ←★評価後にも時間記録
      handleSwipe("right");
    },
    [uid, handleSwipe, recordStudyTime]
  );

  if (!currentDialogueSet) return <></>;

  return (
    <div className="content-container">
      <motion.div
        key={currentDialogueSet.id}
        animate={controls}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={(_, info) => {
          if (info.offset.x > 120) handleSwipe("right");
          else if (info.offset.x < -120) handleSwipe("left");
        }}
        className="bg-white w-full max-w-md shadow-2xl rounded-3xl p-4 flex flex-col items-stretch h-[calc(100vh-180px)]"
      >
        <DialogueCard
          dialogueData={currentDialogueSet}
          onDialogueCompleted={handleDialogueCompleted}
        />
      </motion.div>

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
