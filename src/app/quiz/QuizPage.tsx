import { useEffect, useState } from "react"
import { getDocs, collection } from "firebase/firestore"
import { Link } from "react-router-dom";
import { db } from "../../firebase" // dbはinitialize済みFirestoreインスタンス
import "./QuizPage.css"
import { Home, TrendingUp, Settings } from "lucide-react";



type Quiz = {
  id: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
};

const TEST_QUIZZES: Quiz[] = [
  {
    id: "q1",
    question: "日本で一番高い山は？",
    correct_answer: "富士山",
    incorrect_answers: ["剣岳", "白山", "立山"],
  },
  {
    id: "q2",
    question: "ゴッホが描いた有名な絵は？",
    correct_answer: "ひまわり",
    incorrect_answers: ["モナリザ", "夜警", "ムンクの叫び"],
  },
  {
    id: "q3",
    question: "オリンピックの輪の色は？",
    correct_answer: "5色",
    incorrect_answers: ["4色", "6色", "3色"],
  }
  // 必要なだけ追加
];

function getRandomQuiz(array: Quiz[]): Quiz | null {
  if (!array.length) return null;
  const idx = Math.floor(Math.random() * array.length);
  return array[idx];
}

export default function QuizPage() {
  const [quizzes] = useState(TEST_QUIZZES); // Firestore → 配列へ入れ替え
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(quizzes[0] || null);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  function getRandomQuiz(array: Quiz[], excludeId?: string): Quiz | null {
    const filtered = excludeId ? array.filter(q => q.id !== excludeId) : array;
    if (!filtered.length) return null;
    const idx = Math.floor(Math.random() * filtered.length);
    return filtered[idx];
  }

  const handleAnswer = (answer: string) => {
    setSelected(answer);
    setShowFeedback(true);
    if (currentQuiz && answer === currentQuiz.correct_answer) setScore(s => s + 1);
  };

  const handleNext = () => {
    setSelected(null);
    setShowFeedback(false);
    const nextQuiz = getRandomQuiz(quizzes, currentQuiz?.id);
    setCurrentQuiz(nextQuiz);
  };

  if (!currentQuiz) return <div>Loading...</div>;
  const options = [currentQuiz.correct_answer, ...currentQuiz.incorrect_answers].sort(() => Math.random() - 0.5);

  return (
    <div className="quiz-container">
      <h2 className="quiz-question">{currentQuiz.question}</h2>
      <div className="quiz-options">
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => !showFeedback && handleAnswer(opt)}
            className={`quiz-option${showFeedback && opt === currentQuiz.correct_answer ? " correct" : ""}${selected === opt ? " selected" : ""}`}
            disabled={!!showFeedback}
          >
            {opt}
          </button>
        ))}
      </div>

      {showFeedback && (
        <div className="quiz-feedback">
          {selected === currentQuiz.correct_answer ? (
            <span className="correct-text">
              正解！<br />
              答え: <span>{currentQuiz.correct_answer}</span>
            </span>
          ) : (
            <span className="incorrect-text">
              不正解<br />
              答え: <span>{currentQuiz.correct_answer}</span><br />
              <Link to={`/content/${currentQuiz.id}`} className="explanation-link">
                学ぶ
              </Link>
            </span>
          )}
          <button className="quiz-next" onClick={handleNext}>Next</button>
        </div>
      )}

      {/* 下ナビ */}
      <nav className="bottom-nav">
        <div className="bottom-nav-content">
          <Link to="/" className="nav-link">
            <Home className="nav-icon" />
            <span className="nav-label">ホーム</span>
          </Link>
          <Link to="/progress" className="nav-link nav-link-active">
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