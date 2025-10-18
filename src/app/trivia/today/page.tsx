import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function TodayTriviaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-4 px-4 py-4">
          <Link href="/" className="text-foreground">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-bold text-foreground">今日の雑学</h1>
        </div>
      </header>

      <main className="px-4 py-6">
        <Card className="overflow-hidden border-none shadow-lg">
          <div className="aspect-video w-full overflow-hidden bg-gradient-to-br from-amber-700 to-amber-400">
            <img src="/sliced-bread-loaf-on-brown-background.jpg" alt="パンの画像" className="h-full w-full object-cover" />
          </div>
          <div className="p-6">
            <h2 className="mb-4 text-2xl font-bold text-foreground">パンはなぜ「一斤」で計数するの？</h2>
            <div className="space-y-4 text-base leading-relaxed text-foreground">
              <p>
                パンは、その形と製法から「一斤」で計数される。これは、パンがそのままでは完全な形をしていないことに起因する。
              </p>
              <p>
                日本では、食パンの重量単位として「斤」が使われています。1斤は約340〜400グラムとされており、これは明治時代にイギリスから伝わったパンの単位「ポンド」に由来しています。
              </p>
              <p>
                当時、1ポンド（約453グラム）のパンが基準とされていましたが、日本では少し軽めの重量が定着し、現在の「1斤」という単位になりました。
              </p>
            </div>
            <div className="mt-6">
              <span className="inline-block rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">雑学</span>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}
