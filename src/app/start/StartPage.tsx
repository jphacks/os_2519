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

  return (
    <div className="progress-page">
      <header className="progress-header">
        <h1 className="progress-header-title" style={{ textAlign: "center", width: "100%" }}>
          学習アプリ
        </h1>
      </header>

      <div className="progress-content">
        <div style={{ textAlign: "center", padding: "3rem 0" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1f2937", marginBottom: "1rem" }}>
            学習を始めましょう!
          </h2>
          <p style={{ fontSize: "1rem", color: "#6b7280" }}>進捗ページで学習記録を確認できます</p>
        </div>
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
