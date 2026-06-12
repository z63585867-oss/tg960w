import prisma, { safeQuery } from "@/lib/db";

export async function GET() {
  return safeQuery(
    async (db) => {
      const [totalSkills, totalFavorites, categories, recentSkills, recentHistory] = await Promise.all([
        db.skill.count({ where: { isIndexed: true } }),
        db.favorite.count(),
        db.skill.groupBy({ by: ["category"], _count: true, orderBy: { _count: { category: "desc" } }, take: 10 }),
        db.skill.findMany({ orderBy: { updatedAt: "desc" }, take: 8,
          select: { id: true, slug: true, name: true, description: true, category: true, tags: true, updatedAt: true }
        }),
        db.history.findMany({ orderBy: { createdAt: "desc" }, take: 10,
          include: { skill: { select: { slug: true, name: true, category: true } } }
        }),
      ]);

      return Response.json({
        totalSkills,
        totalFavorites,
        categories: categories.map((c) => ({ category: c.category, count: c._count })),
        recentSkills: recentSkills.map((s) => ({ ...s, tags: JSON.parse(s.tags) })),
        recentActivity: recentHistory.map((h) => ({
            id: h.id, skillSlug: h.skill.slug, skillName: h.skill.name,
            category: h.skill.category, action: h.action, createdAt: h.createdAt,
          })),
      });
    },
    Response.json({ totalSkills: 0, totalFavorites: 0, categories: [], recentSkills: [], recentActivity: [] })
  );
}
