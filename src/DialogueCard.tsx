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
`;

const Star = styled.span<{ active: boolean }>`
  font-size: 30px;
  cursor: pointer;
  color: ${(props) => (props.active ? "#FFD700" : "#D3D3D3")};

  &:hover {
    color: #ffcc00;
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

const DialogueCard: React.FC<DialogueCardProps> = ({ dialogueData }) => {
  const { title, dialogue } = dialogueData;

  const [currentIndex, setCurrentIndex] = useState(1); // 最初に1をセット
  const [rating, setRating] = useState(0); // ユーザーの評価

  useEffect(() => {
    if (currentIndex < dialogue.length) {
      const timer = setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 2000); // 2秒ごとに次のメッセージを表示
      return () => clearTimeout(timer);
    }
  }, [currentIndex, dialogue.length]);

  // 星をクリックしたときの処理
  const handleStarClick = (star: number) => {
    setRating(star); // 選ばれた星の数を状態に保存
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
          {/* 「評価して次へ」のメッセージ */}
          <InstructionText>評価して次へ</InstructionText>

          {/* 星評価 (横並び) */}
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              active={star <= rating}
              onClick={() => handleStarClick(star)}
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
