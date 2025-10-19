"use client"

import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { auth } from "../../firebase"
import { onAuthStateChanged } from "firebase/auth"
import { Home, TrendingUp, Settings } from "lucide-react"
import "./StartPage .css"
import "../../../src/styles/common.css"

export default function HomePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // S3から取得する今日の雑学データ
  const [trivia, setTrivia] = useState<{
    id: string
    title: string
    description: string
    image: string
  } | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // 🔽 S3からtoday.jsonを読み取る
  useEffect(() => {
    fetch("https://sukimaknowledge.s3.ap-northeast-1.amazonaws.com/trivia/today.json")
      .then((res) => res.json())
      .then((data) => setTrivia(data))
      .catch((err) => console.error("Error loading trivia:", err))
  }, [])

  if (loading) {
    return (
      <div className="page-container">
        <div style={{ fontSize: "1.125rem", color: "#6b7280" }}>読み込み中...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="home-page">
        <div className="home-content">
          <h1 className="home-title">ようこそ</h1>

          <div className="home-buttons">
            <Link to="/login" className="home-button">
              ログイン
            </Link>

            <Link to="/register" className="home-button home-button-secondary">
              新規登録
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const categories = [
    { id: "おまかせ", name: "おまかせ", icon: "🎲", color: "#f59e0b" },
    { id: "歴史", name: "歴史", icon: "🏛️", color: "#6b8e4e" },
    { id: "自然科学", name: "自然・科学", icon: "🔬", color: "#4a7c9e" },
    { id: "テクノロジー", name: "テクノロジー", icon: "💻", color: "#d4b896" },
    { id: "アート・エンタメ", name: "アート・エンタメ", icon: "🎨", color: "#9ca3af" },
    { id: "スポーツ", name: "スポーツ", icon: "⚽", color: "#e89b4a" },
    { id: "生活・実用", name: "生活・実用", icon: "🛒", color: "#8b6f47" },
    { id: "サブカル・心理", name: "サブカル・心理", icon: "🎭", color: "#b37bc1" },
    { id: "グローバル・地域", name: "グローバル・地域", icon: "🌏", color: "#3fa7d6" },
    { id: "トレンド・現代社会", name: "トレンド・現代社会", icon: "📈", color: "#f5a623" },
    { id: "知的・哲学", name: "知的・哲学", icon: "🧠", color: "#6d549f" },
  ]

  const categoryIndexMap: Record<string, number> = {
    "おまかせ": -1,
    "歴史": 0,
    "自然科学": 1,
    "テクノロジー": 2,
    "アート・エンタメ": 3,
    "スポーツ": 4,
    "生活・実用": 5,
    "サブカル・心理": 6,
    "グローバル・地域": 7,
    "トレンド・現代社会": 8,
    "知的・哲学": 9,
  }

  return (
    <div className="home-main">
      <header className="home-header">
        <h1 className="home-header-title">雑学</h1>
      </header>

      <div className="home-scroll-content">
        <section className="today-trivia-section">
          <h2 className="section-title">今日の雑学</h2>

          {/* 🔽 trivia がロードできてから表示 */}
          {trivia ? (
            <div className="trivia-card" onClick={() => navigate(`../content?id=${trivia.id}`)}>
              <div className="trivia-image">
                <img src={trivia.image} alt={trivia.title} />
              </div>
              <div className="trivia-content">
                <h3 className="trivia-title">{trivia.title}</h3>
                <p className="trivia-description">{trivia.description}</p>
              </div>
            </div>
          ) : (
            <div style={{ color: "#6b7280" }}>読み込み中...</div>
          )}
        </section>

        <section className="categories-section">
          <h2 className="section-title">カテゴリー</h2>

          <div className="categories-grid">
            {categories.map((category) => {
              const n = categoryIndexMap[category.id] ?? -1
              return (
                <Link
                  key={category.id}
                  to={`/content?category=${n}`}
                  className="category-card"
                >
                  <div
                    className="category-icon"
                    style={{ backgroundColor: category.color }}
                  >
                    <span className="category-icon-text">{category.icon}</span>
                  </div>
                  <span className="category-name">
                    {category.name.split("・").map((part, i) => (
                      <span key={i}>
                        {part}
                        {i !== category.name.split("・").length - 1 && <br />}
                      </span>
                    ))}
                  </span>
                </Link>
              )
            })}
          </div>
        </section>
      </div>

      <nav className="bottom-nav">
        <div className="bottom-nav-content">
          <Link to="/" className="nav-link nav-link-active">
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
  )
}
