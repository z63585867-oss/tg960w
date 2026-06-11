import Link from "next/link";
import { Calendar, Tag } from "lucide-react";

interface ArticleCardProps {
  article: {
    slug: string; title: string; description: string; excerpt: string;
    coverImage?: string | null; category: string; tags: string;
    author: string; publishedAt: string | Date | null;
  };
}

export function ArticleCard({ article }: ArticleCardProps) {
  const tags = JSON.parse(article.tags || "[]") as string[];
  const date = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })
    : null;

  return (
    <Link href={`/blog/${article.slug}`} className="card p-6 group">
      {article.coverImage && (
        <div className="mb-4 overflow-hidden rounded-lg">
          <img src={article.coverImage} alt={article.title}
            className="h-48 w-full object-cover transition duration-500 group-hover:scale-105" />
        </div>
      )}
      <div className="flex items-center gap-3 text-xs">
        <span className="px-2.5 py-0.5 rounded-full text-purple-300 bg-purple-500/10 border border-purple-500/20 font-semibold">
          {article.category}
        </span>
        {date && (
          <span className="flex items-center gap-1 text-zinc-500">
            <Calendar size={12} /> {date}
          </span>
        )}
      </div>
      <h3 className="mt-3 text-lg font-bold text-zinc-100 group-hover:text-purple-300 transition-colors leading-snug">
        {article.title}
      </h3>
      <p className="mt-2 text-sm text-zinc-500 line-clamp-2 leading-relaxed">
        {article.excerpt || article.description}
      </p>
      {tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tags.slice(0, 3).map((tag: string) => (
            <span key={tag} className="flex items-center gap-1 rounded bg-zinc-800/50 px-2 py-0.5 text-[10px] text-zinc-500 border border-zinc-800">
              <Tag size={9} /> {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
