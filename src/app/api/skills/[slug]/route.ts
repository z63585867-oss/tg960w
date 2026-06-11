import { NextRequest } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const skill = await prisma.skill.findUnique({
      where: { slug },
      include: {
        favorites: { select: { id: true } },
        history: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!skill) {
      return Response.json({ error: 'Skill not found' }, { status: 404 });
    }

    // Get related skills (same category, exclude self)
    const related = await prisma.skill.findMany({
      where: {
        category: skill.category,
        id: { not: skill.id },
        isIndexed: true,
      },
      take: 6,
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        category: true,
        tags: true,
      },
    });

    const skillData = {
      ...skill,
      tags: JSON.parse(skill.tags),
      isFavorite: skill.favorites.length > 0,
      relatedSkills: related.map((r) => ({
        ...r,
        tags: JSON.parse(r.tags),
      })),
    };

    return Response.json({ skill: skillData });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
