"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { onAuthStateChanged } from "firebase/auth"
import { Home, TrendingUp, Settings } from "lucide-react"
import { auth } from "../../firebase"

export default function StartPage() {
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
      <div className="min-h-screen flex items-center justify-center bg-[#e8e3d8]">
        <div className="text-lg text-gray-600">読み込み中...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#e8e3d8] p-4">
        <div className="w-full max-w-md space-y-6 text-center">
          <h1 className="text-4xl font-bold text-[#3d3d3d] mb-8">ようこそ</h1>

          <div className="space-y-4">
            <Link to="/login" className="block">
              <Button className="w-full h-16 bg-[#c89456] hover:bg-[#b8844a] text-white text-xl font-medium rounded-2xl shadow-md transition-colors">
                ログイン
              </Button>
            </Link>

            <Link to="/register" className="block">
              <Button
                variant="outline"
                className="w-full h-16 bg-white hover:bg-gray-50 text-[#3d3d3d] text-xl font-medium rounded-2xl shadow-md border-none transition-colors"
              >
                新規登録
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5f5f0] pb-20">
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <h1 className="text-xl font-bold text-center">学習アプリ</h1>
      </header>

      <div className="px-4 py-6 space-y-4">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">学習を始めましょう！</h2>
          <p className="text-gray-600">進捗ページで学習記録を確認できます</p>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex items-center justify-around">
          <Link to="/" className="flex flex-col items-center gap-1 text-blue-500">
            <Home className="h-6 w-6" />
            <span className="text-xs">ホーム</span>
          </Link>
          <Link to="/progress" className="flex flex-col items-center gap-1 text-gray-600">
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
