import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { CATEGORIES } from '@/lib/categories';

export async function GET() {
  try {
    const counts = await prisma.skill.groupBy({
      by: ['category'],
      _count: { id: true },
      where: { isIndexed: true },
    });

    const total = await prisma.skill.count({ where: { isIndexed: true } });

    const categories = CATEGORIES.map((cat) => {
      const data = counts.find((c) => c.category === cat.id);
      return {
        ...cat,
        skillCount: data?._count.id || 0,
      };
    }).filter((c) => c.skillCount > 0);

    return Response.json({ categories, total });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
