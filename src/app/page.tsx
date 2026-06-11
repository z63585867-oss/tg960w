import Link from "next/link";
import { ArrowRight, Sparkles, Globe, Shield, Flame, BookOpen, Star, Zap, Layers } from "lucide-react";
import db from "@/lib/db";
import { SkillCard } from "@/components/ui/SkillCard";
import { CATEGORIES } from "@/lib/categories";

async function getHomeData() {
  const [totalSkills, totalFavorites, categories, recentSkills, articles] = await Promise.all([
    db.skill.count(),
    db.favorite.count(),
    db.skill.groupBy({ by: ["category"], _count: true, orderBy: { _count: { category: "desc" } } }),
    db.skill.findMany({ orderBy: { updatedAt: "desc" }, take: 6 }),
    db.article.findMany({ where: { isPublished: true }, orderBy: { publishedAt: "desc" }, take: 4,
      select: { slug: true, title: true, excerpt: true, description: true, category: true, tags: true, publishedAt: true }
    }),
  ]);

  const topCats = categories.slice(0, 8).map((c) => {
    const def = CATEGORIES.find((d) => d.id === c.category);
    return { id: c.category, name: def?.name || c.category, icon: def?.icon || "📦", count: c._count };
  });

  return { totalSkills, totalFavorites, topCats, recentSkills, articles };
}

