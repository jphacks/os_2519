import { Link } from "react-router-dom";
import { Home, TrendingUp, Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-orange-50 to-white">
      <header className="py-6 text-center">
        <h1 className="text-2xl font-bold text-foreground">設定</h1>
      </header>

      <main className="flex-1 px-4 pb-24">
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground">設定ページ（準備中）</p>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-background">
        <div className="flex items-center justify-around py-3">
          <Link
            to="/"
            className="flex flex-col items-center gap-1 text-muted-foreground"
          >
            <Home className="h-6 w-6" />
            <span className="text-xs">ホーム</span>
          </Link>
          <Link
            to="/progress"
            className="flex flex-col items-center gap-1 text-muted-foreground"
          >
            <TrendingUp className="h-6 w-6" />
            <span className="text-xs">進捗</span>
          </Link>
          <Link
            to="/settings"
            className="flex flex-col items-center gap-1 text-foreground"
          >
            <Settings className="h-6 w-6" />
            <span className="text-xs">設定</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
