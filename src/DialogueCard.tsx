import React, { useState, useEffect } from "react";
import styled from "styled-components";

// ------------------- スタイル -------------------

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100vh;
  background-color: #fef2f2;
  padding: 20px;
  overflow-y: auto;
`;

const Avatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid #ccc;
  flex-shrink: 0;
`;

const MessageBubble = styled.div<{ $isStudent: boolean }>`
  background-color: ${(props) => (props.$isStudent ? "#f472b6" : "#e0e0e0")};
  color: ${(props) => (props.$isStudent ? "white" : "black")};
  border-radius: 15px;
  padding: 10px 14px;
  margin: 5px 0;
  max-width: 70%;
  align-self: ${(props) => (props.$isStudent ? "flex-end" : "flex-start")};
  position: relative;
`;

const MessageRow = styled.div<{ $isStudent: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  flex-direction: ${(props) => (props.$isStudent ? "row-reverse" : "row")};
`;

// ------------------- データ -------------------

const dialogues = [
    { speaker: "teacher", line: "こんにちは！今日の授業はフランス革命です。" },
    { speaker: "student", line: "えっ、革命ですか！？怖いです…" },
    { speaker: "teacher", line: "安心して、今日は歴史の話だけです。" },
    { speaker: "student", line: "よかった！でも先生、熱が入りすぎです！" },
    { speaker: "teacher", line: "それがフランス革命のロマンです！" },
];

// ------------------- コンポーネント -------------------

// AvatarのURLを取得するヘルパー関数
const getAvatarUrl = (speaker: string): string => {
    return speaker === "student"
        ? "https://i.pravatar.cc/50?img=15"
        : "https://i.pravatar.cc/50?img=5";
};

// メッセージを表示するコンポーネント
const Message: React.FC<{ speaker: string; line: string }> = ({ speaker, line }) => {
    const isStudent = speaker === "student";
    return (
        <MessageRow $isStudent={isStudent}>
            <Avatar src={getAvatarUrl(speaker)} alt={speaker} />
            <MessageBubble $isStudent={isStudent}>{line}</MessageBubble>
        </MessageRow>
    );
};

// チャットアプリ本体
const ChatApp: React.FC = () => {
    const [messages, setMessages] = useState(dialogues);

    useEffect(() => {
        const timer = setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                { speaker: "teacher", line: "今日の宿題は『革命とは何か』を書いてきてください！" },
            ]);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <ChatContainer>
            {messages.map((msg, index) => (
                <Message key={index} speaker={msg.speaker} line={msg.line} />
            ))}
        </ChatContainer>
    );
};

export default ChatApp;
