"use client"

import type React from "react"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Label } from "../../components/ui/label"
import { signInWithEmailAndPassword } from "firebase/auth"
import { Input } from "../../components/ui/input"
import { auth } from "../../firebase"
import "../../index.css"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate("/")
    } catch (err: any) {
      console.error("Login error:", err)
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        setError("メールアドレスまたはパスワードが正しくありません")
      } else if (err.code === "auth/invalid-email") {
        setError("メールアドレスの形式が正しくありません")
      } else if (err.code === "auth/too-many-requests") {
        setError("ログイン試行回数が多すぎます。しばらくしてから再度お試しください")
      } else {
        setError("ログインに失敗しました。もう一度お試しください")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e8e3d8] p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#3d3d3d] mb-2">ログイン</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#3d3d3d] text-base font-normal">
              メールアドレス
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-20 bg-white border-none shadow-md rounded-2xl text-[#3d3d3d] placeholder:text-[#9ca3af] text-lg px-6"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-[#3d3d3d] text-base font-normal">
              パスワード
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-20 bg-white border-none shadow-md rounded-2xl text-[#3d3d3d] placeholder:text-[#9ca3af] text-lg px-6"
              required
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            className="w-full h-20 bg-[#c89456] hover:bg-[#b8844a] text-white text-2xl font-medium rounded-2xl shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "ログイン中..." : "ログイン"}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-[#3d3d3d] text-sm">
            アカウントをお持ちでない方は{" "}
            <Link to="/register" className="text-[#c89456] hover:underline font-medium">
              新規登録
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
