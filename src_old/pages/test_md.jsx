import React, { useState, useEffect } from "react";
import { ChevronLeft, Calendar, Tag, Eye } from "lucide-react";

// マークダウンファイルの内容を文字列として定義
const markdownFiles = {
  "react-zenn-blog": `---
title: "ReactでZennライクなブログを作る"
emoji: "⚛️"
type: "tech"
topics: ["react", "markdown", "blog"]
published: true
published_at: "2025-01-15"
---

# ReactでZennライクなブログを作る

この記事では、Reactを使ってZennのようなマークダウンベースのブログシステムを実装する方法を説明します。

## 実装のポイント

1. **フロントマター**を使った記事メタデータの管理
2. **シンプルな正規表現**でのマークダウン解析
3. **React state**での記事管理

## コード例

\`\`\`javascript
const parseMarkdown = (content) => {
  const lines = content.split('\\n');
  let html = '';
  
  lines.forEach(line => {
    if (line.startsWith('# ')) {
      html += \`<h1>\${line.slice(2)}</h1>\`;
    } else if (line.startsWith('## ')) {
      html += \`<h2>\${line.slice(3)}</h2>\`;
    } else {
      html += \`<p>\${line}</p>\`;
    }
  });
  
  return html;
};
\`\`\`

## まとめ

ReactだけでもZennライクなブログは十分実装できます。外部ライブラリを使わずに、シンプルで軽量な実装を心がけましょう。

記事の内容がここに続きます...`,

  "typescript-tips": `---
title: "TypeScript実践Tips集"
emoji: "💡"
type: "tech"
topics: ["typescript", "tips", "javascript"]
published: true
published_at: "2025-01-12"
---

# TypeScript実践Tips集

日々の開発で使えるTypeScriptのTipsをまとめました。

## 1. Union Types の活用

TypeScriptの強力な型システムを活用して、より安全なコードを書くことができます。

\`\`\`typescript
type Status = 'loading' | 'success' | 'error';

const handleStatus = (status: Status) => {
  switch (status) {
    case 'loading':
      return 'Loading...';
    case 'success':
      return 'Success!';
    case 'error':
      return 'Error occurred';
  }
};
\`\`\`

## 2. Conditional Types

条件付き型を使って、より柔軟な型定義が可能です。

\`\`\`typescript
type ApiResponse<T> = T extends string 
  ? { message: string } 
  : T extends number 
  ? { count: number } 
  : never;
\`\`\`

## 3. Utility Types

TypeScriptの組み込みユーティリティ型を活用しましょう。

- **Partial<T>**: すべてのプロパティをオプショナルにする
- **Required<T>**: すべてのプロパティを必須にする
- **Pick<T, K>**: 指定したプロパティのみを抽出
- **Omit<T, K>**: 指定したプロパティを除外

実際のプロジェクトでの使用例も含めて解説していきます...`,

  "nextjs-performance": `---
title: "Reactのパフォーマンス最適化"
emoji: "🚀"
type: "tech"
topics: ["react", "performance", "optimization"]
published: true
published_at: "2025-01-10"
---

# Reactのパフォーマンス最適化

Reactアプリケーションのパフォーマンスを向上させる実践的な手法を紹介します。

## 1. 画像最適化

Reactアプリケーションでの画像最適化を行う方法です。

\`\`\`jsx
const OptimizedImage = ({ src, alt, width, height }) => (
  <img
    src={src}
    alt={alt}
    width={width}
    height={height}
    loading="lazy"
    style={{ objectFit: 'cover' }}
  />
);

const MyComponent = () => (
  <OptimizedImage
    src="/hero.jpg"
    alt="Hero image"
    width={800}
    height={600}
  />
);
\`\`\`

## 2. 動的インポート

Reactでのコード分割を効率的に行うために、React.lazy を使用します。

\`\`\`javascript
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

const MyApp = () => (
  <React.Suspense fallback={<div>Loading...</div>}>
    <HeavyComponent />
  </React.Suspense>
);
\`\`\`

## 3. パフォーマンス最適化

Reactアプリケーションのパフォーマンスを向上させるためのテクニックです。

\`\`\`javascript
// React.memo を使用したコンポーネントの最適化
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{data.map(item => <div key={item.id}>{item.name}</div>)}</div>;
});

// useMemo を使用した計算結果のキャッシュ
const MyComponent = ({ items }) => {
  const expensiveValue = React.useMemo(() => {
    return items.filter(item => item.active).length;
  }, [items]);

  return <div>Active items: {expensiveValue}</div>;
};
\`\`\`

## パフォーマンス測定

React DevTools Profiler や Web Vitals を使って、継続的にパフォーマンスを測定することが重要です。

\`\`\`javascript
// パフォーマンス測定の例
const measurePerformance = (name, fn) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(\`\${name} took \${end - start} milliseconds\`);
};

// 使用例
measurePerformance('Component render', () => {
  // 重い処理
});
\`\`\`

パフォーマンス改善の具体的な数値とともに解説します...`,
};

