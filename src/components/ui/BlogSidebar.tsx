import Link from "next/link";
import { Sparkles } from "lucide-react";

const CATEGORIES = [
  { label: "网络安全", slug: "security", count: 500 },
  { label: "开发工程", slug: "engineering", count: 80 },
  { label: "AI / 智能体", slug: "ai-ml", count: 30 },
  { label: "营销增长", slug: "marketing", count: 25 },
  { label: "高管顾问", slug: "c-suite", count: 20 },
  { label: "产品管理", slug: "product", count: 15 },
  { label: "飞书/Lark", slug: "lark", count: 30 },
  { label: "运维/SRE", slug: "devops", count: 15 },
];

export function BlogSidebar() {
  return (
    <aside className="space-y-6">
      <div className="card p-5">
        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-3">
          <span className="gradient-text">✦</span> 文章分类
        </h3>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => (
            <Link key={cat.slug} href={`/blog?category=${cat.slug}`}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-zinc-400 transition hover:bg-zinc-800/50 hover:text-zinc-200">
              <span>{cat.label}</span>
              <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-600 font-mono">{cat.count}+</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="card p-5 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, oklch(0.12 0.04 290), oklch(0.08 0.02 260))" }}>
        <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-15"
          style={{ background: "linear-gradient(135deg, #06b6d4, #a855f7)" }} />
        <div className="relative z-10">
          <h3 className="font-bold text-zinc-200 mb-2 flex items-center gap-2">
            <Sparkles size={16} className="text-cyan-400" /> 关于 TG960W
          </h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            四百余位 AI 工匠的栖息之地。<br />
            每个智能体皆经安全淬炼。<br />
            每日一篇秘籍，助你登堂入室。
          </p>
          <Link href="/skills" className="mt-3 inline-block text-sm text-purple-400 hover:text-purple-300 font-semibold transition">
            探索智能体宇宙 →
          </Link>
        </div>
      </div>
    </aside>
  );
}
