import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import fm from "front-matter";

const BlogDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const files = import.meta.glob("../blog/*.md", { as: "raw" });
    const load = async () => {
      for (const [path, resolver] of Object.entries(files)) {
        if (path.includes(slug)) {
          const raw = await resolver();
          const { attributes, body } = fm(raw);
          const content = body.trim();
          setPost({ ...attributes, content });
          return;
        }
      }
      setPost(undefined); // Not found
    };
    load();
  }, [slug]);

  if (post === null) return <div>読み込み中...</div>;
  if (post === undefined) return <div>記事が見つかりません</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      {post.date && <div className="text-gray-500 mb-2">{post.date}</div>}
      <div className="prose">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </div>
  );
};

export default BlogDetail; 