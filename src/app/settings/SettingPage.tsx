"use client"

import { useNavigate, Link } from "react-router-dom"
import { signOut } from "firebase/auth"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { ArrowLeft, Home, TrendingUp, Settings } from "lucide-react"
import { auth } from "../../firebase"

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
    <div className="min-h-screen bg-[#f5f5f0] pb-20">
      <header className="bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">設定</h1>
        <div className="w-10" />
      </header>

      <div className="px-4 py-6 space-y-4">
        <Card className="p-6 bg-white">
          <h2 className="text-lg font-semibold mb-4">アカウント</h2>
          <Button onClick={handleLogout} variant="destructive" className="w-full">
            ログアウト
          </Button>
        </Card>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex items-center justify-around">
          <Link to="/" className="flex flex-col items-center gap-1 text-gray-600">
            <Home className="h-6 w-6" />
            <span className="text-xs">ホーム</span>
          </Link>
          <Link to="/progress" className="flex flex-col items-center gap-1 text-gray-600">
            <TrendingUp className="h-6 w-6" />
            <span className="text-xs">進捗</span>
          </Link>
          <Link to="/settings" className="flex flex-col items-center gap-1 text-blue-500">
            <Settings className="h-6 w-6" />
            <span className="text-xs">設定</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
