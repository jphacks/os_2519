import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Home, TrendingUp, Settings } from "lucide-react"

export default function HomePage() {
  const categories = [
    { id: "history", name: "歴史", icon: "🏛️", color: "bg-amber-900" },
    { id: "science", name: "科学", icon: "🔬", color: "bg-blue-900" },
    { id: "art", name: "芸術", icon: "🎨", color: "bg-amber-100" },
    { id: "trivia", name: "雑学", icon: "🏙️", color: "bg-gray-400" },
    { id: "food", name: "食べ物", icon: "🍔", color: "bg-amber-700" },
    { id: "sports", name: "スポーツ", icon: "🏃", color: "bg-orange-500" },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <header className="py-6 text-center">
        <h1 className="text-2xl font-bold text-foreground">雑学</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 pb-24">
        {/* Today's Trivia Section */}
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-bold text-foreground">今日の雑学</h2>
          <Link href="/trivia/today" className="block">
            <Card className="overflow-hidden border-none shadow-lg transition-transform hover:scale-[1.02]">
              <div className="aspect-video w-full overflow-hidden bg-gradient-to-br from-amber-700 to-amber-400">
                <img src="/sliced-bread-loaf-on-brown-background.jpg" alt="パンの画像" className="h-full w-full object-cover" />
              </div>
              <div className="p-4">
                <h3 className="mb-2 text-lg font-bold text-foreground">パンはなぜ「一斤」で計数するの？</h3>
                <p className="mb-2 text-sm leading-relaxed text-muted-foreground">
                  パンは、その形と製法から「一斤」で計数される。これは、パンがそのままでは完全な形をしていないことに起因する。
                </p>
                <span className="text-xs text-muted-foreground">雑学</span>
              </div>
            </Card>
          </Link>
        </section>

        {/* Categories Section */}
        <section>
          <h2 className="mb-4 text-xl font-bold text-foreground">カテゴリー</h2>
          <div className="grid grid-cols-2 gap-4">
            {categories.map((category) => (
              <Link key={category.id} href={`/category/${category.id}`} className="block">
                <Card className="flex items-center gap-3 border-none p-4 shadow-md transition-transform hover:scale-[1.02]">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${category.color} text-2xl`}>
                    {category.icon}
                  </div>
                  <span className="text-base font-semibold text-foreground">{category.name}</span>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-background">
        <div className="flex items-center justify-around py-3">
          <Link href="/" className="flex flex-col items-center gap-1 text-foreground">
            <Home className="h-6 w-6" />
            <span className="text-xs">ホーム</span>
          </Link>
          <Link href="/progress" className="flex flex-col items-center gap-1 text-muted-foreground">
            <TrendingUp className="h-6 w-6" />
            <span className="text-xs">進捗</span>
          </Link>
          <Link href="/settings" className="flex flex-col items-center gap-1 text-muted-foreground">
            <Settings className="h-6 w-6" />
            <span className="text-xs">設定</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
