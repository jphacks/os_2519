// DialogueCard.tsx (リファクタリング後)
import React, { useState, useEffect } from "react";
import styled from "styled-components";

// ==================== 型定義 ====================

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
  // ★追加: 会話が完了し、評価されたときに呼び出されるコールバック関数
  onDialogueCompleted: (dialogueId: number, rating: number) => void;
}

interface MessageBubbleProps {
  $isStudent: boolean;
}

interface MessageRowProps {
  $isStudent: boolean;
}

// ==================== スタイル ====================

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
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
  text-align: center;
`;

const ChatWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow-y: auto;
  padding-right: 5px;
  margin-right: -5px;

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

const MessageBubble = styled.div<MessageBubbleProps>`
  background-color: ${(props) => (props.$isStudent ? "#f472b6" : "#e0e0e0")};
  color: ${(props) => (props.$isStudent ? "white" : "black")};
  border-radius: 15px;
  padding: 10px 14px;
  margin: 5px 0;
  max-width: 70%;
  align-self: ${(props) => (props.$isStudent ? "flex-end" : "flex-start")};
  position: relative;
  word-break: break-word;
`;

const MessageRow = styled.div<MessageRowProps>`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  flex-direction: ${(props) => (props.$isStudent ? "row-reverse" : "row")};
  margin-bottom: 10px;
`;

const StarsWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  flex-wrap: wrap; /* スマホ表示時に折り返す */
`;

const Star = styled.span<{ active: boolean; disabled: boolean }>`
  font-size: 30px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")}; /* 無効時はカーソル変更 */
  color: ${(props) => (props.active ? "#FFD700" : "#D3D3D3")};
  opacity: ${(props) => (props.disabled ? 0.6 : 1)}; /* 無効時は半透明 */

  &:hover {
    color: ${(props) => (props.disabled ? "#D3D3D3" : "#ffcc00")}; /* 無効時はホバー効果なし */
  }
`;

const InstructionText = styled.p`
  font-size: 16px;
  color: #555;
  text-align: center;
  margin-bottom: 10px;
`;

// ==================== ヘルパー関数 ====================

const getAvatarUrl = (speaker: string): string => {
  return speaker === "student"
    ? "https://i.pravatar.cc/50?img=15" // 生徒のアバター
    : "https://i.pravatar.cc/50?img=5";  // 先生のアバター
};

// ==================== コンポーネント ====================

const Message: React.FC<DialogueLine> = ({ speaker, line }) => {
  const isStudent = speaker === "student";
  return (
    <MessageRow $isStudent={isStudent}>
      <Avatar src={getAvatarUrl(speaker)} alt={speaker} />
      <MessageBubble $isStudent={isStudent}>{line}</MessageBubble>
    </MessageRow>
  );
};

const DialogueCard: React.FC<DialogueCardProps> = ({ dialogueData, onDialogueCompleted }) => {
  const { id: dialogueId, title, dialogue } = dialogueData; // idも受け取る
  const [currentIndex, setCurrentIndex] = useState(1);
  const [rating, setRating] = useState(0);
  const [hasRated, setHasRated] = useState(false); // ★追加: ユーザーが評価を終えたかどうかの状態

  useEffect(() => {
    // ★変更: すべてのメッセージが表示され、かつまだ評価されていない場合のみタイマーをセット
    if (currentIndex < dialogue.length && !hasRated) {
      const timer = setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 2000); // 2秒ごとに次のメッセージを表示
      return () => clearTimeout(timer);
    }
  }, [currentIndex, dialogue.length, hasRated]); // hasRatedを依存配列に追加

  // 星をクリックしたときの処理
  const handleStarClick = (star: number) => {
    if (hasRated) return; // 既に評価済みなら何もしない

    setRating(star); // 選ばれた星の数を状態に保存
    setHasRated(true); // ★追加: 評価が完了したとマーク

    // ★追加: 親コンポーネントに通知する
    // 例: 少し遅延させてから通知すると、ユーザーがクリックした視覚的なフィードバックが得られる
    setTimeout(() => {
      onDialogueCompleted(dialogueId, star);
    }, 500); // 0.5秒後に次の会話へ進む
  };

  return (
    <CardContainer>
      <Title>{title}</Title>
      <ChatWrapper>
        {dialogue.slice(0, currentIndex).map((msg, index) => (
          <Message key={index} speaker={msg.speaker} line={msg.line} />
        ))}
      </ChatWrapper>

      {/* メッセージがすべて表示された後に表示される */}
      {currentIndex === dialogue.length && (
        <StarsWrapper>
          <InstructionText>評価して次へ</InstructionText>

          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              active={star <= rating}
              onClick={() => handleStarClick(star)}
              disabled={hasRated} // ★追加: 評価後はクリックできないようにする
            >
              ★
            </Star>
          ))}
        </StarsWrapper>
      )}
    </CardContainer>
  );
};

export default DialogueCard;
