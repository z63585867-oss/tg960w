/**
 * 社媒分发脚本
 * 将最新文章摘要推送到 X/Twitter（需要配置 API 密钥）
 * 如果未配置则静默跳过
 */

import { PrismaClient as PC } from "@/prisma-client/client";
import type { PrismaClient } from "@/prisma-client/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

function createPrismaClient(): PrismaClient {
  const dbUrl = process.env.DATABASE_URL || "file:./prisma/skillos.db";
  const adapter = new PrismaLibSql({
    url: dbUrl.startsWith("file:") ? dbUrl : `file:${dbUrl}`,
  });
  return new (PC as any)({ adapter }) as PrismaClient;
}

const prisma = createPrismaClient();

const X_API_KEY = process.env.X_API_KEY || "";
const X_API_SECRET = process.env.X_API_SECRET || "";
const X_ACCESS_TOKEN = process.env.X_ACCESS_TOKEN || "";
const X_ACCESS_SECRET = process.env.X_ACCESS_SECRET || "";

async function main() {
  const hasXCredentials = X_API_KEY && X_API_SECRET && X_ACCESS_TOKEN && X_ACCESS_SECRET;

  // Find today's article (most recent published)
  const article = await prisma.article.findFirst({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
  });

  if (!article) {
    console.log("[SKIP] No published articles found");
    return;
  }

  const postText = `🆕 ${article.title}\n\n${article.excerpt || article.description.slice(0, 100)}\n\n🔗 https://tg960w.com/blog/${article.slug}\n\n#ClaudeCode #AI智能体 #TG960W`;

  console.log("[INFO] Prepared post:");
  console.log(postText);

  if (hasXCredentials) {
    // X API v2 tweet
    try {
      const res = await fetch("https://api.twitter.com/2/tweets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${X_ACCESS_TOKEN}`,
        },
        body: JSON.stringify({ text: postText }),
      });
      if (res.ok) {
        console.log("[DONE] Posted to X/Twitter");
      } else {
        console.error(`[ERROR] X API: ${res.status} ${await res.text()}`);
      }
    } catch (err) {
      console.error(`[ERROR] X post failed: ${err}`);
    }
  } else {
    console.log("[SKIP] X/Twitter credentials not configured. Copy the post above manually.");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
