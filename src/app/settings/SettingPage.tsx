"use client";

import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ArrowLeft, Home, TrendingUp, Settings } from "lucide-react";

import "./SettingPage.css";
import "../../../src/styles/common.css";
import "../../../src/styles/components.css";
import TestSlider from "../../components/ui/Testslider";

export default function SettingsPage() {
  const navigate = useNavigate();
  const [randomness, setRandomness] = useState<number[]>([50]);
  const [loading, setLoading] = useState(true);

  // --- 🔹 Firestore から現在のrandomnessを読み取る ---
  useEffect(() => {
    const fetchRandomness = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (typeof data.randomness === "number") {
            setRandomness([data.randomness]);
          }
        } else {
          // 新しいユーザーなら初期値を保存
          await setDoc(userRef, { randomness: 50 }, { merge: true });
        }
      } catch (error) {
        console.error("❌ Error fetching randomness:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomness();
  }, []);

  // --- 🔹 randomess変更時にFirestoreへ保存 ---
  useEffect(() => {
    const user = auth.currentUser;
    if (!user || loading) return; // 初期読み込み中は保存しない

    const saveRandomness = async () => {
      try {
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, { randomness: randomness[0] }, { merge: true });
        console.log("✅ randomness updated:", randomness[0]);
      } catch (error) {
        console.error("❌ Error updating randomness:", error);
      }
    };

    saveRandomness();
  }, [randomness]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

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
        <div className="settings-card randomness-card">
          <h2 className="settings-title">コンテンツのランダム性</h2>
          <p className="settings-description">
            表示されるコンテンツのランダム性を調整できます
          </p>

          {loading ? (
            <p>読み込み中...</p>
          ) : (
            <div className="randomness-controls">
              <TestSlider
                randomness={randomness}
                setRandomness={setRandomness}
              />
              <div className="slider-values">
                <span className="slider-label">低</span>
                <span className="slider-value">{randomness[0]}</span>
                <span className="slider-label">高</span>
              </div>
            </div>
          )}
        </div>

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
  );
}
