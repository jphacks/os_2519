// DialogueCard.tsx (修正版)
import React, { useEffect, useState } from "react";
import styled from "styled-components";

/** ==================== 型定義 ==================== **/
interface DialogueLine {
  speaker: "student" | "teacher";
  line: string;
}

interface DialogueCardProps {
  dialogueData: {
    id: number;
    title: string;
    dialogue: DialogueLine[];
  };
  // 会話が完了し、評価されたときに呼び出されるコールバック関数
  onDialogueCompleted: (dialogueId: number, rating: number) => void;
}

/** ==================== スタイル ==================== **/

const CardContainer = styled.div`
  background-color: #ffffff;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 300px;
  min-width: 250px;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 12px;
  text-align: center;
`;

const ChatWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow-y: auto;
  padding-right: 6px;
  margin-right: -6px;

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const Avatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid #ccc;
  flex-shrink: 0;
`;

const MessageBubble = styled.div<{ $isStudent: boolean }>`
  background-color: ${(p) => (p.$isStudent ? "#f472b6" : "#e0e0e0")};
  color: ${(p) => (p.$isStudent ? "white" : "black")};
  border-radius: 15px;
  padding: 10px 14px;
  margin: 5px 0;
  max-width: 70%;
  align-self: ${(p) => (p.$isStudent ? "flex-end" : "flex-start")};
  position: relative;
  word-break: break-word;
`;

const MessageRow = styled.div<{ $isStudent: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  flex-direction: ${(p) => (p.$isStudent ? "row-reverse" : "row")};
  margin-bottom: 10px;
`;

const StarsWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 18px;
  flex-wrap: wrap;
`;

const Star = styled.span<{ $active: boolean; $disabled: boolean }>`
  font-size: 30px;
  line-height: 1;
  display: inline-block;
  user-select: none;
  cursor: ${(p) => (p.$disabled ? "not-allowed" : "pointer")};
  color: ${(p) => (p.$active ? "#FFD700" : "#D3D3D3")};
  opacity: ${(p) => (p.$disabled ? 0.65 : 1)};

  /* active を最優先、disabled は hover のみを抑制する */
  &:hover {
    color: ${(p) => (!p.$disabled && !p.$active ? "#ffcc00" : undefined)};
  }

  /* キーボードフォーカス時の視覚フィードバック */
  &:focus {
    outline: 2px solid rgba(0, 0, 0, 0.12);
    outline-offset: 2px;
  }
`;

const InstructionText = styled.p`
  font-size: 15px;
  color: #555;
  text-align: center;
  margin: 0 0 8px 0;
`;

/** ==================== ヘルパー ==================== **/

const getAvatarUrl = (speaker: DialogueLine["speaker"]): string =>
  speaker === "student"
    ? "https://i.pravatar.cc/50?img=15"
    : "https://i.pravatar.cc/50?img=5";

/** ==================== コンポーネント ==================== **/

const Message: React.FC<DialogueLine> = ({ speaker, line }) => {
  const isStudent = speaker === "student";
  return (
    <MessageRow $isStudent={isStudent}>
      <Avatar src={getAvatarUrl(speaker)} alt={`${speaker} avatar`} />
      <MessageBubble $isStudent={isStudent}>{line}</MessageBubble>
    </MessageRow>
  );
};

const DialogueCard: React.FC<DialogueCardProps> = ({ dialogueData, onDialogueCompleted }) => {
  const { id: dialogueId, title, dialogue } = dialogueData;
  // メッセージを1つずつ表示するために currentIndex を 1 から開始
  const [currentIndex, setCurrentIndex] = useState(() => (dialogue && dialogue.length > 0 ? 1 : 0));
  const [rating, setRating] = useState<number>(0);
  const [hasRated, setHasRated] = useState<boolean>(false);

  useEffect(() => {
    // メッセージが残っている && 評価していない ときのみタイマーで進める
    if (currentIndex < dialogue.length && !hasRated) {
      const timer = setTimeout(() => {
        setCurrentIndex((prev) => Math.min(prev + 1, dialogue.length));
      }, 2000);
      return () => clearTimeout(timer);
    }
    return;
  }, [currentIndex, dialogue.length, hasRated]);

  // 星をクリックしたときの処理
  const handleStarClick = (star: number) => {
    if (hasRated) return;
    setRating(star);
    setHasRated(true);
    // 親に通知（親がこの通知で DialogueCard をアンマウント／再作成するなら
    // 親側で扱いを注意してもらう必要があります）
    onDialogueCompleted(dialogueId, star);
  };

  // キーボード用ハンドラ（Enter / Space で選択）
  const handleStarKeyDown = (e: React.KeyboardEvent, star: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleStarClick(star);
    }
  };

  return (
    <CardContainer>
      <Title>{title}</Title>

      <ChatWrapper>
        {dialogue.slice(0, currentIndex).map((msg, index) => (
          <Message key={index} speaker={msg.speaker} line={msg.line} />
        ))}
      </ChatWrapper>

      {/* 全てのメッセージが表示されたら評価 UI を出す */}
      {currentIndex >= dialogue.length && dialogue.length > 0 && (
        <StarsWrapper>
          <div style={{ width: "100%", textAlign: "center" }}>
            <InstructionText>評価して次へ</InstructionText>
            <div aria-hidden style={{ height: 6 }} />
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                role="button"
                tabIndex={hasRated ? -1 : 0}
                $active={star <= rating}
                $disabled={hasRated}
                onClick={() => handleStarClick(star)}
                onKeyDown={(e) => handleStarKeyDown(e, star)}
                aria-pressed={star <= rating}
                aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
              >
                ★
              </Star>
            ))}
          </div>
        </StarsWrapper>
      )}
    </CardContainer>
  );
};

export default DialogueCard;
