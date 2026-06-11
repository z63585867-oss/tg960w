import Link from "next/link";
import { Metadata } from "next";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { BlogSidebar } from "@/components/ui/BlogSidebar";
import { siteMeta } from "@/lib/seo";

export const metadata: Metadata = siteMeta({
  title: "博客 — AI 智能体教程",
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
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-zinc-100">
          {category ? `${category} 相关文章` : "AI 智能体教程"}
        </h1>
        <p className="mt-2 text-zinc-400">
          {category
            ? `浏览 ${category} 分类下的全部教程文章`
            : "Claude Code 智能体使用教程、技巧分享、最佳实践"}
        </p>
      </div>

      <div className="flex gap-10">
        <div className="flex-1">
          {data.articles.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2">
              {data.articles.map((article: { slug: string; title: string; description: string; excerpt: string; coverImage?: string | null; category: string; tags: string; author: string; publishedAt: string | null }) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/50 py-20">
              <p className="text-zinc-500 text-lg">还没有文章</p>
              <p className="mt-2 text-zinc-600">AI 正在努力创作中，明天再来看看！</p>
            </div>
          )}

          {data.pagination.totalPages > 1 && (
            <div className="mt-10 flex justify-center gap-2">
              {Array.from({ length: data.pagination.totalPages }, (_, i) => (
                <Link
                  key={i + 1}
                  href={`/blog?page=${i + 1}${category ? `&category=${category}` : ""}`}
                  className={`rounded-lg px-4 py-2 text-sm transition ${
                    page === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
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
