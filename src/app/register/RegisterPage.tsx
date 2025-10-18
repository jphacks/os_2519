"use client"

import type React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "../../firebase"
import "./RegisterPage.css"
import { setInitialUserInfo } from "../../database/userInfo"

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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const uid = user.uid
      await setInitialUserInfo(uid, email)

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
    <div className="register-page">
      <div className="register-content">
        <div style={{ marginBottom: "2rem" }}>
          <h1 className="register-title">新規登録</h1>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          {error && <div className="register-error">{error}</div>}

          <div className="register-field">
            <label htmlFor="email" className="register-label">
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="register-input"
              required
              disabled={loading}
            />
          </div>

          <div className="register-field">
            <label htmlFor="password" className="register-label">
              パスワード
            </label>
            <div className="register-password-field">
              <input
                id="password"
                type="password"
                placeholder="パスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="register-input"
                style={{ paddingRight: "6rem" }}
                required
                disabled={loading}
              />
              <div className="register-password-strength">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`register-strength-bar ${level <= passwordStrength ? "register-strength-bar-active" : "register-strength-bar-inactive"}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <button type="submit" className="register-button" disabled={loading}>
            {loading ? "登録中..." : "登録"}
          </button>
        </form>

        <div style={{ marginTop: "2rem" }}>
          <p className="register-link-text">
            すでにアカウントをお持ちの方は{" "}
            <Link to="/login" className="register-link">
              ログイン
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
