import Link from "next/link";
import { Metadata } from "next";
import { siteMeta } from "@/lib/seo";

export const metadata: Metadata = siteMeta({ title: "使用指南", description: "Claude Code AI 智能体教程，每日更新。" });

async function getArticles(page: number, category?: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3456";
    const params = new URLSearchParams({ page: String(page), limit: "12" });
    if (category) params.set("category", category);
    const res = await fetch(`${baseUrl}/api/blog?${params}`, { cache: "no-store" });
    return res.json();
  } catch {
    return { articles: [], pagination: { page: 1, totalPages: 1 } };
  }
}

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ page?: string; category?: string }> }) {
  const sp = await searchParams;
  const page = parseInt(sp.page || "1");
  const category = sp.category;
  const data = await getArticles(page, category);

  return (
    <div className="mx-auto max-w-4xl px-6 sm:px-10 py-16 space-y-16">
      <section>
        <div className="overline r1">使用指南</div>
        <h1 className="heading-xl text-[var(--fg)] mt-4 r2">
          {category || "全部文章"}<span className="text-[var(--gold)]">。</span>
        </h1>
        <div className="hr mt-8 r3" />
      </section>

      {data.articles.length > 0 ? (
        <div className="space-y-px bg-[var(--line)]">
          {data.articles.map((a: any) => (
            <Link key={a.slug} href={`/blog/${a.slug}`}
              className="block p-6 sm:p-8 bg-[var(--bg)] hover:bg-[#0d0d12] transition group">
              <div className="overline mb-3">{a.category}</div>
              <h2 className="heading-lg text-[var(--fg)] group-hover:text-[var(--gold)] transition-colors">{a.title}</h2>
              <p className="body-text mt-3">{a.excerpt || a.description}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="card p-20 text-center">
          <p className="body-lg">第一篇指南正在撰写中</p>
        </div>
      )}

      {data.pagination.totalPages > 1 && (
        <div className="flex justify-center gap-1">
          {Array.from({ length: data.pagination.totalPages }, (_, i) => (
            <Link key={i+1} href={`/blog?page=${i+1}${category ? `&category=${category}` : ""}`}
              className={`px-4 py-2 text-sm border ${page === i+1 ? "border-[var(--gold)] text-[var(--gold)]" : "border-[var(--line)] text-[var(--fg-dim)] hover:border-[var(--fg-faint)]"}`}>
              {i+1}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
