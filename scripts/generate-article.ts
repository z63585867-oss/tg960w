/**
 * AI 文章生成脚本
 * 每天选取一个冷门 Skill，调用 DeepSeek API 生成中文教程文章
 * 用法：npx tsx scripts/generate-article.ts
 */

import { PrismaClient as PC } from "@/prisma-client/client";
import type { PrismaClient } from "@/prisma-client/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

function createPrismaClient(): PrismaClient {
  const dbUrl = process.env.DATABASE_URL || "file:./prisma/skillos.db";
  const adapter = new PrismaLibSql({
    url: dbUrl.startsWith("file:") ? dbUrl : `file:${dbUrl}`,
  });
  return new (PC as any)({ adapter }) as PrismaClient;
}

const prisma = createPrismaClient();

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || "";
const DEEPSEEK_BASE = "https://api.deepseek.com";
const SKILLS_DIR = process.env.SKILLS_DIR || "C:/Users/78526/.agents/skills";

interface DeepSeekResponse {
  choices: { message: { content: string } }[];
}

async function callDeepSeek(prompt: string): Promise<string> {
  const res = await fetch(`${DEEPSEEK_BASE}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "你是一个 Claude Code 智能体教程作者。用中文撰写专业、易懂的技术教程。" },
        { role: "user", content: prompt },
      ],
      max_tokens: 3000,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    throw new Error(`DeepSeek API error: ${res.status} ${await res.text()}`);
  }
  const data = (await res.json()) as DeepSeekResponse;
  return data.choices[0].message.content;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9一-鿿]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function pickColdSkill() {
  // Pick a skill with the fewest history views (least popular)
  const skills = await prisma.skill.findMany({
    select: {
      slug: true, name: true, description: true, category: true,
      tags: true, fullContent: true, sourcePath: true,
    },
    orderBy: { createdAt: "asc" },
    take: 50,
  });

  // Randomize from the pool of cold skills
  const skill = skills[Math.floor(Math.random() * skills.length)];
  return skill;
}

async function main() {
  if (!DEEPSEEK_API_KEY) {
    console.error("[ERROR] DEEPSEEK_API_KEY not set. Skipping article generation.");
    return;
  }

  console.log("[INFO] Picking a cold skill to write about...");
  const skill = await pickColdSkill();
  console.log(`[INFO] Selected: ${skill.name} (${skill.category})`);

  // Read SKILL.md content
  let skillContent = skill.fullContent || "";
  if (!skillContent && skill.sourcePath) {
    const mdPath = join(SKILLS_DIR, skill.sourcePath, "SKILL.md");
    if (existsSync(mdPath)) {
      skillContent = readFileSync(mdPath, "utf-8");
    }
  }
  // Truncate to reasonable context
  skillContent = skillContent.slice(0, 4000);

  const prompt = `请为 Claude Code 智能体 "${skill.name}" 撰写一篇中文教程文章。

智能体描述：${skill.description}
智能体分类：${skill.category}
标签：${skill.tags || "无"}

智能体 SKILL.md 内容摘要：
${skillContent.slice(0, 2000)}

要求：
1. 标题吸引人，包含关键词"${skill.name}"
2. 800-1500 字
3. 包含以下章节：智能体简介、核心功能、使用场景、快速上手步骤、最佳实践、总结
4. SEO 友好的描述（120-160 字）
5. 3-5 个相关标签
6. 适合中文开发者阅读

请输出 JSON 格式：
{
  "title": "文章标题",
  "description": "SEO 描述，120-160 字",
  "excerpt": "文章摘要，50-80 字",
  "category": "${skill.category}",
  "tags": ["标签1", "标签2", "标签3"],
  "content": "Markdown 格式的完整文章"
}`;

  console.log("[INFO] Calling DeepSeek API...");
  let output: string;
  try {
    output = await callDeepSeek(prompt);
  } catch (err) {
    console.error(`[ERROR] DeepSeek API failed: ${err}`);
    return;
  }

  // Parse JSON from response
  let article: { title: string; description: string; excerpt: string; category: string; tags: string[]; content: string };
  try {
    const jsonMatch = output.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      article = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error("No JSON found in response");
    }
  } catch {
    console.error("[ERROR] Failed to parse article JSON from DeepSeek response");
    console.log("[DEBUG] Raw output:", output.slice(0, 500));
    return;
  }

  const slug = slugify(article.title) + "-" + Date.now().toString(36);

  console.log(`[INFO] Saving article: ${article.title}`);
  const saved = await prisma.article.create({
    data: {
      slug,
      title: article.title,
      description: article.description,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      tags: JSON.stringify(article.tags),
      author: "TG960W AI",
      relatedSkills: JSON.stringify([skill.slug]),
      isPublished: true,
      publishedAt: new Date(),
    },
  });

  // Also save SEO meta
  await prisma.sEOMeta.upsert({
    where: { path: `/blog/${slug}` },
    update: {
      title: article.title,
      description: article.description,
      keywords: article.tags.join(", "),
    },
    create: {
      path: `/blog/${slug}`,
      title: article.title,
      description: article.description,
      keywords: article.tags.join(", "),
    },
  });

  console.log(`[DONE] Article created: ${slug}`);
  console.log(`  Title: ${article.title}`);
  console.log(`  Tags: ${article.tags.join(", ")}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
