// DialogueCard.jsx
import React from "react";

export default function DialogueCard({ dialogueData }) {
    return (
        <>
            <h2 className="text-lg font-semibold text-center mb-3 text-pink-600">
                {dialogueData.title}
            </h2>

            {/* ====== スクロールできる会話エリア ====== */}
            <div className="space-y-4 overflow-y-auto max-h-96 pr-2">
                {dialogueData.dialogue.map((d, i) => (
                    <div
                        key={i}
                        className={`flex items-end ${d.speaker === "student" ? "justify-end" : "justify-start"
                            }`}
                    >
                        {/* 左側（先生） */}
                        {d.speaker === "teacher" && (
                            <div className="flex items-end gap-2">
                                <img
                                    src="https://i.pravatar.cc/50?img=5"
                                    alt="teacher"
                                    className="w-10 h-10 rounded-full border border-gray-300"
                                />
                                <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-bl-none px-4 py-2 max-w-[70%] shadow">
                                    {d.line}
                                </div>
                            </div>
                        )}

                        {/* 右側（生徒） */}
                        {d.speaker === "student" && (
                            <div className="flex items-end gap-2 flex-row-reverse">
                                <img
                                    src="https://i.pravatar.cc/50?img=15"
                                    alt="student"
                                    className="w-10 h-10 rounded-full border border-pink-300"
                                />
                                <div className="bg-pink-500 text-white rounded-2xl rounded-br-none px-4 py-2 max-w-[70%] shadow">
                                    {d.line}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}