export default async function HomePage() {
  const data = await getHomeData();

  return (
    <div className="mx-auto max-w-6xl px-6 sm:px-8 space-y-24 pb-20">
      {/* ========== HERO ========== */}
      <section className="relative pt-16 sm:pt-24">
        <div className="max-w-3xl">
          {/* Label */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/8 border border-amber-500/15 mb-8 ani-fade ani-fade-1">
            <Sparkles size={13} className="text-amber-400" />
            <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-amber-300/80">AI Agent Ecosystem</span>
          </div>

          {/* Title */}
          <h1 className="text-[clamp(2.8rem,6vw,4.5rem)] font-black leading-[1.05] tracking-[-0.03em] mb-6 ani-fade ani-fade-2">
            <span className="text-[#e8e6e3]">在这里，</span>
            <br />
            <span className="g-text">遇见你的 AI 化身</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-zinc-400 leading-relaxed max-w-xl mb-4 ani-fade ani-fade-3">
            {data.totalSkills.toLocaleString()}+ 智能体，每日新增。
          </p>
          <p className="text-base text-zinc-500 leading-relaxed max-w-lg mb-10 ani-fade ani-fade-3">
            每一个都经过安全审计，每一个都值得信赖。<br />
            从此刻开始，用 AI 重新定义你的生产力。
          </p>

          {/* CTA */}
          <div className="flex flex-wrap items-center gap-4 ani-fade ani-fade-4">
            <Link href="/skills" className="btn btn-primary text-[15px] px-8 py-3.5 rounded-xl">
              <Globe size={18} /> 探索全部智能体
            </Link>
            <Link href="/blog" className="btn btn-secondary text-[15px] px-8 py-3.5 rounded-xl">
              <BookOpen size={18} /> 阅读指南
            </Link>
          </div>

          {/* Trust */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mt-12 pt-10 border-t border-white/5 ani-fade ani-fade-5">
            {[
              { icon: Shield, label: "双引擎安全审计" },
              { icon: Flame, label: `${data.totalSkills.toLocaleString()}+ 智能体` },
              { icon: Sparkles, label: "每日 AI 创作" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2.5 text-sm text-zinc-500">
                <item.icon size={15} className="text-zinc-600" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ========== STATS ========== */}
      <section>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "智能体", value: data.totalSkills.toLocaleString(), icon: Zap },
            { label: "分类领域", value: data.topCats.length.toString(), icon: Layers },
            { label: "收藏", value: data.totalFavorites.toString(), icon: Star },
            { label: "指南文章", value: data.articles.length + "+", icon: BookOpen },
          ].map((s) => (
            <div key={s.label} className="glass-card p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/8 flex items-center justify-center">
                <s.icon size={20} className="text-amber-400/70" />
              </div>
              <div>
                <div className="text-2xl font-black text-zinc-200">{s.value}</div>
                <div className="text-xs text-zinc-500 tracking-wide">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========== RECENT SKILLS ========== */}
      <section>
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.15em] uppercase text-amber-400/60 mb-3">最新入库</p>
            <h2 className="text-2xl font-bold text-zinc-100">智能体目录</h2>
          </div>
          <Link href="/skills?sort=recent" className="btn btn-ghost text-sm">
            查看全部 <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.recentSkills.map((s, i) => {
            const skill = { ...s, tags: JSON.parse(s.tags) };
            return (
              <div key={s.id} className={`ani-fade ani-fade-${i + 1}`}>
                <SkillCard skill={skill as any} />
              </div>
            );
          })}
        </div>
      </section>

      {/* ========== ARTICLES ========== */}
      <section>
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.15em] uppercase text-amber-400/60 mb-3">每日更新</p>
            <h2 className="text-2xl font-bold text-zinc-100">使用指南</h2>
          </div>
          <Link href="/blog" className="btn btn-ghost text-sm">
            全部文章 <ArrowRight size={14} />
          </Link>
        </div>
        {data.articles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.articles.map((a, i) => (
              <Link key={a.slug} href={`/blog/${a.slug}`}
                className={`card card-link p-6 group ani-fade ani-fade-${i + 1}`}>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/8 text-amber-400/80 border border-amber-500/10 mb-3">
                  {a.category}
                </span>
                <h3 className="text-lg font-bold text-zinc-200 group-hover:text-amber-300 transition-colors leading-snug">
                  {a.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-500 line-clamp-2 leading-relaxed">
                  {a.excerpt || a.description}
                </p>
                <div className="mt-4 flex items-center gap-1 text-xs text-amber-500/60 group-hover:text-amber-400 transition-colors font-medium">
                  阅读全文 <ArrowRight size={12} />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="glass-card p-16 text-center">
            <Sparkles size={36} className="mx-auto mb-4 text-amber-500/20" />
            <p className="text-zinc-500 text-lg font-medium">第一篇指南正在撰写中</p>
            <p className="text-zinc-600 text-sm mt-1">明天回来，必有新篇</p>
          </div>
        )}
      </section>

      {/* ========== CATEGORIES ========== */}
      <section>
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-[0.15em] uppercase text-amber-400/60 mb-3">全部门类</p>
          <h2 className="text-2xl font-bold text-zinc-100">探索门类</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {data.topCats.map((c, i) => (
            <Link key={c.id} href={`/categories/${c.id}`}
              className={`card card-link p-4 flex items-center gap-3 ani-fade ani-fade-${Math.min(i + 1, 5)}`}>
              <span className="text-2xl">{c.icon}</span>
              <div>
                <div className="text-sm font-semibold text-zinc-300">{c.name}</div>
                <div className="text-xs text-zinc-600 mt-0.5">{c.count} 个智能体</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========== BOTTOM ========== */}
      <section>
        <div className="glass-card p-10 sm:p-14 text-center glow-warm relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ background: "radial-gradient(circle at 50% 0%, #f59e0b, transparent 70%)" }} />
          <div className="relative z-10 max-w-lg mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black mb-4 text-zinc-100">
              准备好开始了吗？
            </h2>
            <p className="text-zinc-500 mb-8 leading-relaxed">
              {data.totalSkills.toLocaleString()}+ 个 AI 智能体，每一个都是精心打磨的利器。
              探索、收藏、编排——你的 AI 工作台，由此开始。
            </p>
            <Link href="/skills" className="btn btn-primary text-lg px-10 py-4 rounded-xl">
              <Zap size={20} /> 立即探索
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
