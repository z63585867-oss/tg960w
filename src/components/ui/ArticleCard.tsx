import Link from "next/link";
import { Calendar, Tag } from "lucide-react";

interface ArticleCardProps {
  article: {
    slug: string;
    title: string;
    description: string;
    excerpt: string;
    coverImage?: string | null;
    category: string;
    tags: string;
    author: string;
    publishedAt: string | Date | null;
  };
}

export function ArticleCard({ article }: ArticleCardProps) {
  const tags = JSON.parse(article.tags || "[]") as string[];
  const date = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("zh-CN", {
        year: "numeric", month: "long", day: "numeric",
      })
    : null;

  return (
    <Link href={`/blog/${article.slug}`} className="group block rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition hover:border-zinc-700 hover:bg-zinc-900">
      {article.coverImage && (
        <div className="mb-4 overflow-hidden rounded-lg">
          <img src={article.coverImage} alt={article.title} className="h-48 w-full object-cover transition group-hover:scale-105" />
        </div>
      )}
      <div className="flex items-center gap-3 text-sm text-zinc-400">
        <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-blue-400">{article.category}</span>
        {date && (
          <span className="flex items-center gap-1">
            <Calendar size={14} /> {date}
          </span>
        )}
      </div>
      <h3 className="mt-3 text-lg font-semibold text-zinc-100 group-hover:text-blue-400 transition-colors">{article.title}</h3>
      <p className="mt-2 text-sm text-zinc-400 line-clamp-2">{article.excerpt || article.description}</p>
      {tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tags.slice(0, 3).map((tag) => (
            <span key={tag} className="flex items-center gap-1 rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-500">
              <Tag size={10} /> {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
