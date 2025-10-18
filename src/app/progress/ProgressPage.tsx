"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { auth } from "../../firebase"
import { onAuthStateChanged } from "firebase/auth"
import { ArrowLeft, Settings, Trophy, Flame, GraduationCap, Target, Home, TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../../components/ui/chart"
import "./ProgressPage.css"
import "../../../src/styles/common.css"
import "../../../src/styles/components.css"

interface StudyStats {
  totalQuestions: number
  totalTime: number
  accuracy: number
}

interface DailyActivity {
  date: string
  questions: number
}

interface StudyHistoryItem {
  question: string
  subject: string
  correct: boolean
  date: string
}

interface BadgeItem {
  id: string
  name: string
  icon: React.ReactNode
  earned: boolean
}

export default function ProgressPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<StudyStats>({
    totalQuestions: 0,
    totalTime: 0,
    accuracy: 0,
  })
  const [dailyActivity, setDailyActivity] = useState<DailyActivity[]>([])
  const [studyHistory, setStudyHistory] = useState<StudyHistoryItem[]>([])
  const [badges] = useState<BadgeItem[]>([
    { id: "1", name: "初級マスター", icon: <Trophy style={{ width: "2rem", height: "2rem" }} />, earned: true },
    { id: "2", name: "連続7日学習", icon: <Flame style={{ width: "2rem", height: "2rem" }} />, earned: true },
    { id: "3", name: "歴史博士", icon: <GraduationCap style={{ width: "2rem", height: "2rem" }} />, earned: true },
    { id: "4", name: "100問正解", icon: <Target style={{ width: "2rem", height: "2rem" }} />, earned: false },
  ])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login")
        return
      }

      try {
        setStats({
          totalQuestions: 1234,
          totalTime: 625,
          accuracy: 85,
        })

        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date()
          date.setDate(date.getDate() - (6 - i))
          return {
            date: `${date.getMonth() + 1}/${date.getDate()}`,
            questions: Math.floor(Math.random() * 50) + 10,
          }
        })
        setDailyActivity(last7Days)

        setStudyHistory([
          {
            question: "日本の首都は？",
            subject: "歴史",
            correct: true,
            date: "2023/10/27",
          },
          {
            question: "世界で一番高い山は？",
            subject: "科学",
            correct: false,
            date: "2023/10/27",
          },
        ])

        setLoading(false)
      } catch (error) {
        console.error("Error fetching progress data:", error)
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [navigate])

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  if (loading) {
    return (
      <div className="progress-page" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: "1.125rem", color: "#6b7280" }}>読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="progress-page">
      <header className="progress-header">
        <button onClick={() => navigate(-1)} className="button button-ghost button-icon">
          <ArrowLeft style={{ width: "1.25rem", height: "1.25rem" }} />
        </button>
        <h1 className="progress-header-title">学習の記録</h1>
        <Link to="/settings">
          <button className="button button-ghost button-icon">
            <Settings style={{ width: "1.25rem", height: "1.25rem" }} />
          </button>
        </Link>
      </header>

      <div className="progress-content">
        <div className="progress-stats-card">
          <div className="progress-stats-label">学習した雑学</div>
          <div className="progress-stats-value">{stats.totalQuestions.toLocaleString()}</div>
        </div>

        <div className="progress-stats-card">
          <div className="progress-stats-label">総学習時間</div>
          <div className="progress-stats-value">{formatTime(stats.totalTime)}</div>
        </div>

        <div className="progress-stats-card">
          <div className="progress-stats-label">正解率</div>
          <div className="progress-stats-value">{stats.accuracy}%</div>
        </div>

        <div className="progress-chart-card">
          <h2 className="progress-chart-title">1日の学習活動</h2>
          <div className="progress-chart-container">
            <ChartContainer
              config={{
                questions: {
                  label: "問題数",
                  color: "#3b82f6",
                },
              }}
              style={{ height: "200px", minWidth: "300px" }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 12 }} tickLine={false} />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} tickLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="questions" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>

        <div className="progress-chart-card">
          <h2 className="progress-chart-title">獲得したバッジ</h2>
          <div className="progress-badges-grid">
            {badges.map((badge) => (
              <div key={badge.id} className="progress-badge-item">
                <div
                  className={`progress-badge-icon ${badge.earned ? "progress-badge-earned" : "progress-badge-locked"}`}
                >
                  {badge.icon}
                </div>
                <div className="progress-badge-name">{badge.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 学習履歴部分 */}
        <div className="progress-chart-card">
          <h2 className="progress-chart-title">学習履歴</h2>
          <div className="progress-history-list">
            {studyHistory
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // 日付降順に並べ替え
              .map((item, index) => (
                <div key={index} className="progress-history-item">
                  {/* 日付をメインに大きく表示 */}
                  <div className="progress-history-date">{item.date}</div>

                  {/* サブ情報（質問内容と科目）を小さく表示 */}
                  <div className="progress-history-content">
                    <div className="progress-history-question">{item.question}</div>
                    <div className="progress-history-meta">{item.subject}</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

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
  )
}
