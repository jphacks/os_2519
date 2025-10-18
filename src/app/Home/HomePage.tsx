"use client"

import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { auth } from "../../firebase"
import { onAuthStateChanged } from "firebase/auth"
import { Home, TrendingUp, Settings } from "lucide-react"
import "./HomePage.css"
import "../../../src/styles/common.css"

export default function HomePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user)
      setLoading(false)
    })

    return () => unsubscribe()
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
    { id: "history", name: "歴史", icon: "🏛️", color: "#6b8e4e" },
    { id: "science", name: "科学", icon: "🔬", color: "#4a7c9e" },
    { id: "art", name: "芸術", icon: "🎨", color: "#d4b896" },
    { id: "trivia", name: "雑学", icon: "🏛️", color: "#9ca3af" },
    { id: "food", name: "食べ物", icon: "🍽️", color: "#8b6f47" },
    { id: "sports", name: "スポーツ", icon: "⚽", color: "#e89b4a" },
  ]

  return (
    <div className="home-main">
      <header className="home-header">
        <h1 className="home-header-title">雑学</h1>
      </header>

      <div className="home-scroll-content">
        <section className="today-trivia-section">
          <h2 className="section-title">今日の雑学</h2>

          <div className="trivia-card">
            <div className="trivia-image">
              <img src="/sliced-bread-on-table.jpg" alt="パン" />
            </div>
            <div className="trivia-content">
              <h3 className="trivia-title">パンはなぜ「一斤」で計数するの？</h3>
              <p className="trivia-description">
                パンは、その形と製法から「一斤」で計数される。これは、パンがその形のままでは完全な形をしていないことに起因する。
              </p>
              <span className="trivia-tag">雑学</span>
            </div>
          </div>
        </section>

        <section className="categories-section">
          <h2 className="section-title">カテゴリー</h2>

          <div className="categories-grid">
            {categories.map((category) => (
              <Link key={category.id} to={`/category/${category.id}`} className="category-card">
                <div className="category-icon" style={{ backgroundColor: category.color }}>
                  <span className="category-icon-text">{category.icon}</span>
                </div>
                <span className="category-name">{category.name}</span>
              </Link>
            ))}
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
