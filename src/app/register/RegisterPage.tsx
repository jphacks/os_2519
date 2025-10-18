"use client"

import type React from "react"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Label } from "../../components/ui/label"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "../../firebase"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return 0
    if (password.length < 4) return 1
    if (password.length < 8) return 2
    if (password.length < 12) return 3
    return 4
  }

  const passwordStrength = getPasswordStrength(password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (password.length < 6) {
      setError("パスワードは6文字以上で入力してください")
      setLoading(false)
      return
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password)
      navigate("/")
    } catch (err: any) {
      console.error("Registration error:", err)
      if (err.code === "auth/email-already-in-use") {
        setError("このメールアドレスは既に使用されています")
      } else if (err.code === "auth/invalid-email") {
        setError("メールアドレスの形式が正しくありません")
      } else if (err.code === "auth/weak-password") {
        setError("パスワードが弱すぎます。より強力なパスワードを設定してください")
      } else {
        setError("登録に失敗しました。もう一度お試しください")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e8e3d8] p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#3d3d3d] mb-2">新規登録</h1>
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
            <div className="relative">
              <Input
                id="password"
                type="password"
                placeholder="パスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-20 bg-white border-none shadow-md rounded-2xl text-[#3d3d3d] placeholder:text-[#9ca3af] text-lg px-6 pr-24"
                required
                disabled={loading}
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-1">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`w-3 h-6 rounded-sm transition-colors ${
                      level <= passwordStrength ? "bg-[#6b9f5e]" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-20 bg-[#c89456] hover:bg-[#b8844a] text-white text-2xl font-medium rounded-2xl shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "登録中..." : "登録"}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-[#3d3d3d] text-sm">
            すでにアカウントをお持ちの方は{" "}
            <Link to="/login" className="text-[#c89456] hover:underline font-medium">
              ログイン
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
