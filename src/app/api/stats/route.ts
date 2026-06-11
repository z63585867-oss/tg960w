import prisma from '@/lib/db';

export async function GET() {
  try {
    const [totalSkills, categoryCounts, recentSkills, totalFavorites, recentHistory] = await Promise.all([
      prisma.skill.count({ where: { isIndexed: true } }),
      prisma.skill.groupBy({ by: ['category'], _count: { id: true }, where: { isIndexed: true } }),
      prisma.skill.findMany({
        where: { isIndexed: true },
        orderBy: { updatedAt: 'desc' },
        take: 6,
        select: { id: true, slug: true, name: true, description: true, category: true, tags: true },
      }),
      prisma.favorite.count(),
      prisma.history.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { skill: { select: { slug: true, name: true, category: true } } },
      }),
    ]);

    const categories = categoryCounts
      .map((c) => ({ category: c.category, count: c._count.id }))
      .sort((a, b) => b.count - a.count);

    return Response.json({
      totalSkills,
      totalFavorites,
      categories,
      recentSkills: recentSkills.map((s) => ({ ...s, tags: JSON.parse(s.tags) })),
      recentActivity: recentHistory.map((h) => ({
        id: h.id,
        skillSlug: h.skill.slug,
        skillName: h.skill.name,
        category: h.skill.category,
        action: h.action,
        createdAt: h.createdAt,
      })),
    });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
