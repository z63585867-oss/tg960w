import { NextRequest } from "next/server";
import prisma, { safeQuery } from "@/lib/db";

export async function GET() {
  return safeQuery(
    async (db) => {
      const favorites = await db.favorite.findMany({
        include: { skill: { select: { id: true, slug: true, name: true, description: true, category: true, tags: true } } },
        orderBy: { createdAt: "desc" },
      });
      return Response.json({
        favorites: favorites.map((f) => ({
          id: f.skill.id, slug: f.skill.slug, name: f.skill.name,
          description: f.skill.description, category: f.skill.category,
          tags: JSON.parse(f.skill.tags), favoriteId: f.id, skillId: f.skillId,
          createdAt: f.createdAt,
        })),
      });
    },
    Response.json({ favorites: [] })
  );
}

export async function POST(request: NextRequest) {
  try {
    const { skillId } = await request.json();
    if (!skillId) return Response.json({ error: "skillId required" }, { status: 400 });
    const favorite = await prisma.favorite.upsert({ where: { skillId }, create: { skillId }, update: {} });
    return Response.json({ favorite });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { skillId } = await request.json();
    if (!skillId) return Response.json({ error: "skillId required" }, { status: 400 });
    await prisma.favorite.deleteMany({ where: { skillId } });
    return Response.json({ removed: true });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
