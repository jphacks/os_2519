// DialogueCard.tsx (リファクタリング後)
import React from "react";
import styled from "styled-components";

// ==================== 型定義 ====================

// 個々の会話の行の型
interface DialogueLine {
    speaker: "student" | "teacher";
    line: string;
}

// DialogueCardコンポーネントが受け取るプロップスの型
interface DialogueCardProps {
    dialogueData: {
        id: number;
        title: string;
        dialogue: DialogueLine[];
    };
}

// styled-componentsのプロップスの型定義
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
  height: 100%; // 親要素の高さに合わせる
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
  text-align: center;
`;

const ChatWrapper = styled.div`
  flex-grow: 1; // 残りのスペースを埋める
  display: flex;
  flex-direction: column;
  justify-content: flex-start; // メッセージを上から表示
  overflow-y: auto; // メッセージが多くなったらスクロール
  padding-right: 5px; // スクロールバーとの間に少しスペース
  margin-right: -5px; // スクロールバーが隠れないように調整
  
  // スクロールバーのスタイル（WebKit系ブラウザ向け）
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
  word-break: break-word; // 長い単語でも折り返す
`;

const MessageRow = styled.div<MessageRowProps>`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  flex-direction: ${(props) => (props.$isStudent ? "row-reverse" : "row")};
  margin-bottom: 10px; // 各メッセージ行の下にスペースを追加
`;

// ==================== ヘルパー関数 ====================

// AvatarのURLを取得する関数
const getAvatarUrl = (speaker: string): string => {
    return speaker === "student"
        ? "https://i.pravatar.cc/50?img=15" // 生徒のアバター
        : "https://i.pravatar.cc/50?img=5";  // 先生のアバター
};

// ==================== コンポーネント ====================

// 個々のメッセージを表示するコンポーネント
const Message: React.FC<DialogueLine> = ({ speaker, line }) => {
    const isStudent = speaker === "student";
    return (
        <MessageRow $isStudent={isStudent}>
            <Avatar src={getAvatarUrl(speaker)} alt={speaker} />
            <MessageBubble $isStudent={isStudent}>{line}</MessageBubble>
        </MessageRow>
    );
};

// 会話セット全体を表示するコンポーネント
const DialogueCard: React.FC<DialogueCardProps> = ({ dialogueData }) => {
    const { title, dialogue } = dialogueData;

    return (
        <CardContainer>
            <Title>{title}</Title>
            <ChatWrapper>
                {dialogue.map((msg, index) => (
                    <Message key={index} speaker={msg.speaker} line={msg.line} />
                ))}
            </ChatWrapper>
        </CardContainer>
    );
};

export default DialogueCard;