import Link from "next/link";

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
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
        <h3 className="mb-3 font-semibold text-zinc-200">文章分类</h3>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/blog?category=${cat.slug}`}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
            >
              <span>{cat.label}</span>
              <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-500">{cat.count}+</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
        <h3 className="mb-3 font-semibold text-zinc-200">关于 TG960W</h3>
        <p className="text-sm text-zinc-400 leading-relaxed">
          发现 445+ 安全审计过的 Claude Code AI 智能体。每日更新教程，帮助你从零到一掌握 AI 编程助手，提升 10 倍开发效率。
        </p>
        <Link href="/skills" className="mt-3 inline-block text-sm text-blue-400 hover:text-blue-300">
          浏览全部智能体 →
        </Link>
      </div>
    </aside>
  );
}
