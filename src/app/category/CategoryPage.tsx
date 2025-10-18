import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card } from "../../components/ui/card";

const categoryData: Record<
  string,
  { name: string; description: string; icon: string }
> = {
  history: {
    name: "歴史",
    description: "歴史に関する興味深い雑学を集めました",
    icon: "🏛️",
  },
  science: {
    name: "科学",
    description: "科学の不思議な世界を探求しましょう",
    icon: "🔬",
  },
  art: {
    name: "芸術",
    description: "芸術の奥深さを学びましょう",
    icon: "🎨",
  },
  trivia: {
    name: "雑学",
    description: "様々なジャンルの雑学を紹介します",
    icon: "🏙️",
  },
  food: {
    name: "食べ物",
    description: "食べ物に関する面白い知識",
    icon: "🍔",
  },
  sports: {
    name: "スポーツ",
    description: "スポーツの世界の豆知識",
    icon: "🏃",
  },
};

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = categoryData[id] || categoryData.trivia;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-4 px-4 py-4">
          <Link to="/" className="text-foreground">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-bold text-foreground">{category.name}</h1>
        </div>
      </header>

      <main className="px-4 py-6">
        <div className="mb-6 text-center">
          <div className="mb-4 text-6xl">{category.icon}</div>
          <p className="text-muted-foreground">{category.description}</p>
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <Card
              key={item}
              className="border-none p-4 shadow-md transition-transform hover:scale-[1.02]"
            >
              <h3 className="mb-2 font-bold text-foreground">
                {category.name}の雑学 #{item}
              </h3>
              <p className="text-sm text-muted-foreground">
                ここに{category.name}に関する興味深い雑学が表示されます。
              </p>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
