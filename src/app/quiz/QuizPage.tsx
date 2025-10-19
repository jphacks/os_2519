import { useEffect, useState } from "react"
import { getDocs, collection } from "firebase/firestore"
import { Link } from "react-router-dom";
import { db } from "../../firebase"
import "./QuizPage.css"
import { Home, TrendingUp, Settings } from "lucide-react";

type Quiz = {
  id: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
};

export default function QuizPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firestoreからcontentsコレクション取得
    getDocs(collection(db, "contents"))
      .then(snapshot => {
        const fetchedQuizzes: Quiz[] = [];
        snapshot.docs.forEach(doc => {
          const data = doc.data();
          // quizフィールド（マップ）が存在するか確認
          if (data.quiz && data.quiz.question) {
            fetchedQuizzes.push({
              id: doc.id, // ドキュメントIDをクイズIDとして使用
              question: data.quiz.question,
              correct_answer: data.quiz.correct_answer,
              incorrect_answers: data.quiz.incorrect_answers || []
            });
          }
        });
        setQuizzes(fetchedQuizzes);
        // 最初のクイズをランダムで選択
        if (fetchedQuizzes.length > 0) {
          const randomIdx = Math.floor(Math.random() * fetchedQuizzes.length);
          setCurrentQuiz(fetchedQuizzes[randomIdx]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Firestore fetch error:", err);
        setLoading(false);
      });
  }, []);

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

  if (loading) return <div>Loading...</div>;
  if (!currentQuiz) return <div>クイズが見つかりません</div>;

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
