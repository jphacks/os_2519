"use client"

import { Link, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Card } from "../../components/ui/card"
import "./CategoryPage.css"

const categoryData: Record<string, { name: string; description: string; icon: string }> = {
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
}

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>()
  const category = categoryData[id || "trivia"] || categoryData.trivia

  return (
    <div className="category-page">
      <header className="category-header">
        <div className="category-header-content">
          <Link to="/" className="back-button">
            <ArrowLeft className="back-icon" />
          </Link>
          <h1 className="category-title">{category.name}</h1>
        </div>
      </header>

      <main className="category-main">
        <div className="category-intro">
          <div className="category-icon">{category.icon}</div>
          <p className="category-description">{category.description}</p>
        </div>

        <div className="category-items">
          {[1, 2, 3].map((item) => (
            <Card key={item} className="category-card">
              <h3 className="category-card-title">
                {category.name}の雑学 #{item}
              </h3>
              <p className="category-card-text">ここに{category.name}に関する興味深い雑学が表示されます。</p>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
