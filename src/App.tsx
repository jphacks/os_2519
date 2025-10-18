"use client"

import { Routes, Route, Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./firebase"
import StartPage from "./app/start/StartPage"
import LoginPage from "./app/login/LoginPage"
import RegisterPage from "./app/register/RegisterPage"
import ProgressPage from "./app/progress/ProgressPage"
import SettingsPage from "./app/settings/SettingPage"
import CategoryPage from "./app/category/CategoryPage"

function App() {
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

  return (
    <Routes>
      <Route path="/" element={<StartPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/category/:id" element={<CategoryPage />} />
      <Route path="/progress" element={isAuthenticated ? <ProgressPage /> : <Navigate to="/login" replace />} />
      <Route path="/settings" element={isAuthenticated ? <SettingsPage /> : <Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
