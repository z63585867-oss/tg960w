import Link from "next/link";
import { Metadata } from "next";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { BlogSidebar } from "@/components/ui/BlogSidebar";
import { siteMeta } from "@/lib/seo";
import { BookOpen, Sparkles } from "lucide-react";

export const metadata: Metadata = siteMeta({
  title: "秘籍阁 — AI 智能体教程",
  description: "Claude Code AI 智能体使用教程、技巧分享、最佳实践。每日更新，助你成为 AI 编程高手。",
});

async function getArticles(page: number, category?: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3456";
    const params = new URLSearchParams({ page: String(page), limit: "12" });
    if (category) params.set("category", category);
    const res = await fetch(`${baseUrl}/api/blog?${params}`, { cache: "no-store" });
    return res.json();
  } catch {
    return { articles: [], pagination: { page: 1, totalPages: 1, total: 0 } };
  }
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const sp = await searchParams;
  const page = parseInt(sp.page || "1");
  const category = sp.category;
  const data = await getArticles(page, category);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* Hero */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/5 mb-4">
          <Sparkles size={14} className="text-purple-400" />
          <span className="text-xs font-semibold tracking-widest uppercase text-purple-300">Grimoire · 秘籍阁</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight">
          <span className="gradient-text">
            {category ? `${category}` : "// 秘籍阁"}
          </span>
        </h1>
        <p className="mt-3 text-zinc-500 max-w-lg leading-relaxed">
          {category
            ? `浏览「${category}」门类下的全部修炼秘籍`
            : "AI 铸剑师每日撰写，从零到一掌握 Claude Code。不是说明书，是武功秘籍。"}
        </p>
      </div>

      <div className="flex gap-10">
        <div className="flex-1">
          {data.articles.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2">
              {data.articles.map((article: any) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          ) : (
            <div className="card flex flex-col items-center justify-center py-24 text-center">
              <BookOpen size={48} className="text-purple-500/30 mb-4" />
              <p className="text-zinc-500 text-lg">秘籍尚未写成</p>
              <p className="text-zinc-600 text-sm mt-1 max-w-sm">
                AI 铸剑师正在锻造第一批修炼指南。明日子时，必有新篇。
              </p>
            </div>
          )}

          {data.pagination.totalPages > 1 && (
            <div className="mt-10 flex justify-center gap-2">
              {Array.from({ length: data.pagination.totalPages }, (_, i) => (
                <Link
                  key={i + 1}
                  href={`/blog?page=${i + 1}${category ? `&category=${category}` : ""}`}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    page === i + 1
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : "bg-zinc-800/50 text-zinc-400 hover:bg-zinc-700/50"
                  }`}
                >
                  {i + 1}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="hidden w-72 lg:block">
          <BlogSidebar />
        </div>
      </div>
    </div>
  );
}
