import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import matter from "gray-matter";

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const files = import.meta.glob("../blog/*.md", { as: "raw" });
    const filePath = `../blog/${slug}.md`;
    if (!files[filePath]) {
      setNotFound(true);
      return;
    }
    files[filePath]().then(async (mod) => {
      const response = await fetch(mod.default);
      const raw = await response.text();
      const { data, content } = matter(raw);
      setPost({ ...data, content });
    });
  }, [slug]);

  if (notFound) {
    return <div className="max-w-2xl mx-auto py-8 px-4">記事が見つかりませんでした。</div>;
  }
  if (!post) {
    return <div className="max-w-2xl mx-auto py-8 px-4">読み込み中...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Link to="/blog" className="text-blue-600 hover:underline">← ブログ一覧へ</Link>
      <h1 className="text-3xl font-bold mt-4 mb-2">{post.title}</h1>
      <div className="text-gray-500 text-sm mb-6">{post.date}</div>
      <div className="prose max-w-none">
        <ReactMarkdown>{post.data}</ReactMarkdown>
      </div>
    </div>
  );
};

export default BlogPost; 