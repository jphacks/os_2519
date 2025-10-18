"use client"

import { useNavigate, Link } from "react-router-dom"
import { auth } from "../../firebase"
import { signOut } from "firebase/auth"
import { ArrowLeft, Home, TrendingUp, Settings } from "lucide-react"
import "./SettingPage.css"
import "../../../src/styles/common.css"
import "../../../src/styles/components.css"

export default function SettingsPage() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      navigate("/login")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <div className="settings-page">
      <header className="settings-header">
        <button
          onClick={() => navigate(-1)}
          className="button button-ghost button-icon"
          style={{ backgroundColor: "transparent" }}
        >
          <ArrowLeft style={{ width: "1.25rem", height: "1.25rem" }} />
        </button>
        <h1 className="settings-header-title">設定</h1>
        <div style={{ width: "2.5rem" }} />
      </header>

      <div className="settings-content">
        <div className="settings-card">
          <h2 className="settings-title">アカウント</h2>
          <button onClick={handleLogout} className="settings-logout-button">
            ログアウト
          </button>
        </div>
      </div>

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
          <Link to="/settings" className="nav-link nav-link-active">
            <Settings className="nav-icon" />
            <span className="nav-label">設定</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
