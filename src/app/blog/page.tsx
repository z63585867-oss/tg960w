import Link from "next/link";
import { Metadata } from "next";
import { siteMeta } from "@/lib/seo";

export const metadata: Metadata = siteMeta({ title: "使用指南", description: "Claude Code AI 智能体教程，每日更新。" });

async function getArticles(page: number) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3456";
    const res = await fetch(`${baseUrl}/api/blog?page=${page}&limit=10`, { cache: "no-store" });
    return res.json();
  } catch { return { articles: [], pagination: { page:1, totalPages:1 } }; }
}

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const sp = await searchParams;
  const page = parseInt(sp.page || "1");
  const data = await getArticles(page);

  const [featured, ...rest] = data.articles;

  return (
    <div className="page" style={{ paddingTop: 40, paddingBottom: 80, maxWidth: 800 }}>
      <div className="section-head">
        <div className="section-head-bar" />
        <h1 className="section-head-title">使用指南</h1>
        <span className="tag tag-gold">{data.pagination?.total || 0} 篇</span>
      </div>

      {featured ? (
        <>
          {/* Featured article */}
          <Link href={`/blog/${featured.slug}`} className="card ani" style={{ padding: 0, marginBottom: 40, overflow: "hidden" }}>
            <div style={{
              padding: "48px 40px",
              background: "linear-gradient(135deg, #241a18 0%, #1a1a24 50%, #181a20 100%)",
            }}>
              <span className="tag tag-red" style={{ marginBottom: 16, display: "inline-flex" }}>{featured.category}</span>
              <h2 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 12px 0", lineHeight: 1.2, letterSpacing: "-0.02em" }}>
                {featured.title}
              </h2>
              <p style={{ fontSize: 15, color: "var(--text2)", lineHeight: 1.7, margin: "0 0 20px 0" }}>{featured.excerpt || featured.description}</p>
              <span style={{ color: "var(--gold)", fontWeight: 600, fontSize: 14 }}>阅读全文 →</span>
            </div>
          </Link>

          {/* Rest of articles */}
          {rest.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {rest.map((a: any, i: number) => (
                <Link key={a.slug} href={`/blog/${a.slug}`}
                  className="card" style={{ padding: "22px 28px", display: "flex", alignItems: "center", gap: 16, animationDelay: `${i*0.06}s` }}>
                  <div style={{ flex: 1 }}>
                    <span className="tag tag-gray" style={{ marginBottom: 6, display: "inline-flex" }}>{a.category}</span>
                    <h3 style={{ fontSize: 16, fontWeight: 700, margin: "6px 0 4px" }}>{a.title}</h3>
                    <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {a.excerpt || a.description}
                    </p>
                  </div>
                  <span style={{ color: "var(--gold)", fontSize: 13, fontWeight: 600, flexShrink: 0 }}>阅读 →</span>
                </Link>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="card" style={{ padding: 80, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📝</div>
          <p className="body">还没有文章</p>
          <p className="small" style={{ marginTop: 4 }}>AI 编辑部正在撰写第一批内容</p>
        </div>
      )}

      {data.pagination?.totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 32 }}>
          {Array.from({ length: data.pagination.totalPages }, (_, i) => (
            <Link key={i+1} href={`/blog?page=${i+1}`}
              className={`btn btn-sm ${page === i+1 ? "btn-red" : "btn-line"}`}>{i+1}</Link>
          ))}
        </div>
      )}
    </div>
  );
}
