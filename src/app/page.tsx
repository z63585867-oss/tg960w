import Link from "next/link";
import db from "@/lib/db";
import { CATEGORIES } from "@/lib/categories";
import { Shield, Flame, TrendingUp } from "lucide-react";

const ICONS: Record<string,string> = { security:"🔐", engineering:"💻","ai-ml":"🤖", marketing:"📈","c-suite":"👔", business:"🏢", lark:"🦜", product:"🏗️", design:"🎨", data:"📊", writing:"✍️", devops:"⚙️","qa-testing":"🛡️","finance-legal":"💰", other:"📦" };

async function getHomeData() {
  const [total, favCount, cats, recent, articles] = await Promise.all([
    db.skill.count(), db.favorite.count(),
    db.skill.groupBy({ by: ["category"], _count: true, orderBy: { _count: { category: "desc" } } }),
    db.skill.findMany({ orderBy: { updatedAt: "desc" }, take: 12 }),
    db.article.findMany({ where: { isPublished: true }, orderBy: { publishedAt: "desc" }, take: 4,
      select: { slug: true, title: true, excerpt: true, description: true, category: true } }),
  ]);
  const topCats = cats.slice(0, 10).map(c => {
    const def = CATEGORIES.find(d => d.id === c.category);
    return { id: c.category, name: def?.name || c.category, icon: ICONS[c.category] || "📦", count: c._count };
  });
  return { total, favCount, topCats, recent, articles };
}

