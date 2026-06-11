import { MetadataRoute } from "next";
import db from "@/lib/db";

const SITE_URL = "https://tg960w.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [skills, articles] = await Promise.all([
    db.skill.findMany({ select: { slug: true, updatedAt: true }, orderBy: { updatedAt: "desc" } }),
    db.article.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true, publishedAt: true } }),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/skills`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
  ];

  const skillPages: MetadataRoute.Sitemap = skills.map((s) => ({
    url: `${SITE_URL}/skills/${s.slug}`,
    lastModified: s.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const articlePages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_URL}/blog/${a.slug}`,
    lastModified: a.publishedAt || a.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...articlePages, ...skillPages];
}
