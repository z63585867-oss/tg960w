import db from "@/lib/db";

export async function GET() {
  const articles = await db.article.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
    take: 20,
    select: { slug: true, title: true, description: true, publishedAt: true, author: true, category: true },
  });

  const items = articles.map((a) => {
    const pubDate = a.publishedAt ? new Date(a.publishedAt).toUTCString() : new Date().toUTCString();
    return `<item>
      <title><![CDATA[${a.title}]]></title>
      <description><![CDATA[${a.description}]]></description>
      <link>https://tg960w.com/blog/${a.slug}</link>
      <guid>https://tg960w.com/blog/${a.slug}</guid>
      <pubDate>${pubDate}</pubDate>
      <category>${a.category}</category>
      <author>${a.author}</author>
    </item>`;
  });

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>TG960W — Claude Code AI 智能体教程</title>
    <link>https://tg960w.com</link>
    <description>发现 445+ 安全审计过的 Claude Code AI 智能体，每日更新教程</description>
    <language>zh-CN</language>
    <atom:link href="https://tg960w.com/rss.xml" rel="self" type="application/rss+xml"/>
    ${items.join("\n    ")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "s-maxage=3600, stale-while-revalidate" },
  });
}
