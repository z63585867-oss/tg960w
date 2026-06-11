import Link from "next/link";
import { Zap, Star, FolderTree, Clock, TrendingUp, Grid3X3, ArrowRight, BookOpen, Search } from "lucide-react";
import db from "@/lib/db";
import { SkillCard } from "@/components/ui/SkillCard";
import { CATEGORIES } from "@/lib/categories";

async function getHomeData() {
  const [totalSkills, totalFavorites, categories, recentSkills, articles] = await Promise.all([
    db.skill.count(),
    db.favorite.count(),
    db.skill.groupBy({ by: ["category"], _count: true, orderBy: { _count: { category: "desc" } } }),
    db.skill.findMany({ orderBy: { updatedAt: "desc" }, take: 8 }),
    db.article.findMany({ where: { isPublished: true }, orderBy: { publishedAt: "desc" }, take: 4,
      select: { slug: true, title: true, excerpt: true, description: true, category: true, tags: true, author: true, publishedAt: true }
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
    <div className="mx-auto max-w-7xl px-6 space-y-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl p-8 pb-10 sm:p-12 sm:pb-14"
        style={{
          background: "linear-gradient(135deg, oklch(0.20 0.04 280) 0%, oklch(0.15 0.02 270) 50%, oklch(0.13 0.02 260) 100%)",
          border: "1px solid oklch(0.30 0.04 280)",
        }}>
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-20"
          style={{ background: "oklch(0.62 0.22 280)" }} />
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            <span style={{ color: "oklch(0.72 0.22 280)" }}>TG960W</span>{" "}
            <span className="opacity-90">Claude Code 智能体工作台</span>
          </h1>
          <p className="text-base sm:text-lg opacity-60 leading-relaxed">
            发现 {data.totalSkills.toLocaleString()}+ 安全审计过的 AI 智能体，每日更新教程。
            从零到一掌握 Claude Code，提升 10 倍开发效率。
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <Link href="/skills" className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-medium transition"
              style={{ background: "oklch(0.60 0.22 280)", color: "white" }}>
              <Grid3X3 size={18} /> 浏览全部智能体
            </Link>
            <Link href="/blog" className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-medium border transition"
              style={{ borderColor: "oklch(0.30 0.04 280)", color: "oklch(0.72 0.22 280)" }}>
              <BookOpen size={18} /> 阅读教程
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "智能体", value: data.totalSkills.toLocaleString(), icon: Zap, accent: "oklch(0.72 0.22 280)" },
          { label: "分类", value: data.topCats.length.toString(), icon: FolderTree, accent: "oklch(0.60 0.18 180)" },
          { label: "收藏", value: data.totalFavorites.toString(), icon: Star, accent: "oklch(0.70 0.16 80)" },
          { label: "教程文章", value: data.articles.length.toString() + "+", icon: TrendingUp, accent: "oklch(0.60 0.20 30)" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${s.accent}20` }}>
              <s.icon size={20} style={{ color: s.accent }} />
            </div>
            <div>
              <div className="text-2xl font-bold text-zinc-100">{s.value}</div>
              <div className="text-xs text-zinc-500">{s.label}</div>
            </div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main: Recent Skills + Blog */}
        <div className="lg:col-span-2 space-y-10">
          {/* Recent Skills */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-zinc-100">
                <Clock size={20} className="text-blue-400" /> 最近更新的智能体
              </h2>
              <Link href="/skills?sort=recent" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                查看全部 <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.recentSkills.map((s) => {
                const skill = { ...s, tags: JSON.parse(s.tags) };
                return <SkillCard key={s.id} skill={skill as any} />;
              })}
            </div>
          </section>

          {/* Latest Blog */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-zinc-100">
                <BookOpen size={20} className="text-green-400" /> 最新教程
              </h2>
              <Link href="/blog" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                全部文章 <ArrowRight size={14} />
              </Link>
            </div>
            {data.articles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.articles.map((a) => (
                  <Link key={a.slug} href={`/blog/${a.slug}`}
                    className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 transition hover:border-zinc-700 hover:bg-zinc-900 group">
                    <span className="rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs text-green-400">{a.category}</span>
                    <h3 className="mt-2 font-semibold text-zinc-200 group-hover:text-green-400 transition-colors">{a.title}</h3>
                    <p className="mt-1 text-sm text-zinc-500 line-clamp-2">{a.excerpt || a.description}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-10 text-center">
                <p className="text-zinc-500">AI 正在努力创作中，明天回来看看！</p>
              </div>
            )}
          </section>
        </div>

        {/* Sidebar: Categories + Quick Links */}
        <aside className="space-y-6">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
            <h3 className="text-sm font-semibold mb-3 text-zinc-400 uppercase tracking-wider">智能体分类</h3>
            <div className="space-y-1">
              {data.topCats.map((c) => (
                <Link key={c.id} href={`/categories/${c.id}`}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-800 transition-colors group">
                  <span className="text-lg">{c.icon}</span>
                  <span className="flex-1 text-sm text-zinc-300 group-hover:text-zinc-100 truncate">{c.name}</span>
                  <span className="rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-500">{c.count}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
            <h3 className="text-sm font-semibold mb-3 text-zinc-400 uppercase tracking-wider">快速入口</h3>
            <div className="space-y-2">
              <Link href="/skills" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition">
                <Search size={16} /> 搜索智能体
              </Link>
              <Link href="/blog" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition">
                <BookOpen size={16} /> 教程文章
              </Link>
              <Link href="/favorites" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition">
                <Star size={16} /> 我的收藏
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-5">
            <h3 className="font-semibold text-zinc-200 mb-2">安全承诺</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              所有智能体均经过双引擎安全扫描（skill-security-scan + claude-skill-antivirus 9引擎审计），确保安全可用。
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
