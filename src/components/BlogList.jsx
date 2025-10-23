import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import fm from "front-matter";

const BlogList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const files = import.meta.glob("../blog/*.md", { as: "raw" });
    const loadPosts = async () => {
      const loadedPosts = await Promise.all(
        Object.entries(files).map(async ([path, resolver]) => {
          const raw = await resolver();
          const { attributes } = fm(raw);
          const slug = path.split("/").pop().replace(".md", "");
          return { ...attributes, slug };
        }),
      );
      // 日付で降順ソート（dateがある場合）
      loadedPosts.sort((a, b) => (a.date < b.date ? 1 : -1));
      setPosts(loadedPosts);
    };
    loadPosts();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">ブログ</h1>
      <div className="flex flex-wrap gap-6">
        {posts.map((post) => (
          <div
            key={post.slug}
            className="bg-white border border-gray-200 rounded-lg shadow-md p-6 w-full max-w-xs flex flex-col hover:shadow-lg transition-shadow"
          >
            <Link
              to={`/blog/${post.slug}`}
              className="flex items-center mb-2 hover:underline"
            >
              {post.emoji && (
                <span className="text-2xl mr-2">{post.emoji}</span>
              )}
              <span className="text-lg font-semibold">{post.title}</span>
            </Link>
            {post.date && (
              <div className="text-gray-500 text-sm mb-2">{post.date}</div>
            )}
            {post.topics && Array.isArray(post.topics) && (
              <div className="flex flex-wrap gap-2 mb-2">
                {post.topics.map((topic) => (
                  <span
                    key={topic}
                    className="bg-teal-100 text-teal-700 text-xs px-2 py-1 rounded"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            )}
            {post.type && (
              <span className="inline-block bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded">
                {post.type}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
