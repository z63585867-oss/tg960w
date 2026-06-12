import Link from "next/link";
import { ArrowRight, Sparkles, Globe, Shield, Flame, BookOpen, Star, Zap, Layers, Search } from "lucide-react";
import db from "@/lib/db";
import { SkillCard } from "@/components/ui/SkillCard";
import { CATEGORIES } from "@/lib/categories";

async function getHomeData() {
  const [totalSkills, totalFavorites, categories, recentSkills, articles] = await Promise.all([
    db.skill.count(),
    db.favorite.count(),
    db.skill.groupBy({ by: ["category"], _count: true, orderBy: { _count: { category: "desc" } } }),
    db.skill.findMany({ orderBy: { updatedAt: "desc" }, take: 8 }),
    db.article.findMany({ where: { isPublished: true }, orderBy: { publishedAt: "desc" }, take: 3,
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
    <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-20 pb-16">

      {/* ============ HERO ============ */}
      <section className="relative pt-12 sm:pt-20 pb-8">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-[120px] opacity-[0.07]"
          style={{ background: "radial-gradient(circle, #f59e0b, transparent 70%)" }} />
        <div className="absolute top-20 -right-20 w-80 h-80 rounded-full blur-[100px] opacity-[0.05]"
          style={{ background: "radial-gradient(circle, #6366f1, transparent 70%)" }} />

        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/10 bg-amber-500/[0.04] mb-6 anim-1">
            <Sparkles size={13} className="text-amber-400" />
            <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-amber-400/80">
              {data.totalSkills.toLocaleString()}+ AI Agents
            </span>
          </div>

          <h1 className="text-[clamp(2.5rem,5.5vw,4rem)] font-black leading-[1.08] tracking-[-0.03em] text-zinc-100 anim-2">
            你的 AI<br />
            <span className="gradient-text">智能体宇宙</span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-500 leading-relaxed max-w-lg mt-5 anim-3">
            每一个智能体都经过安全审计，每一个都值得信赖。<br />
            探索、收藏、编排——用 AI 重新定义你的生产力。
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-8 anim-4">
            <Link href="/skills" className="btn btn-primary text-[15px] px-7 py-3 rounded-xl">
              <Globe size={18} /> 探索智能体
            </Link>
            <Link href="/blog" className="btn btn-secondary text-[15px] px-7 py-3 rounded-xl">
              <BookOpen size={18} /> 使用指南
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-10 pt-8 border-t border-white/[0.04] anim-5">
            {[
              { icon: Shield, label: "双引擎安全审计" },
              { icon: Flame, label: "每日更新" },
              { icon: Sparkles, label: "AI 驱动创作" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-sm text-zinc-500">
                <item.icon size={14} className="text-zinc-600" />
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ============ STATS ============ */}
      <section className="anim-1">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "智能体", value: data.totalSkills.toLocaleString(), color: "#f59e0b", icon: Zap },
            { label: "分类", value: data.topCats.length.toString(), color: "#6366f1", icon: Layers },
            { label: "收藏", value: data.totalFavorites.toString(), color: "#f43f5e", icon: Star },
            { label: "指南", value: data.articles.length + "+", color: "#10b981", icon: BookOpen },
          ].map((s) => (
            <div key={s.label} className="card-accent p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${s.color}10` }}>
                <s.icon size={20} style={{ color: s.color }} />
              </div>
              <div>
                <div className="text-2xl font-black text-zinc-200">{s.value}</div>
                <div className="text-xs text-zinc-500 mt-0.5">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ SKILLS ============ */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-amber-500/60 mb-2">最新入库</p>
            <h2 className="text-xl font-bold text-zinc-200">智能体目录</h2>
          </div>
          <Link href="/skills" className="btn btn-ghost text-sm">
            全部 <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {data.recentSkills.map((s, i) => {
            const skill = { ...s, tags: JSON.parse(s.tags) };
            return (
              <div key={s.id} className={`anim-${Math.min(i + 1, 5)}`}>
                <SkillCard skill={skill as any} />
              </div>
            );
          })}
        </div>
      </section>

      {/* ============ ARTICLES ============ */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-amber-500/60 mb-2">每日更新</p>
            <h2 className="text-xl font-bold text-zinc-200">使用指南</h2>
          </div>
          <Link href="/blog" className="btn btn-ghost text-sm">
            全部 <ArrowRight size={14} />
          </Link>
        </div>
        {data.articles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {data.articles.map((a, i) => (
              <Link key={a.slug} href={`/blog/${a.slug}`}
                className={`card-accent p-5 group anim-${Math.min(i + 1, 5)}`}>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/[0.06] text-amber-500/80 border border-amber-500/10 mb-3">
                  {a.category}
                </span>
                <h3 className="font-bold text-zinc-200 group-hover:text-amber-400 transition-colors leading-snug">
                  {a.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-500 line-clamp-2 leading-relaxed">
                  {a.excerpt || a.description}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card-accent p-14 text-center">
            <Sparkles size={36} className="mx-auto mb-3 text-amber-500/15" />
            <p className="text-zinc-500 font-medium">第一篇指南正在撰写中</p>
          </div>
        )}
      </section>

      {/* ============ CATEGORIES ============ */}
      <section>
        <div className="mb-6">
          <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-amber-500/60 mb-2">探索门类</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {data.topCats.map((c, i) => (
            <Link key={c.id} href={`/categories/${c.id}`}
              className={`card-accent p-4 flex items-center gap-3 anim-${Math.min(i + 1, 5)}`}>
              <span className="text-2xl flex-shrink-0">{c.icon}</span>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-zinc-300 truncate">{c.name}</div>
                <div className="text-[11px] text-zinc-600 mt-0.5">{c.count} 个</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ BOTTOM ============ */}
      <section>
        <div className="relative overflow-hidden rounded-2xl p-10 sm:p-14 text-center"
          style={{
            background: "linear-gradient(135deg, oklch(0.12 0.02 80 / 0.9), oklch(0.10 0.03 270 / 0.9))",
            border: "1px solid oklch(0.30 0.04 80 / 0.15)",
          }}>
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ background: "radial-gradient(circle at 50% 0%, #f59e0b, transparent 70%)" }} />
          <div className="relative z-10 max-w-md mx-auto">
            <h2 className="text-2xl font-black text-zinc-200 mb-3">准备好开始了吗？</h2>
            <p className="text-zinc-500 mb-6 leading-relaxed">
              {data.totalSkills.toLocaleString()}+ AI 智能体，等待你的调遣。
            </p>
            <Link href="/skills" className="btn btn-primary text-lg px-10 py-3.5 rounded-xl">
              <Zap size={20} /> 立即探索
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
