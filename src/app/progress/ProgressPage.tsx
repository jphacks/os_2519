"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { onAuthStateChanged } from "firebase/auth"
import { Card } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { ArrowLeft, Settings, Trophy, Flame, GraduationCap, Target, Home, TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../../components/ui/chart"
import { auth } from "../../firebase"

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
    { id: "1", name: "初級マスター", icon: <Trophy className="h-8 w-8" />, earned: true },
    { id: "2", name: "連続7日学習", icon: <Flame className="h-8 w-8" />, earned: true },
    { id: "3", name: "歴史博士", icon: <GraduationCap className="h-8 w-8" />, earned: true },
    { id: "4", name: "100問正解", icon: <Target className="h-8 w-8" />, earned: false },
  ])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login")
        return
      }

      try {
        // Mock data for demonstration
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
      <div className="min-h-screen bg-[#f5f5f0] flex items-center justify-center">
        <div className="text-lg text-gray-600">読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5f5f0] pb-20">
      <header className="bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">学習の記録</h1>
        <Button variant="ghost" size="icon" asChild>
          <Link to="/settings">
            <Settings className="h-5 w-5" />
          </Link>
        </Button>
      </header>

      <div className="px-4 py-6 space-y-6">
        <Card className="p-6 bg-white">
          <div className="text-sm text-gray-600 mb-2">学習した雑学</div>
          <div className="text-4xl font-bold text-blue-500">{stats.totalQuestions.toLocaleString()}</div>
        </Card>

        <Card className="p-6 bg-white">
          <div className="text-sm text-gray-600 mb-2">総学習時間</div>
          <div className="text-4xl font-bold text-blue-500">{formatTime(stats.totalTime)}</div>
        </Card>

        <Card className="p-6 bg-white">
          <div className="text-sm text-gray-600 mb-2">正解率</div>
          <div className="text-4xl font-bold text-blue-500">{stats.accuracy}%</div>
        </Card>

        <Card className="p-6 bg-white">
          <h2 className="text-lg font-semibold mb-4">1日の学習活動</h2>
          <ChartContainer
            config={{
              questions: {
                label: "問題数",
                color: "#3b82f6",
              },
            }}
            className="h-[200px]"
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
        </Card>

        <Card className="p-6 bg-white">
          <h2 className="text-lg font-semibold mb-4">獲得したバッジ</h2>
          <div className="grid grid-cols-4 gap-4">
            {badges.map((badge) => (
              <div key={badge.id} className="flex flex-col items-center gap-2">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    badge.earned ? "bg-yellow-100 text-yellow-600" : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {badge.icon}
                </div>
                <div className="text-xs text-center text-gray-600">{badge.name}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-white">
          <h2 className="text-lg font-semibold mb-4">学習履歴</h2>
          <div className="space-y-3">
            {studyHistory.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      item.correct ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                    }`}
                  >
                    {item.correct ? "○" : "×"}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{item.question}</div>
                    <div className="text-xs text-gray-500">
                      {item.date} · {item.subject}
                    </div>
                  </div>
                </div>
                <div className={`text-sm font-medium ${item.correct ? "text-green-600" : "text-red-600"}`}>
                  {item.correct ? "正解" : "不正解"}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex items-center justify-around">
          <Link to="/" className="flex flex-col items-center gap-1 text-gray-600">
            <Home className="h-6 w-6" />
            <span className="text-xs">ホーム</span>
          </Link>
          <Link to="/progress" className="flex flex-col items-center gap-1 text-blue-500">
            <TrendingUp className="h-6 w-6" />
            <span className="text-xs">進捗</span>
          </Link>
          <Link to="/settings" className="flex flex-col items-center gap-1 text-gray-600">
            <Settings className="h-6 w-6" />
            <span className="text-xs">設定</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
