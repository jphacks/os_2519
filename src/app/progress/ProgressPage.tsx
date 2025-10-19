"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  ArrowLeft,
  Settings,
  Trophy,
  Flame,
  GraduationCap,
  Target,
  Home,
  TrendingUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../components/ui/chart";
import "./ProgressPage.css";
import "../../../src/styles/common.css";
import "../../../src/styles/components.css";
import { getUserInfo } from "../../database/userInfo";
import { Twitter, Facebook, MessageCircle } from "lucide-react";

interface StudyStats {
  totalQuestions: number;
  totalTime: number;
  accuracy: number;
}

interface DailyActivity {
  date: string;
  questions: number;
}

interface StudyHistoryItem {
  date: string;
  questions: string[];
}

interface BadgeItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  earned: boolean;
}

export default function ProgressPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StudyStats>({
    totalQuestions: 0,
    totalTime: 0,
    accuracy: 0,
  });
  const [todayStats, setTodayStats] = useState({ questions: 0, time: 0 });
  const [dailyActivity, setDailyActivity] = useState<DailyActivity[]>([]);
  const [studyHistory, setStudyHistory] = useState<StudyHistoryItem[]>([]);
  const [badges, setBadges] = useState<BadgeItem[]>([
    { id: "1", name: "10個制覇", icon: <Trophy style={{ width: "2rem", height: "2rem" }} />, earned: false },
    { id: "2", name: "連続7日学習", icon: <Flame style={{ width: "2rem", height: "2rem" }} />, earned: false },
    { id: "3", name: "50個制覇", icon: <GraduationCap style={{ width: "2rem", height: "2rem" }} />, earned: false },
    { id: "4", name: "100個制覇", icon: <Target style={{ width: "2rem", height: "2rem" }} />, earned: false },
  ]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const userData = await getUserInfo(user.uid);
        const readList = (userData?.readList || {}) as Record<string, string[]>;
        const newsReadList = (userData?.newsReadList || {}) as Record<string, string[]>;
        const studyTime = (userData?.studyTime || {}) as Record<string, number>;

        const today = new Date();
        const todayKey = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;
        const todayTimeKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

        const todayQuestions =
          (Array.isArray(readList[todayKey]) ? readList[todayKey].length : 0) +
          (Array.isArray(newsReadList[todayKey]) ? newsReadList[todayKey].length : 0);
        const todayTime = studyTime[todayTimeKey] || 0;

        const totalQuestions =
          Object.values(readList).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0) +
          Object.values(newsReadList).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0);
        const totalTime = Object.values(studyTime).reduce((sum, t) => sum + t, 0);

        setStats({ totalQuestions, totalTime, accuracy: 80 });
        setTodayStats({ questions: todayQuestions, time: todayTime });

        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setDate(today.getDate() - (6 - i));
          const key = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
          return { key, date: `${d.getMonth() + 1}/${d.getDate()}` };
        });

        const dailyActivityData: DailyActivity[] = last7Days.map(({ key, date }) => ({
          date,
          questions: (Array.isArray(readList[key]) ? readList[key].length : 0) + (Array.isArray(newsReadList[key]) ? newsReadList[key].length : 0),
        }));
        setDailyActivity(dailyActivityData);

        // 学習履歴（日付ごとにマージ、同じ日付は変えない）
        const allDates = Array.from(new Set([...Object.keys(readList), ...Object.keys(newsReadList)])).sort((a, b) => b.localeCompare(a));
        const historyData: StudyHistoryItem[] = allDates.map((dateKey) => {
          const formatted = `${dateKey.slice(0, 4)}/${dateKey.slice(4, 6)}/${dateKey.slice(6, 8)}`;
          const readQs = Array.isArray(readList[dateKey]) ? readList[dateKey] : [];
          const newsQs = Array.isArray(newsReadList[dateKey]) ? newsReadList[dateKey].map(q => `news:${q}`) : [];
          return { date: formatted, questions: [...readQs, ...newsQs] };
        });
        setStudyHistory(historyData);

        const consecutiveDays = last7Days.filter(({ key }) => readList[key] || newsReadList[key])?.length || 0;
        setBadges((prev) =>
          prev.map((b) => {
            if (b.id === "1" && totalQuestions > 10) return { ...b, earned: true };
            if (b.id === "2" && consecutiveDays >= 7) return { ...b, earned: true };
            if (b.id === "3" && totalQuestions >= 50) return { ...b, earned: true };
            if (b.id === "4" && totalQuestions >= 100) return { ...b, earned: true };
            return b;
          })
        );

        setLoading(false);
      } catch (error) {
        console.error("Error fetching progress data:", error);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${mins}m ${secs}s`;
  };

  const handleShare = useCallback(async () => {
    const text = `📊学習記録
✅${stats.totalQuestions}問学習
⏱️${formatTime(stats.totalTime)}
🎯正答率${stats.accuracy}%
あなたも隙間時間で知識を増やそう！`;
    const url = window.location.origin;

    if (navigator.share) {
      try {
        await navigator.share({ title: "学習記録", text, url });
        return null;
      } catch {}
    }

    const encodedText = encodeURIComponent(text);
    return {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodedText}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodedText}`,
      line: `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${encodedText}`,
      email: `mailto:?subject=${encodeURIComponent("学習記録")}&body=${encodedText}%0A${encodeURIComponent(url)}`,
    };
  }, [stats, formatTime]);

  if (loading) {
    return (
      <div className="progress-page flex items-center justify-center">
        <div style={{ fontSize: "1.125rem", color: "#6b7280" }}>読み込み中...</div>
      </div>
    );
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
        {/* 統計カード */}
        <div className="progress-stats-card">
          <div className="progress-stats-label">学習した雑学・ニュース（全体）</div>
          <div className="progress-stats-value">{stats.totalQuestions.toLocaleString()}</div>
          <div className="progress-stats-sub">今日: {todayStats.questions.toLocaleString()}</div>
        </div>

        <div className="progress-stats-card">
          <div className="progress-stats-label">総学習時間（全体）</div>
          <div className="progress-stats-value">{formatTime(stats.totalTime)}</div>
          <div className="progress-stats-sub">今日: {formatTime(todayStats.time)}</div>
        </div>

        {/* 日次アクティビティ */}
        <div className="progress-chart-card">
          <h2 className="progress-chart-title">1日の学習活動</h2>
          <div className="progress-chart-container">
            <ChartContainer config={{ questions: { label: "問題数", color: "#3b82f6" } }} style={{ height: "200px", minWidth: "100%" }}>
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

        {/* バッジ */}
        <div className="progress-chart-card">
          <h2 className="progress-chart-title">獲得したバッジ</h2>
          <div className="progress-badges-grid">
            {badges.map((badge) => (
              <div key={badge.id} className="progress-badge-item">
                <div className={`progress-badge-icon ${badge.earned ? "progress-badge-earned" : "progress-badge-locked"}`}>
                  {badge.icon}
                </div>
                <div className="progress-badge-name">{badge.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 学習履歴 */}
        <div className="progress-chart-card">
          <h2 className="progress-chart-title">学習履歴</h2>
          <div className="progress-history-list">
            {studyHistory.map((item, index) => (
              <div key={index} className="progress-history-item">
                <div className="progress-history-date">{item.date}</div>
                <div className="progress-history-content">
                  {item.questions.map((q, i) => {
                    const isNews = q.startsWith("news:");
                    const contentId = isNews ? q.slice(5) : q;
                    const link = isNews
                      ? `/newscontent?id=${encodeURIComponent(contentId)}`
                      : `/content?id=${encodeURIComponent(contentId)}`;
                    return (
                      <div key={i} className="progress-history-question">
                        ・
                        <Link to={link} className="progress-history-link">
                          {contentId}
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* シェアボタン */}
      <div className="share-buttons">
        <button
          onClick={async () => {
            const links = await handleShare();
            if (links?.twitter) window.open(links.twitter, "_blank");
          }}
          className="share-btn twitter"
        >
          <Twitter /> Twitter
        </button>
        <button
          onClick={async () => {
            const links = await handleShare();
            if (links?.facebook) window.open(links.facebook, "_blank");
          }}
          className="share-btn facebook"
        >
          <Facebook /> Facebook
        </button>
        <button
          onClick={async () => {
            const links = await handleShare();
            if (links?.line) window.open(links.line, "_blank");
          }}
          className="share-btn line"
        >
          <MessageCircle /> LINE
        </button>
      </div>

      {/* 下ナビ */}
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
  );
}