// フロントマター解析関数
const parseFrontMatter = (content) => {
  const frontMatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontMatterRegex);

  if (!match) {
    return { metadata: {}, content };
  }

  const frontMatter = match[1];
  const markdownContent = match[2];

  const metadata = {};
  const lines = frontMatter.split("\n");

  lines.forEach((line) => {
    const colonIndex = line.indexOf(":");
    if (colonIndex !== -1) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();

      // 値の処理
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      } else if (value.startsWith("[") && value.endsWith("]")) {
        value = value
          .slice(1, -1)
          .split(",")
          .map((item) => item.trim().replace(/"/g, ""));
      } else if (value === "true") {
        value = true;
      } else if (value === "false") {
        value = false;
      }

      metadata[key] = value;
    }
  });

  return { metadata, content: markdownContent };
};

// シンプルなマークダウン変換関数
const parseMarkdown = (content) => {
  let html = content;

  // コードブロック（```で囲まれた部分）
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto"><code class="language-${lang || "text"}">${code.trim()}</code></pre>`;
  });

  // インラインコード
  html = html.replace(
    /`([^`]+)`/g,
    '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>',
  );

  // 見出し
  html = html.replace(
    /^### (.*$)/gm,
    '<h3 class="text-lg font-semibold mt-6 mb-3">$1</h3>',
  );
  html = html.replace(
    /^## (.*$)/gm,
    '<h2 class="text-xl font-semibold mt-8 mb-4">$1</h2>',
  );
  html = html.replace(
    /^# (.*$)/gm,
    '<h1 class="text-2xl font-bold mt-8 mb-6">$1</h1>',
  );

  // 太字
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // リスト
  html = html.replace(/^- (.*$)/gm, '<li class="ml-4">• $1</li>');

  // 段落
  html = html
    .split("\n")
    .map((line) => {
      line = line.trim();
      if (line === "") return "<br>";
      if (line.startsWith("<")) return line;
      if (line.startsWith("•")) return line;
      return `<p class="mb-4 leading-relaxed">${line}</p>`;
    })
    .join("\n");

  return html;
};

export default function ReactOnlyBlog() {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    // マークダウンファイルを解析して記事一覧を作成
    const parsedArticles = Object.entries(markdownFiles).map(
      ([slug, content]) => {
        const { metadata, content: markdownContent } =
          parseFrontMatter(content);

        return {
          slug,
          ...metadata,
          content: parseMarkdown(markdownContent),
        };
      },
    );

    setArticles(parsedArticles.filter((article) => article.published));
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTypeColor = (type) => {
    return type === "tech"
      ? "bg-blue-100 text-blue-800"
      : "bg-green-100 text-green-800";
  };

  // 記事詳細表示
  if (selectedArticle) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <button
          onClick={() => setSelectedArticle(null)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <ChevronLeft size={20} />
          記事一覧に戻る
        </button>

        <article className="bg-white rounded-lg shadow-sm border p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{selectedArticle.emoji}</span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(selectedArticle.type)}`}
            >
              {selectedArticle.type}
            </span>
          </div>

          <h1 className="text-3xl font-bold mb-4">{selectedArticle.title}</h1>

          <div className="flex items-center gap-4 mb-6 text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span className="text-sm">
                {formatDate(selectedArticle.published_at)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Tag size={16} />
              <div className="flex gap-1">
                {selectedArticle.topics.map((topic) => (
                  <span
                    key={topic}
                    className="text-xs bg-gray-100 px-2 py-1 rounded"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <div
              className="article-content"
              dangerouslySetInnerHTML={{
                __html: selectedArticle.content || "",
              }}
            />
          </div>
        </article>
      </div>
    );
  }

  // 記事一覧表示
  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tech Blog</h1>
        <p className="text-gray-600">技術に関する記事を投稿しています</p>
      </header>

      <div className="grid gap-6">
        {articles.map((article) => (
          <article
            key={article.slug}
            className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedArticle(article)}
          >
            <div className="flex items-start gap-4">
              <div className="text-2xl">{article.emoji}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(article.type)}`}
                  >
                    {article.type}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatDate(article.published_at)}
                  </span>
                </div>

                <h2 className="text-xl font-semibold mb-3 hover:text-blue-600 transition-colors">
                  {article.title}
                </h2>

                <div className="flex items-center gap-2 mb-3">
                  <Tag size={16} className="text-gray-400" />
                  <div className="flex gap-1 flex-wrap">
                    {article.topics.map((topic) => (
                      <span
                        key={topic}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
                    <Eye size={16} />
                    記事を読む
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
