// DialogueSwipe.jsx (修正後)
import { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import DialogueCard from "./DialogueCard"; // DialogueCardをインポート

// ======= 会話データ =======
const dialogues = [
    {
        id: 1,
        title: "フランス革命の授業",
        dialogue: [
            {
                speaker: "student",
                line: "先生、今日は革命って聞いたけど、まさかバスティーユ牢獄に突撃とかはしませんよね！？怖いんですけど！",
            },
            { speaker: "teacher", line: "安心しなさい、今日はただの歴史の授業だよ。" },
            { speaker: "student", line: "よかったぁ！でも先生、ちょっと熱が入りすぎじゃないですか？" },
            { speaker: "teacher", line: "それがフランス革命のロマンというものだ！" },
            { speaker: "student", line: "ロマンって言われても… guillotine（ギロチン）とか怖いんですけど！" },
            { speaker: "teacher", line: "歴史は血と情熱でできているんだ！" },
            { speaker: "student", line: "情熱の方向、ちょっと怖いです先生！" },
            { speaker: "teacher", line: "よし、じゃあ今日の宿題は『革命とは何か』を400字で書いてくること！" },
            { speaker: "student", line: "やっぱり先生のほうが怖いです！！" },
        ],
    },
    {
        id: 2,
        title: "次の授業",
        dialogue: [
            { speaker: "teacher", line: "さて、次は産業革命について学ぼう。" },
            { speaker: "student", line: "また革命！？もうお腹いっぱいですよ！" },
        ],
    },
];

export default function DialogueSwipe() {
    const [index, setIndex] = useState(0);
    const controls = useAnimation();
    const current = dialogues[index];

    const handleSwipe = async (direction) => {
        await controls.start({
            x: direction === "right" ? 400 : -400,
            opacity: 0,
            rotate: direction === "right" ? 10 : -10,
            transition: { duration: 0.4 },
        });
        setIndex((prev) => (prev + 1) % dialogues.length);
        controls.set({ x: 0, opacity: 1, rotate: 0 });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-pink-50">
            <motion.div
                key={current.id}
                animate={controls}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(e, info) => {
                    if (info.offset.x > 120) handleSwipe("right");
                    else if (info.offset.x < -120) handleSwipe("left");
                }}
                className="bg-white w-full max-w-md shadow-2xl rounded-3xl p-4 flex flex-col"
            >
                {/* DialogueCardコンポーネントを呼び出し、currentデータを渡す */}
                <DialogueCard dialogueData={current} />
            </motion.div>

            {/* ====== ボタン操作 ====== */}
            <div className="flex gap-6 mt-6">
                <button
                    onClick={() => handleSwipe("left")}
                    className="px-5 py-2 rounded-full bg-red-100 text-red-600 font-semibold shadow hover:bg-red-200 transition"
                >
                    嫌い 👎
                </button>
                <button
                    onClick={() => handleSwipe("right")}
                    className="px-5 py-2 rounded-full bg-green-100 text-green-600 font-semibold shadow hover:bg-green-200 transition"
                >
                    好き 👍
                </button>
            </div>
        </div>
    );
}