import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Calendar, Tag, ArrowLeft, ExternalLink } from "lucide-react";
import db from "@/lib/db";
import { articleMeta, articleJsonLd } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getArticle(slug: string) {
  const article = await db.article.findUnique({ where: { slug } });
  if (!article || !article.isPublished) return null;

  const relatedSkills = article.relatedSkills
    ? await db.skill.findMany({
        where: { slug: { in: JSON.parse(article.relatedSkills) } },
        select: { slug: true, name: true, description: true, category: true },
      })
    : [];

  return { article, relatedSkills };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await getArticle(slug);
  if (!result) return { title: "文章未找到" };
  return articleMeta({
    title: result.article.title,
    description: result.article.description,
    slug,
    tags: result.article.tags,
    publishedAt: result.article.publishedAt || undefined,
  });
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const result = await getArticle(slug);
  if (!result) notFound();

  const { article, relatedSkills } = result;
  const tags = JSON.parse(article.tags || "[]") as string[];
  const date = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("zh-CN", {
        year: "numeric", month: "long", day: "numeric",
      })
    : null;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd(article)),
        }}
      />

      <Link
        href="/blog"
        className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition"
      >
        <ArrowLeft size={16} /> 返回博客
      </Link>

      <article>
        <header className="mb-10">
          <div className="mb-4 flex items-center gap-3 text-sm text-zinc-400">
            <span className="rounded-full bg-blue-500/10 px-3 py-1 text-blue-400">{article.category}</span>
            {date && (
              <span className="flex items-center gap-1">
                <Calendar size={14} /> {date}
              </span>
            )}
            <span>{article.author}</span>
          </div>

          <h1 className="text-3xl font-bold text-zinc-100 sm:text-4xl">{article.title}</h1>
          <p className="mt-4 text-lg text-zinc-400">{article.description}</p>

          {tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag: string) => (
                <span key={tag} className="flex items-center gap-1 rounded bg-zinc-800 px-2.5 py-1 text-xs text-zinc-400">
                  <Tag size={12} /> {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="prose prose-invert prose-zinc max-w-none
          prose-headings:text-zinc-100 prose-headings:font-semibold
          prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
          prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
          prose-p:text-zinc-300 prose-p:leading-relaxed
          prose-a:text-blue-400 prose-a:no-underline hover:prose-a:text-blue-300
          prose-code:text-blue-300 prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
          prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800
          prose-li:text-zinc-300
          prose-blockquote:border-l-blue-500 prose-blockquote:text-zinc-400
          prose-img:rounded-xl prose-img:shadow-lg
          prose-strong:text-zinc-100"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
            {article.content}
          </ReactMarkdown>
        </div>

        {relatedSkills.length > 0 && (
          <div className="mt-12 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-zinc-200">
              <ExternalLink size={18} /> 相关智能体
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {relatedSkills.map((skill: { slug: string; name: string; description: string; category: string }) => (
                <Link
                  key={skill.slug}
                  href={`/skills/${skill.slug}`}
                  className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 transition hover:border-blue-500/50 hover:bg-zinc-800"
                >
                  <p className="font-medium text-zinc-200">{skill.name}</p>
                  <p className="mt-1 text-xs text-zinc-500 line-clamp-2">{skill.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