export default async function HomePage() {
  const d = await getHomeData();

  return (
    <div className="page" style={{ paddingBottom: 80 }}>

      {/* ==================== HERO ==================== */}
      <section style={{ paddingTop: 80, paddingBottom: 56, textAlign: "center" }}>
        <div className="ani" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
          <span className="tag tag-gold">✦ 中国最大的 Claude Code 智能体精选平台</span>
        </div>
        <h1 className="h1 ani ani-1" style={{ marginBottom: 16, color: "var(--text)" }}>
          墨染<span style={{ color: "var(--red)" }}>千机</span>
          <span style={{ fontSize: "clamp(1.2rem,2vw,1.6rem)", fontWeight: 400, color: "var(--text3)", display: "block", marginTop: 12 }}>
            —— {d.total.toLocaleString()}+ AI 智能体，每一笔都是匠心 ——
          </span>
        </h1>
        <p className="ani ani-2" style={{ fontSize: 16, color: "var(--text2)", maxWidth: 500, margin: "0 auto 32px", lineHeight: 1.7 }}>
          双引擎安全审计 · 每日更新 · 免费使用
        </p>
        <div className="ani ani-3" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/skills" className="btn btn-red" style={{ padding: "12px 32px", fontSize: 15 }}>
            探索全部智能体
          </Link>
          <Link href="/blog" className="btn btn-line" style={{ padding: "12px 32px", fontSize: 15 }}>
            阅读指南
          </Link>
        </div>
        {/* Hot tags */}
        <div className="ani ani-4" style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginTop: 28 }}>
          {["安全审计","视频剪辑","SEO优化","代码审查","CEO顾问","数据分析"].map(t => (
            <Link key={t} href={`/skills?q=${t}`} className="tag tag-gray" style={{ fontSize: 12, padding: "6px 16px", cursor: "pointer", textDecoration: "none" }}>{t}</Link>
          ))}
        </div>
      </section>

      <div className="gold-line" style={{ margin: "20px 0 48px" }} />

      {/* ==================== STATS ==================== */}
      <section className="ani" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, background: "var(--line)", borderRadius: 12, overflow: "hidden", marginBottom: 56 }}>
        {[
          { v: d.total.toLocaleString(), l: "智能体", c: "var(--red)" },
          { v: d.topCats.length, l: "门类", c: "var(--gold)" },
          { v: d.favCount, l: "收藏", c: "#48c78e" },
          { v: "100%", l: "安全审计", c: "var(--text)" },
        ].map(s => (
          <div key={s.l} className="stat" style={{ background: "var(--paper)" }}>
            <div className="stat-num" style={{ color: s.c }}>{s.v}</div>
            <div className="stat-lbl">{s.l}</div>
          </div>
        ))}
      </section>

      {/* ==================== 编辑精选 ==================== */}
      <section style={{ marginBottom: 56 }}>
        <div className="section-head ani">
          <div className="section-head-bar" />
          <h2 className="section-head-title">编辑精选</h2>
          <span className="tag tag-red">Editor's Picks</span>
        </div>
        <div className="grid-3 ani ani-1">
          {d.recent.slice(0, 6).map((s, i) => (
            <Link key={s.id} href={`/skills/${s.slug}`} className="card" style={{ padding: 0 }}>
              <div className="skill-card-img" style={{ background: `linear-gradient(160deg, ${["#241a18","#1a2418","#181a24","#24181a","#1a2422","#221a24"][i%6]}, var(--paper))` }}>
                {ICONS[s.category] || "📦"}
              </div>
              <div style={{ padding: "22px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span className="tag tag-gray">{s.category}</span>
                  <span style={{ fontSize: 12, color: "var(--gold)", letterSpacing: 2 }}>★★★★★</span>
                </div>
                <h3 className="h3" style={{ margin: "0 0 8px 0" }}>{s.name}</h3>
                <p className="body" style={{ fontSize: 13, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {s.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ==================== 最新入库 ==================== */}
      <section style={{ marginBottom: 56 }}>
        <div className="section-head ani">
          <div className="section-head-bar" style={{ background: "var(--gold)" }} />
          <h2 className="section-head-title">最新入库</h2>
          <Link href="/skills" className="tag tag-gray" style={{ textDecoration: "none", marginLeft: "auto" }}>查看全部 →</Link>
        </div>
        <div className="grid-4 ani ani-1">
          {d.recent.slice(0, 8).map((s, i) => (
            <Link key={s.id} href={`/skills/${s.slug}`} className="card" style={{ padding: 0 }}>
              <div className="skill-card-img" style={{ fontSize: 36, background: `linear-gradient(150deg, ${["#221a16","#16221a","#1a1622","#22161a","#162122","#201a16"][i%6]}, var(--paper))` }}>
                {ICONS[s.category] || "📦"}
              </div>
              <div style={{ padding: "16px" }}>
                {i < 3 && <span className="tag tag-new" style={{ marginBottom: 8, display: "inline-flex" }}>NEW</span>}
                <div className="h3" style={{ fontSize: 15, margin: "6px 0 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</div>
                <p className="body" style={{ fontSize: 12, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {s.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ==================== 门类 ==================== */}
      <section style={{ marginBottom: 56 }}>
        <div className="section-head ani">
          <div className="section-head-bar" style={{ background: "#48c78e" }} />
          <h2 className="section-head-title">探索门类</h2>
        </div>
        <div className="grid-5 ani ani-1">
          {d.topCats.map(c => (
            <Link key={c.id} href={`/categories/${c.id}`} className="card card-padded" style={{ textAlign: "center" }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>{c.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 3 }}>{c.name}</div>
              <div className="small">{c.count} 个</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ==================== 使用指南 (hide if empty) ==================== */}
      {d.articles.length > 0 && (
        <section style={{ marginBottom: 56 }}>
          <div className="section-head ani">
            <div className="section-head-bar" />
            <h2 className="section-head-title">使用指南</h2>
            <Link href="/blog" className="tag tag-gray" style={{ textDecoration: "none", marginLeft: "auto" }}>全部 →</Link>
          </div>
          <div className="grid-2 ani ani-1">
            {d.articles.map(a => (
              <Link key={a.slug} href={`/blog/${a.slug}`} className="card card-padded" style={{ minHeight: 140 }}>
                <span className="tag tag-gold" style={{ marginBottom: 14, display: "inline-flex" }}>{a.category}</span>
                <h3 className="h3" style={{ margin: "0 0 10px 0" }}>{a.title}</h3>
                <p className="body">{a.excerpt || a.description}</p>
                <div style={{ marginTop: 16, color: "var(--gold)", fontSize: 13, fontWeight: 600 }}>阅读全文 →</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="ink-line" style={{ margin: "0 0 56px" }} />

      {/* ==================== TRUST ==================== */}
      <section className="ani" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 56 }}>
        {[
          { icon: Shield, title: "安全审计", desc: "双引擎扫描，先审后用" },
          { icon: Flame, title: "每日更新", desc: "智能体库自动同步" },
          { icon: TrendingUp, title: "权威评测", desc: "编辑团队深度试用" },
        ].map(item => (
          <div key={item.title} className="card card-padded" style={{ textAlign: "center" }}>
            <item.icon size={24} style={{ color: "var(--red)", marginBottom: 12 }} />
            <div style={{ fontWeight: 700, marginBottom: 4 }}>{item.title}</div>
            <div className="small">{item.desc}</div>
          </div>
        ))}
      </section>

      {/* ==================== CTA ==================== */}
      <section className="card ani" style={{ padding: "48px", textAlign: "center", marginBottom: 56, background: "linear-gradient(135deg, #1f1816 0%, #18181f 100%)" }}>
        <h2 className="h2" style={{ marginBottom: 8 }}>准备好开始了吗？</h2>
        <p className="body" style={{ maxWidth: 400, margin: "0 auto 24px" }}>
          {d.total.toLocaleString()}+ AI 智能体，每一笔都是匠心。
        </p>
        <Link href="/skills" className="btn btn-red" style={{ padding: "14px 40px", fontSize: 15 }}>
          立即探索
        </Link>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="footer ani">
        <div>
          <div className="footer-brand">
            <span style={{ color: "var(--red)" }}>墨</span> TG<span style={{ color: "var(--gold)" }}>960W</span>
          </div>
          <div className="small">AI 智能体精选平台</div>
          <div className="small" style={{ marginTop: 4 }}>© 2026</div>
        </div>
        <div style={{ display: "flex", gap: 48 }}>
          <div>
            <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 10, fontWeight: 600 }}>探索</div>
            <Link href="/skills" className="footer-link">全部智能体</Link>
            <Link href="/blog" className="footer-link">使用指南</Link>
          </div>
          <div>
            <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 10, fontWeight: 600 }}>关于</div>
            <a href="mailto:z63585867@gmail.com" className="footer-link">联系我们</a>
            <Link href="/sitemap.xml" className="footer-link">站点地图</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
