import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");
  const category = searchParams.get("category");
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { isPublished: true };
  if (category) where.category = category;

  const [articles, total] = await Promise.all([
    db.article.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true, slug: true, title: true, description: true, excerpt: true,
        coverImage: true, category: true, tags: true, author: true,
        publishedAt: true, createdAt: true,
      },
    }),
    db.article.count({ where }),
  ]);

  return NextResponse.json({
    articles,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get("secret") !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const article = await db.article.create({ data: body });
  return NextResponse.json(article);
}
