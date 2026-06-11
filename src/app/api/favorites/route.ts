import { NextRequest } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  const favorites = await prisma.favorite.findMany({
    include: {
      skill: {
        select: {
          id: true,
          slug: true,
          name: true,
          description: true,
          category: true,
          tags: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return Response.json({
    favorites: favorites.map((f) => ({
      favoriteId: f.id,
      skillId: f.skillId,
      createdAt: f.createdAt,
      ...f.skill,
      tags: JSON.parse(f.skill.tags),
    })),
  });
}

export async function POST(request: NextRequest) {
  const { skillId } = await request.json();
  const favorite = await prisma.favorite.upsert({
    where: { skillId },
    create: { skillId },
    update: {},
  });
  return Response.json({ favorite });
}

export async function DELETE(request: NextRequest) {
  const { skillId } = await request.json();
  await prisma.favorite.deleteMany({ where: { skillId } });
  return Response.json({ removed: true });
}
