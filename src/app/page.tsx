import Link from "next/link";
import { Zap, Star, FolderTree, Clock, TrendingUp, Grid3X3, ArrowRight, BookOpen, Sparkles, Globe, Shield, Flame } from "lucide-react";
import db from "@/lib/db";
import { SkillCard } from "@/components/ui/SkillCard";
import { CATEGORIES } from "@/lib/categories";

async function getHomeData() {
  const [totalSkills, totalFavorites, categories, recentSkills, articles] = await Promise.all([
    db.skill.count(),
    db.favorite.count(),
    db.skill.groupBy({ by: ["category"], _count: true, orderBy: { _count: { category: "desc" } } }),
    db.skill.findMany({ orderBy: { updatedAt: "desc" }, take: 6 }),
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
    <div className="mx-auto max-w-7xl px-6 space-y-16">
      {/* ========== HERO — 大字报风格 ========== */}
      <section className="relative pt-16 pb-8">
        {/* Decorative elements */}
        <div className="absolute -top-20 left-1/4 w-72 h-72 rounded-full blur-3xl opacity-20"
          style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }} />
        <div className="absolute top-40 right-10 w-48 h-48 rounded-full blur-3xl opacity-10"
          style={{ background: "linear-gradient(135deg, #06b6d4, #a855f7)" }} />

        <div className="relative z-10 max-w-4xl">
          {/* Subtitle badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/5 mb-6 animate-fade-up">
            <Sparkles size={14} className="text-purple-400" />
            <span className="text-xs font-semibold tracking-widest uppercase text-purple-300">AI Agent Ecosystem · 人工智能体生态</span>
          </div>

          {/* Main title — BIG BOLD */}
          <h1 className="hero-title mb-4 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <span className="gradient-text">TG960W</span>
            <br />
            <span className="text-zinc-100">AI 智能体宇宙</span>
          </h1>

          {/* Subtitle — poetic */}
          <p className="hero-subtitle mb-3 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            四百余位数字匠人，驻扎于此。每一个智能体，都是一把削铁如泥的思维之刃。
          </p>
          <p className="hero-subtitle mb-8 animate-fade-up text-zinc-500" style={{ animationDelay: "0.25s" }}>
            不是工具集，是武器库。不是说明书，是武功秘籍。
          </p>

          {/* CTA */}
          <div className="flex flex-wrap items-center gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Link href="/skills" className="btn btn-primary text-base px-8 py-3 rounded-xl">
              <Globe size={18} /> 探索全部智能体
            </Link>
            <Link href="/blog" className="btn btn-secondary text-base px-8 py-3 rounded-xl">
              <BookOpen size={18} /> 阅读秘籍
            </Link>
            <span className="text-sm text-zinc-600 hidden sm:block">
              {data.totalSkills.toLocaleString()}+ 智能体 · 每日更新
            </span>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center gap-5 mt-10 pt-8 border-t border-zinc-800/50 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            {[
              { icon: Shield, label: "双引擎安全审计", sub: "skill-security-scan + 9引擎" },
              { icon: Flame, label: "445+ 智能体", sub: "已通过安全验证" },
              { icon: Sparkles, label: "AI 每日创作", sub: "DeepSeek 驱动教程" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <item.icon size={18} className="text-purple-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-zinc-200">{item.label}</div>
                  <div className="text-xs text-zinc-500">{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Neon Divider */}
      <hr className="neon-divider" />

      {/* ========== STATS ========== */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "智能体", value: data.totalSkills.toLocaleString(), icon: Zap, gradient: "from-purple-500 to-pink-500" },
          { label: "分类领域", value: data.topCats.length.toString(), icon: FolderTree, gradient: "from-cyan-500 to-blue-500" },
          { label: "收藏", value: data.totalFavorites.toString(), icon: Star, gradient: "from-yellow-500 to-amber-500" },
          { label: "秘籍文章", value: data.articles.length.toString() + "+", icon: TrendingUp, gradient: "from-green-500 to-emerald-500" },
        ].map((s) => (
          <div key={s.label} className="card p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${s.gradient} bg-opacity-10`}
              style={{ background: `linear-gradient(135deg, var(--color-${s.gradient.split('-')[1]}-500, #a855f7)20, transparent)` }}>
              <s.icon size={22} className="text-zinc-100" />
            </div>
            <div>
              <div className="text-2xl font-black text-zinc-100">{s.value}</div>
              <div className="text-xs text-zinc-500 uppercase tracking-wider">{s.label}</div>
            </div>
          </div>
        ))}
      </section>

      {/* ========== MAIN CONTENT ========== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: Recent Skills + Blog */}
        <div className="lg:col-span-2 space-y-12">
          {/* Recent Skills */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="gradient-text">//</span> 最新入库
              </h2>
              <Link href="/skills?sort=recent" className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1 transition">
                全部 <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.recentSkills.map((s) => {
                const skill = { ...s, tags: JSON.parse(s.tags) };
                return <SkillCard key={s.id} skill={skill as any} />;
              })}
            </div>
          </section>

          {/* Blog Preview */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="gradient-text">//</span> 最新秘籍
              </h2>
              <Link href="/blog" className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1 transition">
                全部文章 <ArrowRight size={14} />
              </Link>
            </div>
            {data.articles.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {data.articles.map((a, i) => (
                  <Link key={a.slug} href={`/blog/${a.slug}`}
                    className="card p-6 group animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <span className="tag mb-2 inline-block">{a.category}</span>
                        <h3 className="text-lg font-bold text-zinc-100 group-hover:text-purple-300 transition-colors mt-2">{a.title}</h3>
                        <p className="mt-2 text-sm text-zinc-500 line-clamp-2 leading-relaxed">{a.excerpt || a.description}</p>
                      </div>
                      <div className="flex-shrink-0 w-1 h-full min-h-[60px] rounded-full bg-gradient-to-b from-purple-500 via-pink-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="card p-12 text-center">
                <Sparkles size={32} className="mx-auto mb-3 text-purple-500/50" />
                <p className="text-zinc-500 text-lg">秘笈正在撰写中</p>
                <p className="text-zinc-600 text-sm mt-1">AI 铸剑师正在锻造第一篇文章，明日归来</p>
              </div>
            )}
          </section>
        </div>

        {/* Right Sidebar */}
        <aside className="space-y-6">
          {/* Categories */}
          <div className="card p-5">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4">
              <span className="gradient-text">✦</span> 智能体门类
            </h3>
            <div className="space-y-1">
              {data.topCats.map((c) => (
                <Link key={c.id} href={`/categories/${c.id}`}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800/50 transition group">
                  <span className="text-lg">{c.icon}</span>
                  <span className="flex-1 text-sm text-zinc-300 group-hover:text-zinc-100 truncate">{c.name}</span>
                  <span className="text-xs text-zinc-600 font-mono">{c.count}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Manifesto */}
          <div className="card p-6 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, oklch(0.12 0.04 290), oklch(0.10 0.02 260))" }}>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-20"
              style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }} />
            <div className="relative z-10">
              <h3 className="text-lg font-black mb-3">
                <span className="gradient-text">安全即信仰</span>
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                每一个智能体，皆经双引擎扫描淬炼。<br />
                skill-security-scan 轻量快扫，<br />
                claude-skill-antivirus 九引擎深度审计。<br />
                <span className="text-purple-300 font-semibold mt-2 block">
                  不安全的代码，不配出现在这里。
                </span>
              </p>
            </div>
          </div>

          {/* Quick nav */}
          <div className="card p-5 space-y-2">
            <Link href="/skills" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800/50 transition text-sm text-zinc-400 hover:text-zinc-200">
              <Globe size={16} className="text-purple-400" /> 探索智能体
            </Link>
            <Link href="/blog" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800/50 transition text-sm text-zinc-400 hover:text-zinc-200">
              <BookOpen size={16} className="text-cyan-400" /> 阅读秘籍
            </Link>
            <Link href="/favorites" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800/50 transition text-sm text-zinc-400 hover:text-zinc-200">
              <Star size={16} className="text-yellow-400" /> 我的收藏
            </Link>
          </div>
        </aside>
      </div>

      {/* Bottom CTA */}
      <section className="pb-12">
        <div className="card p-10 text-center relative overflow-hidden animate-pulse-glow">
          <div className="absolute inset-0 opacity-10"
            style={{ background: "radial-gradient(circle at 50% 0%, #a855f7, transparent 60%)" }} />
          <div className="relative z-10">
            <h2 className="text-2xl font-black mb-3">
              <span className="gradient-text">准备好进入智能体宇宙了吗？</span>
            </h2>
            <p className="text-zinc-500 mb-6 max-w-md mx-auto">
              四百余位 AI 工匠，等你调遣。从安全审计到视频剪辑，从 CEO 顾问到量子计算——总有一位适合你。
            </p>
            <Link href="/skills" className="btn btn-primary text-lg px-10 py-3.5 rounded-xl animate-pulse-glow">
              <Zap size={20} /> 立即探索
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
