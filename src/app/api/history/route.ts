import { NextRequest } from "next/server";
import prisma, { safeQuery } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "20");
  return safeQuery(
    async (db) => {
      const entries = await db.history.findMany({
        orderBy: { createdAt: "desc" }, take: Math.min(100, limit),
        include: { skill: { select: { slug: true, name: true, category: true } } },
      });
      return Response.json({
        entries: entries.map((e) => ({ id: e.id, skillSlug: e.skill.slug, skillName: e.skill.name, category: e.skill.category, action: e.action, context: e.context, createdAt: e.createdAt })),
      });
    },
    Response.json({ entries: [] })
  );
}

export async function POST(request: NextRequest) {
  try {
    const { skillId, action, context } = await request.json();
    if (!skillId) return Response.json({ error: "skillId required" }, { status: 400 });
    const entry = await prisma.history.create({ data: { skillId, action: action || "view", context } });
    return Response.json({ entry });
  } catch (e: any) { return Response.json({ error: e.message }, { status: 500 }); }
}
