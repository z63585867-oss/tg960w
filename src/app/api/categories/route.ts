import prisma, { safeQuery } from "@/lib/db";
import { CATEGORIES } from "@/lib/categories";

export async function GET() {
  return safeQuery(
    async (db) => {
      const [counts, total] = await Promise.all([
        db.skill.groupBy({ by: ["category"], _count: true, orderBy: { _count: { category: "desc" } } }),
        db.skill.count({ where: { isIndexed: true } }),
      ]);

      const categories = counts.map((c) => {
        const def = CATEGORIES.find((d) => d.id === c.category);
        return {
          id: c.category,
          name: def?.name || c.category,
          slug: c.category,
          icon: def?.icon || "📦",
          skillCount: c._count,
        };
      });

      return Response.json({ categories, total });
    },
    Response.json({ categories: [], total: 0 })
  );
}
