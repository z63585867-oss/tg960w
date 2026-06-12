import Link from "next/link";
import db from "@/lib/db";
import { CATEGORIES } from "@/lib/categories";

async function getHomeData() {
  const [totalSkills, categories, recentSkills, articles] = await Promise.all([
    db.skill.count(),
    db.skill.groupBy({ by: ["category"], _count: true, orderBy: { _count: { category: "desc" } } }),
    db.skill.findMany({ orderBy: { updatedAt: "desc" }, take: 6 }),
    db.article.findMany({ where: { isPublished: true }, orderBy: { publishedAt: "desc" }, take: 3,
      select: { slug: true, title: true, excerpt: true, description: true, category: true, publishedAt: true }
    }),
  ]);
  return {
    totalSkills,
    topCats: categories.slice(0, 8).map(c => {
      const def = CATEGORIES.find(d => d.id === c.category);
      return { id: c.category, name: def?.name || c.category, icon: def?.icon || "·", count: c._count };
    }),
    recentSkills,
    articles,
  };
}

export default async function HomePage() {
  const d = await getHomeData();

  return (
    <div className="mx-auto max-w-5xl px-6 sm:px-10 space-y-28 pb-24">

      {/* ============ HERO ============ */}
      <section className="pt-16 sm:pt-24">
        <div className="overline r1">AI Agent Directory · {d.totalSkills.toLocaleString()}+ Agents</div>

        <h1 className="display text-[var(--fg)] mt-6 r2">
          智能体<br />宇宙<span className="text-[var(--gold)]">。</span>
        </h1>

        <div className="hr mt-10 mb-8 r3" />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 r3">
          <p className="body-lg lg:col-span-3">
            每一个智能体都经过安全审计，每一个都值得信赖。<br />
            从此刻开始，用 AI 重新定义你的生产力。
          </p>
          <div className="lg:col-span-2 flex flex-col gap-3">
            <Link href="/skills" className="btn btn-primary">探索全部智能体</Link>
            <Link href="/blog" className="btn btn-ghost">阅读使用指南</Link>
          </div>
        </div>
      </section>

      {/* ============ STATS ROW ============ */}
      <section className="r2">
        <div className="hr mb-10" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { value: d.totalSkills.toLocaleString(), label: "智能体总数" },
            { value: d.topCats.length.toString(), label: "门类" },
            { value: "每日更新", label: "更新频率" },
            { value: "100%", label: "安全审计覆盖" },
          ].map(s => (
            <div key={s.label}>
              <div className="display text-[var(--fg)]" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>{s.value}</div>
              <div className="overline mt-2">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="hr mt-10" />
      </section>

      {/* ============ SKILLS ============ */}
      <section>
        <div className="flex items-baseline justify-between mb-10 r1">
          <h2 className="heading-xl text-[var(--fg)]">最新入库</h2>
          <Link href="/skills" className="overline hover:text-[var(--gold)] transition-colors">查看全部 →</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--line)]">
          {d.recentSkills.map((s, i) => (
            <Link key={s.id} href={`/skills/${s.slug}`}
              className={`card p-6 bg-[var(--bg)] hover:bg-[#0d0d12] transition group r${Math.min(i+1,5)}`}>
              <div className="overline mb-4">{s.category}</div>
              <h3 className="heading-lg text-[var(--fg)] group-hover:text-[var(--gold)] transition-colors mb-3">{s.name}</h3>
              <p className="body-text text-sm line-clamp-3">{s.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ ARTICLES ============ */}
      <section>
        <div className="flex items-baseline justify-between mb-10 r1">
          <h2 className="heading-xl text-[var(--fg)]">使用指南</h2>
          <Link href="/blog" className="overline hover:text-[var(--gold)] transition-colors">全部文章 →</Link>
        </div>

        {d.articles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[var(--line)]">
            {d.articles.map((a, i) => (
              <Link key={a.slug} href={`/blog/${a.slug}`}
                className={`card p-8 bg-[var(--bg)] hover:bg-[#0d0d12] transition group r${Math.min(i+1,5)}`}>
                <div className="overline mb-6">{a.category}</div>
                <h3 className="heading-lg text-[var(--fg)] group-hover:text-[var(--gold)] transition-colors mb-4">{a.title}</h3>
                <p className="body-text text-sm">{a.excerpt || a.description}</p>
                <div className="hr mt-6 pt-4 overline group-hover:text-[var(--gold)] transition-colors">阅读全文 →</div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card p-16 text-center">
            <p className="body-lg">第一篇指南正在撰写中</p>
          </div>
        )}
      </section>

      {/* ============ CATEGORIES ============ */}
      <section>
        <h2 className="heading-xl text-[var(--fg)] mb-10 r1">探索门类</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[var(--line)]">
          {d.topCats.map((c, i) => (
            <Link key={c.id} href={`/categories/${c.id}`}
              className={`card p-6 bg-[var(--bg)] hover:bg-[#0d0d12] transition group r${Math.min(i+1,5)}`}>
              <span className="text-3xl mb-3 block">{c.icon}</span>
              <div className="heading-lg text-[var(--fg)] group-hover:text-[var(--gold)] transition-colors">{c.name}</div>
              <div className="mono-stat mt-2">{c.count} 个智能体</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ CLOSING ============ */}
      <section className="text-center py-12 r1">
        <div className="hr-gold mb-12" />
        <p className="body-lg max-w-lg mx-auto mb-8">
          {d.totalSkills.toLocaleString()}+ AI 智能体，等待你的调遣。
        </p>
        <Link href="/skills" className="btn btn-primary text-base px-12 py-4">
          立即探索
        </Link>
        <div className="hr-gold mt-12" />
      </section>

    </div>
  );
}
