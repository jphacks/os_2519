"use client";

import React, { useState, useEffect, type FC } from "react";
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
  BarChart,
  Bar,
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
import { getUserInfo } from "../../database/userInfo";
import "./ProgressPage.css";
import "../../../src/styles/common.css";
import "../../../src/styles/components.css";

// === 型定義 ===
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

// === ユーティリティ ===
const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours}h ${mins}m ${secs}s`;
};

const createDateKey = (d: Date, sep = "") =>
  `${d.getFullYear()}${sep}${String(d.getMonth() + 1).padStart(2, "0")}${sep}${String(d.getDate()).padStart(2, "0")}`;

// === サブコンポーネント ===
const StatsCard: FC<{ label: string; value: string; sub: string }> = ({
  label,
  value,
  sub,
}) => (
  <div className="progress-stats-card">
    <div className="progress-stats-label">{label}</div>
    <div className="progress-stats-value">{value}</div>
    <div className="progress-stats-sub">{sub}</div>
  </div>
);

const ActivityChart: FC<{ data: DailyActivity[] }> = ({ data }) => (
  <div className="progress-chart-card">
    <h2 className="progress-chart-title">1日の学習活動</h2>
    <div className="progress-chart-container">
      <ChartContainer
        config={{ questions: { label: "問題数", color: "#3b82f6" } }}
        style={{ height: "200px", minWidth: "100%" }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#6b7280", fontSize: 12 }}
              tickLine={false}
            />
            <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} tickLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="questions" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  </div>
);

const BadgeList: FC<{ badges: BadgeItem[] }> = ({ badges }) => (
  <div className="progress-chart-card">
    <h2 className="progress-chart-title">獲得したバッジ</h2>
    <div className="progress-badges-grid">
      {badges.map((badge) => (
        <div key={badge.id} className="progress-badge-item">
          <div
            className={`progress-badge-icon ${badge.earned
                ? "progress-badge-earned"
                : "progress-badge-locked"
              }`}
          >
            {badge.icon}
          </div>
          <div className="progress-badge-name">{badge.name}</div>
        </div>
      ))}
    </div>
  </div>
);

const HistoryList: FC<{ history: StudyHistoryItem[] }> = ({ history }) => (
  <div className="progress-chart-card">
    <h2 className="progress-chart-title">学習履歴</h2>
    <div className="progress-history-list">
      {history.map((item, index) => (
        <div key={index} className="progress-history-item">
          <div className="progress-history-date">{item.date}</div>
          <div className="progress-history-content">
            {item.questions.map((q, i) => (
              <div key={i} className="progress-history-question">
                ・{q}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);
// 新しく獲得したバッジを検出するユーティリティ関数
const compareBadges = (prev: BadgeItem[], current: BadgeItem[]) => {
  return current.filter((currBadge) => {
    const prevBadge = prev.find((b) => b.id === currBadge.id);
    return currBadge.earned && !(prevBadge?.earned);
  });
};


// === メインコンポーネント ===
const ProgressPage: FC = () => {
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
    { id: "1", name: "初級マスター", icon: <Trophy />, earned: false },
    { id: "2", name: "連続7日学習", icon: <Flame />, earned: false },
    { id: "3", name: "１時間学習達成", icon: <GraduationCap />, earned: false },
    { id: "4", name: "100問学習", icon: <Target />, earned: false },
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
        const studyTime = (userData?.studyTime || {}) as Record<string, number>;

        const today = new Date();
        const todayKey = createDateKey(today);
        const todayTimeKey = createDateKey(today, "-");

        const todayQuestions = Array.isArray(readList[todayKey])
          ? readList[todayKey].length
          : 0;
        const todayTime = studyTime[todayTimeKey] || 0;

        const totalQuestions = Object.values(readList).reduce(
          (sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0),
          0
        );
        const totalTime = Object.values(studyTime).reduce((sum, t) => sum + t, 0);

        setStats({ totalQuestions, totalTime, accuracy: 80 });
        setTodayStats({ questions: todayQuestions, time: todayTime });

        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setDate(today.getDate() - (6 - i));
          return {
            key: createDateKey(d),
            date: `${d.getMonth() + 1}/${d.getDate()}`,
          };
        });

        const dailyActivityData = last7Days.map(({ key, date }) => ({
          date,
          questions: Array.isArray(readList[key]) ? readList[key].length : 0,
        }));
        setDailyActivity(dailyActivityData);

        const historyData = Object.entries(readList)
          .map(([dateKey, questions]) => ({
            date: `${dateKey.slice(0, 4)}/${dateKey.slice(4, 6)}/${dateKey.slice(6, 8)}`,
            questions,
          }))
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setStudyHistory(historyData);

        const consecutiveDays =
          last7Days.filter(({ key }) => readList[key])?.length || 0;

        // === バッジ処理ここから ===
        const updatedBadges = badges.map((b) => ({
          ...b,
          earned:
            (b.id === "1" && totalQuestions > 0) ||
            (b.id === "2" && totalTime >= 3600) ||
            (b.id === "3" && consecutiveDays >= 7) ||
            (b.id === "4" && totalQuestions >= 100),
        }));

        // 前回のバッジ情報を localStorage から取得
        const prevBadgeJSON = localStorage.getItem("prevBadges");
        const prevBadges: BadgeItem[] = prevBadgeJSON ? JSON.parse(prevBadgeJSON) : [];

        // 新しく獲得したバッジだけを抽出
        const newEarnedBadges = compareBadges(prevBadges, updatedBadges);

        // 通知（alert）表示
        if (newEarnedBadges.length > 0) {
          alert(
            `🎉 新しいバッジを獲得しました！\n\n${newEarnedBadges
              .map((b) => `🏅 ${b.name}`)
              .join("\n")}`
          );
        }

        // localStorage に今回のバッジ状態を保存
        // localStorage に今回のバッジ状態を保存（icon 除外）
        const badgesToSave = updatedBadges.map(({ id, name, earned }) => ({
          id,
          name,
          earned,
        }));
        localStorage.setItem("prevBadges", JSON.stringify(badgesToSave));

        setBadges(updatedBadges);
        // === バッジ処理ここまで ===

        setLoading(false);
      } catch (err) {
        console.error("Error fetching progress data:", err);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);


  if (loading)
    return (
      <div className="progress-page flex items-center justify-center">
        <p className="text-gray-500 text-lg">読み込み中...</p>
      </div>
    );

  return (
    <div className="progress-page">
      <header className="progress-header">
        <button onClick={() => navigate(-1)} className="button button-ghost button-icon">
          <ArrowLeft />
        </button>
        <h1 className="progress-header-title">学習の記録</h1>
        <Link to="/settings">
          <button className="button button-ghost button-icon">
            <Settings />
          </button>
        </Link>
      </header>

      <div className="progress-content">
        <StatsCard
          label="学習した雑学（全体）"
          value={stats.totalQuestions.toLocaleString()}
          sub={`今日: ${todayStats.questions.toLocaleString()}`}
        />
        <StatsCard
          label="総学習時間（全体）"
          value={formatTime(stats.totalTime)}
          sub={`今日: ${formatTime(todayStats.time)}`}
        />

        <ActivityChart data={dailyActivity} />
        <BadgeList badges={badges} />
        <HistoryList history={studyHistory} />
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
  );
};

export default ProgressPage;
