import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Heart,
  Bookmark,
  Share2,
  User,
  Eye,
  ThumbsUp,
  MessageCircle,
} from "lucide-react";

// SEO用のHelmet風コンポーネント
const SEOHead = ({
  title,
  description,
  keywords,
  author,
  publishedAt,
  image,
  url,
}) => {
  useEffect(() => {
    // タイトルの設定
    document.title = title
      ? `${title} | Tech Blog`
      : "Tech Blog - プログラミングと技術の記事";

    // メタタグの設定
    const setMetaTag = (name, content) => {
      let meta =
        document.querySelector(`meta[name="${name}"]`) ||
        document.querySelector(`meta[property="${name}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        if (name.startsWith("og:") || name.startsWith("twitter:")) {
          meta.setAttribute("property", name);
        } else {
          meta.setAttribute("name", name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    // 基本メタタグ
    setMetaTag("description", description);
    setMetaTag("keywords", keywords);
    setMetaTag("author", author);

    // OGP (Open Graph Protocol)
    setMetaTag("og:title", title);
    setMetaTag("og:description", description);
    setMetaTag("og:type", "article");
    setMetaTag("og:url", url);
    setMetaTag("og:image", image);
    setMetaTag("og:site_name", "Tech Blog");

    // Twitter Card
    setMetaTag("twitter:card", "summary_large_image");
    setMetaTag("twitter:title", title);
    setMetaTag("twitter:description", description);
    setMetaTag("twitter:image", image);

    // 記事用メタタグ
    if (publishedAt) {
      setMetaTag("article:published_time", publishedAt);
      setMetaTag("article:author", author);
    }

    // 構造化データ (JSON-LD)
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      description: description,
      author: {
        "@type": "Person",
        name: author,
      },
      datePublished: publishedAt,
      publisher: {
        "@type": "Organization",
        name: "Tech Blog",
        url: "https://yourdomain.com",
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": url,
      },
    };

    let jsonLdScript = document.querySelector(
      'script[type="application/ld+json"]',
    );
    if (!jsonLdScript) {
      jsonLdScript = document.createElement("script");
      jsonLdScript.type = "application/ld+json";
      document.head.appendChild(jsonLdScript);
    }
    jsonLdScript.textContent = JSON.stringify(structuredData);
  }, [title, description, keywords, author, publishedAt, image, url]);

  return null;
};

const ZennBlog = () => {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [likes, setLikes] = useState({});
  const [bookmarks, setBookmarks] = useState({});

  // サンプル記事データ（実際の開発では別ファイルやAPIから取得）
  const sampleArticles = [
    {
      id: 1,
      title: "React + Vite で始める現代的なフロントエンド開発",
      slug: "react-vite-modern-frontend",
      emoji: "⚡",
      type: "tech",
      topics: ["React", "Vite", "JavaScript"],
      publishedAt: "2024-03-15",
      readTime: "5 min",
      likes: 24,
      bookmarks: 8,
      views: 156,
      author: {
        name: "田中太郎",
        avatar: "https://via.placeholder.com/40x40/3B82F6/FFFFFF?text=T",
        username: "tanaka_taro",
      },
      content: `# React + Vite で始める現代的なフロントエンド開発

## はじめに

現代のフロントエンド開発において、**React**と**Vite**の組み合わせは非常に強力です。この記事では、React + Viteを使った開発環境の構築から基本的な使い方まで解説します。

## Viteとは？

Viteは、Evan You（Vue.jsの作者）によって開発された次世代のフロントエンドビルドツールです。

### 主な特徴

- **高速な開発サーバー**: ESモジュールを活用したHMR（Hot Module Replacement）
- **最適化されたビルド**: Rollupベースの本番ビルド
- **TypeScript サポート**: 設定不要でTypeScriptが使える
- **プラグインエコシステム**: 豊富なプラグイン

## セットアップ

### 1. プロジェクトの作成

\`\`\`bash
npm create vite@latest my-react-app -- --template react
cd my-react-app
npm install
\`\`\`

### 2. 開発サーバーの起動

\`\`\`bash
npm run dev
\`\`\`

## 基本的な使い方

### コンポーネントの作成

\`\`\`jsx
import React, { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>カウンター: {count}</h2>
      <button onClick={() => setCount(count + 1)}>
        +1
      </button>
    </div>
  );
};

export default Counter;
\`\`\`

### スタイリング

Viteでは様々なスタイリング方法がサポートされています：

- **CSS Modules**
- **Styled Components**
- **Tailwind CSS**
- **Sass/SCSS**

## パフォーマンス最適化

### 1. コード分割

\`\`\`jsx
import { lazy, Suspense } from 'react';

const LazyComponent = lazy(() => import('./LazyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
\`\`\`

### 2. 画像最適化

\`\`\`jsx
import imageUrl from './assets/image.jpg';

function ImageComponent() {
  return <img src={imageUrl} alt="説明" />;
}
\`\`\`

## まとめ

React + Viteの組み合わせは、開発体験を大幅に向上させます。高速な開発サーバーと最適化されたビルドにより、効率的な開発が可能になります。

次回は、TailwindCSSとの組み合わせについて詳しく解説する予定です。

---

何か質問があれば、コメントでお気軽にお聞かせください！`,
    },
    {
      id: 2,
      title: "TypeScript初心者が知っておくべき基本文法",
      slug: "typescript-basics-for-beginners",
      emoji: "📘",
      type: "tech",
      topics: ["TypeScript", "JavaScript", "初心者"],
      publishedAt: "2024-03-12",
      readTime: "8 min",
      likes: 45,
      bookmarks: 12,
      views: 234,
      author: {
        name: "山田花子",
        avatar: "https://via.placeholder.com/40x40/EF4444/FFFFFF?text=Y",
        username: "yamada_hanako",
      },
      content: `# TypeScript初心者が知っておくべき基本文法

## TypeScriptとは？

TypeScriptは、Microsoftによって開発されたJavaScriptのスーパーセットです。静的型付けを提供し、大規模なアプリケーション開発をより安全で効率的にします。

## 基本的な型

### プリミティブ型

\`\`\`typescript
// 基本型
let name: string = "太郎";
let age: number = 25;
let isActive: boolean = true;

// 配列
let numbers: number[] = [1, 2, 3];
let fruits: Array<string> = ["apple", "banana"];
\`\`\`

### オブジェクト型

\`\`\`typescript
// インターフェース
interface User {
  id: number;
  name: string;
  email?: string; // オプショナル
}

const user: User = {
  id: 1,
  name: "太郎"
};
\`\`\`

## 関数の型定義

\`\`\`typescript
// 関数の型定義
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

// アロー関数
const add = (a: number, b: number): number => a + b;

// オプショナル引数
function createUser(name: string, age?: number): User {
  return {
    id: Math.random(),
    name,
    age
  };
}
\`\`\`

## ジェネリクス

\`\`\`typescript
// ジェネリック関数
function identity<T>(arg: T): T {
  return arg;
}

// 使用例
const stringResult = identity<string>("hello");
const numberResult = identity<number>(42);
\`\`\`

## ユニオン型と交差型

\`\`\`typescript
// ユニオン型
type Status = "pending" | "success" | "error";

// 交差型
interface Name {
  name: string;
}

interface Age {
  age: number;
}

type Person = Name & Age;
\`\`\`

## 実践的な例

### React コンポーネントでの使用

\`\`\`typescript
import React from 'react';

interface Props {
  title: string;
  count: number;
  onIncrement: () => void;
}

const Counter: React.FC<Props> = ({ title, count, onIncrement }) => {
  return (
    <div>
      <h2>{title}</h2>
      <p>Count: {count}</p>
      <button onClick={onIncrement}>+1</button>
    </div>
  );
};

export default Counter;
\`\`\`

## まとめ

TypeScriptの基本文法をマスターすることで、より安全で保守性の高いコードを書くことができます。最初は複雑に感じるかもしれませんが、慣れてくると開発効率が大幅に向上します。

次回は、TypeScriptの高度な機能について詳しく解説します！`,
    },
    {
      id: 3,
      title: "CSS Grid と Flexbox の使い分け完全ガイド",
      slug: "css-grid-vs-flexbox-guide",
      emoji: "🎨",
      type: "tech",
      topics: ["CSS", "Grid", "Flexbox"],
      publishedAt: "2024-03-10",
      readTime: "6 min",
      likes: 32,
      bookmarks: 15,
      views: 189,
      author: {
        name: "佐藤次郎",
        avatar: "https://via.placeholder.com/40x40/10B981/FFFFFF?text=S",
        username: "sato_jiro",
      },
      content: `# CSS Grid と Flexbox の使い分け完全ガイド

## はじめに

現代のCSS開発において、**CSS Grid**と**Flexbox**は欠かせない技術です。どちらもレイアウトを作成するためのツールですが、それぞれに適した使用場面があります。

## Flexboxの特徴

Flexboxは**1次元**のレイアウトシステムです。

### 主な使用場面

- ナビゲーションバー
- ボタンの配置
- カードのコンテンツ配置
- 中央寄せ

### 基本的な使い方

\`\`\`css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
}

.item {
  flex: 1;
}
\`\`\`

## CSS Gridの特徴

CSS Gridは**2次元**のレイアウトシステムです。

### 主な使用場面

- ページ全体のレイアウト
- 複雑なカードレイアウト
- 雑誌のようなレイアウト
- ダッシュボード

### 基本的な使い方

\`\`\`css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
  gap: 20px;
}

.grid-item {
  background: #f0f0f0;
  padding: 20px;
}
\`\`\`

## 実践的な例

### Flexboxの例：ナビゲーション

\`\`\`css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background: #333;
}

.nav-links {
  display: flex;
  gap: 20px;
  list-style: none;
}
\`\`\`

### CSS Gridの例：記事レイアウト

\`\`\`css
.article-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  grid-template-rows: auto 1fr auto;
  grid-template-areas: 
    "header sidebar"
    "main sidebar"
    "footer footer";
  gap: 20px;
  min-height: 100vh;
}

.header { grid-area: header; }
.main { grid-area: main; }
.sidebar { grid-area: sidebar; }
.footer { grid-area: footer; }
\`\`\`

## 使い分けのポイント

### Flexboxを選ぶべき場合

- **1次元のレイアウト**（横一列、縦一列）
- **コンテンツに依存したサイズ**
- **アイテムの配置**が主な目的

### CSS Gridを選ぶべき場合

- **2次元のレイアウト**（行と列の両方）
- **複雑なレイアウト**構造
- **レスポンシブデザイン**で複雑な変化が必要

## 組み合わせて使う

多くの場合、FlexboxとCSS Gridを組み合わせて使用します：

\`\`\`css
/* Grid で全体レイアウト */
.layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 20px;
}

/* Flexbox で部分的なレイアウト */
.card {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card-actions {
  display: flex;
  justify-content: space-between;
  margin-top: auto;
}
\`\`\`

## まとめ

CSS GridとFlexboxは競合する技術ではなく、**補完し合う**技術です。それぞれの特徴を理解し、適切な場面で使い分けることで、効率的で保守性の高いCSSを書くことができます。

実際の開発では、両方を組み合わせて使用することが多いので、どちらも習得することをおすすめします！`,
    },
  ];

  useEffect(() => {
    setArticles(sampleArticles);
    // 初期状態でいいねとブックマークの状態を設定
    const initialLikes = {};
    const initialBookmarks = {};
    sampleArticles.forEach((article) => {
      initialLikes[article.id] = false;
      initialBookmarks[article.id] = false;
    });
    setLikes(initialLikes);
    setBookmarks(initialBookmarks);
  }, []);

  const parseMarkdown = (content) => {
    let html = content
      .replace(
        /^# (.+)$/gm,
        '<h1 class="text-3xl font-bold mb-6 text-gray-900">$1</h1>',
      )
      .replace(
        /^## (.+)$/gm,
        '<h2 class="text-2xl font-semibold mb-4 mt-8 text-gray-800">$1</h2>',
      )
      .replace(
        /^### (.+)$/gm,
        '<h3 class="text-xl font-semibold mb-3 mt-6 text-gray-800">$1</h3>',
      )
      .replace(
        /^#### (.+)$/gm,
        '<h4 class="text-lg font-semibold mb-2 mt-4 text-gray-800">$1</h4>',
      )
      .replace(
        /\*\*(.+?)\*\*/g,
        '<strong class="font-semibold text-gray-900">$1</strong>',
      )
      .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
      .replace(
        /`(.+?)`/g,
        '<code class="bg-gray-100 text-red-600 px-1 py-0.5 rounded text-sm font-mono">$1</code>',
      )
      .replace(
        /^> (.+)$/gm,
        '<blockquote class="border-l-4 border-blue-500 bg-blue-50 p-4 my-4 italic text-gray-700">$1</blockquote>',
      )
      .replace(/^- (.+)$/gm, '<li class="ml-4 mb-1">$1</li>')
      .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 mb-1">$1</li>')
      .replace(
        /\[(.+?)\]\((.+?)\)/g,
        '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank">$1</a>',
      )
      .replace(/\n/g, "<br>");

    // コードブロックの処理
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      return `<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code class="language-${lang || "text"} text-sm">${code.trim()}</code></pre>`;
    });

    // リストの処理
    html = html.replace(
      /(<li class="ml-4 mb-1">.*<\/li>)/g,
      '<ul class="list-disc list-inside space-y-1 mb-4">$1</ul>',
    );
    html = html.replace(
      /<\/ul><br><ul class="list-disc list-inside space-y-1 mb-4">/g,
      "",
    );

    return html;
  };

  const handleLike = (articleId) => {
    setLikes((prev) => ({
      ...prev,
      [articleId]: !prev[articleId],
    }));
  };

  const handleBookmark = (articleId) => {
    setBookmarks((prev) => ({
      ...prev,
      [articleId]: !prev[articleId],
    }));
  };

  if (selectedArticle) {
    // 記事の概要を生成（SEO用）
    const articleDescription =
      selectedArticle.content
        .replace(/[#*`]/g, "")
        .split("\n")
        .find((line) => line.length > 50)
        ?.substring(0, 160) + "..." ||
      `${selectedArticle.title}について詳しく解説しています。`;

    const articleUrl = `https://yourdomain.com/articles/${selectedArticle.slug}`;
    const articleImage = `https://yourdomain.com/og-images/${selectedArticle.slug}.jpg`;

    return (
      <div className="min-h-screen bg-gray-50">
        <SEOHead
          title={selectedArticle.title}
          description={articleDescription}
          keywords={selectedArticle.topics.join(", ")}
          author={selectedArticle.author.name}
          publishedAt={selectedArticle.publishedAt}
          image={articleImage}
          url={articleUrl}
        />

        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <button
              onClick={() => setSelectedArticle(null)}
              className="text-blue-600 hover:text-blue-800 font-medium mb-4"
            >
              ← 記事一覧に戻る
            </button>
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-3xl">{selectedArticle.emoji}</span>
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedArticle.title}
              </h1>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <img
                  src={selectedArticle.author.avatar}
                  alt={selectedArticle.author.name}
                  className="w-8 h-8 rounded-full"
                />
                <span>{selectedArticle.author.name}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <time dateTime={selectedArticle.publishedAt}>
                  {selectedArticle.publishedAt}
                </time>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{selectedArticle.readTime}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Article Content */}
        <main className="max-w-4xl mx-auto px-4 py-8">
          <article className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{
                __html: parseMarkdown(selectedArticle.content),
              }}
            />
          </article>

          {/* Article Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleLike(selectedArticle.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                    likes[selectedArticle.id]
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${likes[selectedArticle.id] ? "fill-current" : ""}`}
                  />
                  <span>
                    {selectedArticle.likes +
                      (likes[selectedArticle.id] ? 1 : 0)}
                  </span>
                </button>
                <button
                  onClick={() => handleBookmark(selectedArticle.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                    bookmarks[selectedArticle.id]
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <Bookmark
                    className={`w-5 h-5 ${bookmarks[selectedArticle.id] ? "fill-current" : ""}`}
                  />
                  <span>
                    {selectedArticle.bookmarks +
                      (bookmarks[selectedArticle.id] ? 1 : 0)}
                  </span>
                </button>
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200">
                <Share2 className="w-5 h-5" />
                <span>シェア</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title="Tech Blog - プログラミングと技術の記事"
        description="React、TypeScript、CSS、JavaScript などの技術記事を発信するブログです。初心者から上級者まで役立つ情報をお届けします。"
        keywords="React, TypeScript, JavaScript, CSS, プログラミング, 技術ブログ, フロントエンド"
        author="Tech Blog"
        url="https://yourdomain.com"
        image="https://yourdomain.com/og-image.jpg"
      />

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Tech Blog</h1>
          <p className="text-gray-600 mt-2">
            プログラミングと技術に関する記事を発信しています
          </p>
        </div>
      </header>

      {/* Article List */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid gap-8">
          {articles.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedArticle(article)}
            >
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <span
                    className="text-3xl"
                    role="img"
                    aria-label={article.title}
                  >
                    {article.emoji}
                  </span>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                      {article.title}
                    </h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-2">
                        <img
                          src={article.author.avatar}
                          alt={article.author.name}
                          className="w-6 h-6 rounded-full"
                        />
                        <span>{article.author.name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <time dateTime={article.publishedAt}>
                          {article.publishedAt}
                        </time>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mb-4">
                      {article.topics.map((topic) => (
                        <span
                          key={topic}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{article.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Bookmark className="w-4 h-4" />
                        <span>{article.bookmarks}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{article.views}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ZennBlog;
