import type { Metadata } from "next";

const SITE_URL = "https://tg960w.com";
const SITE_NAME = "TG960W — Claude Code 智能体工作台";
const SITE_DESC = "发现 445+ 安全审计过的 Claude Code AI 智能体，每日更新教程，从零到一掌握 AI 编程助手。";

export function siteMeta(overrides?: Partial<Metadata>): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
    description: SITE_DESC,
    keywords: [
      "Claude Code", "AI智能体", "Agent Skills", "AI编程助手",
      "Anthropic Claude", "人工智能工具", "AI教程", "智能体市场",
      "编程效率", "自动化工作流"
    ],
    authors: [{ name: "TG960W" }],
    creator: "TG960W",
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: SITE_NAME,
      description: SITE_DESC,
      url: SITE_URL,
      locale: "zh_CN",
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_NAME,
      description: SITE_DESC,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    alternates: {
      canonical: SITE_URL,
    },
    ...overrides,
  };
}

export function skillMeta(skill: {
  name: string;
  description: string;
  category: string;
  tags?: string;
}): Metadata {
  const title = `${skill.name} — AI 智能体`;
  const desc = skill.description?.slice(0, 160) || SITE_DESC;
  const url = `${SITE_URL}/skills/${skill.name}`;
  const keywords = [skill.name, skill.category, ...JSON.parse(skill.tags || "[]")];

  return {
    title,
    description: desc,
    keywords,
    openGraph: {
      title,
      description: desc,
      url,
      type: "article",
    },
    twitter: { card: "summary", title, description: desc },
    alternates: { canonical: url },
  };
}

export function articleMeta(article: {
  title: string;
  description: string;
  slug: string;
  tags?: string;
  publishedAt?: Date | null;
}): Metadata {
  const desc = article.description?.slice(0, 160) || SITE_DESC;
  const url = `${SITE_URL}/blog/${article.slug}`;
  const keywords = JSON.parse(article.tags || "[]");

  return {
    title: article.title,
    description: desc,
    keywords,
    openGraph: {
      title: article.title,
      description: desc,
      url,
      type: "article",
      publishedTime: article.publishedAt?.toISOString(),
    },
    twitter: { card: "summary_large_image", title: article.title, description: desc },
    alternates: { canonical: url },
  };
}

export function articleJsonLd(article: {
  title: string;
  description: string;
  slug: string;
  author: string;
  publishedAt?: Date | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    author: { "@type": "Person", name: article.author },
    datePublished: article.publishedAt?.toISOString(),
    publisher: { "@type": "Organization", name: "TG960W", url: SITE_URL },
    url: `${SITE_URL}/blog/${article.slug}`,
  };
}

export function softwareJsonLd(skill: { name: string; description: string; category: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: skill.name,
    description: skill.description,
    applicationCategory: "AIApplication",
    operatingSystem: "All",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
}
