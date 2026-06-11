import { NextRequest } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const q = searchParams.get('q');
  const sort = searchParams.get('sort') || 'name';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '20')));
  const offset = (page - 1) * pageSize;

  try {
    const where: Record<string, unknown> = { isIndexed: true };
    if (category) where.category = category;
    if (q) {
      where.OR = [
        { name: { contains: q } },
        { description: { contains: q } },
        { tags: { contains: q } },
        { slug: { contains: q } },
      ];
    }

    let orderBy: Record<string, string> = { name: 'asc' };
    if (sort === 'category') orderBy = { category: 'asc' };
    else if (sort === 'recent') orderBy = { updatedAt: 'desc' };

    const [skills, total] = await Promise.all([
      prisma.skill.findMany({
        where: where as any,
        orderBy: orderBy as any,
        take: pageSize,
        skip: offset,
        select: {
          id: true, slug: true, name: true, description: true,
          category: true, subcategory: true, tags: true,
          tier: true, author: true, sourceType: true, parentGroup: true,
          createdAt: true, updatedAt: true,
        },
      }),
      prisma.skill.count({ where: where as any }),
    ]);

    const parsed = skills.map((s) => ({ ...s, tags: JSON.parse(s.tags) }));

    return Response.json({
      skills: parsed,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
        hasMore: offset + pageSize < total,
      },
    });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
