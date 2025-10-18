import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Home, TrendingUp, Settings } from "lucide-react";

import './QuizPage.css';

const API_URL = 'https://opentdb.com/api.php?amount=10&difficulty=medium';

type Quiz = {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
};

export default function QuizPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL)
      .then(res => {
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (!data.results || !Array.isArray(data.results)) throw new Error('No quiz data');
        setQuizzes(data.results);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="quiz-message">Loading...</div>;
  if (error) return <div className="quiz-message error">Error: {error}</div>;
  if (!quizzes.length) return <div className="quiz-message">No quiz found.</div>;

  const quiz = quizzes[current];
  const options = [...quiz.incorrect_answers, quiz.correct_answer].sort(() => Math.random() - 0.5);

  const handleAnswer = (answer: string) => {
    setSelected(answer);
    setShowFeedback(true);
    if (answer === quiz.correct_answer) setScore(score + 1);
  };

  const handleNext = () => {
    setSelected(null);
    setShowFeedback(false);
    if (current + 1 < quizzes.length) setCurrent(current + 1);
    else setShowResult(true);
  };

  if (showResult)
    return (
      <div className="quiz-container">
        <div className="quiz-score">Score: {score} / {quizzes.length}</div>
      </div>
    );

  return (
    <div className="quiz-container">
      <h2 dangerouslySetInnerHTML={{ __html: quiz.question }} className="quiz-question" />
      <div className="quiz-options">
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => !showFeedback && handleAnswer(opt)}
            className={`quiz-option ${
              showFeedback && quiz.correct_answer === opt
                ? 'correct'
                : showFeedback && selected === opt
                ? 'selected'
                : ''
            }`}
            dangerouslySetInnerHTML={{ __html: opt }}
            disabled={!!showFeedback}
          />
        ))}
      </div>

      {showFeedback && (
        <div className="quiz-feedback">
          {selected === quiz.correct_answer ? (
            <span className="correct-text">正解！</span>
          ) : (
            <span className="incorrect-text">
               不正解<br />
               答え: <span>{quiz.correct_answer}</span>
            </span>
          )}
          <button className="quiz-next" onClick={handleNext}>
            次へ
          </button>
        </div>
      )}

      <div className="quiz-progress">
        Question {current + 1} / {quizzes.length}
      </div>
            {/* ====== 共通フッターナビ (SettingPage と同じ) ====== */}
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
