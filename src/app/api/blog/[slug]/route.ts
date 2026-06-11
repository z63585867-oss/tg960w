import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const article = await db.article.findUnique({ where: { slug } });
  if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const related = article.relatedSkills
    ? await db.skill.findMany({
        where: { slug: { in: JSON.parse(article.relatedSkills) } },
        select: { slug: true, name: true, description: true, category: true },
      })
    : [];

  return NextResponse.json({ article, relatedSkills: related });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get("secret") !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slug } = await params;
  const body = await req.json();
  const article = await db.article.update({ where: { slug }, data: body });
  return NextResponse.json(article);
}
