import { NextRequest } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '50');
  const skillId = searchParams.get('skillId');

  const where: Record<string, unknown> = {};
  if (skillId) where.skillId = skillId;

  const entries = await prisma.history.findMany({
    where: where as any,
    include: {
      skill: {
        select: { slug: true, name: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return Response.json({ entries });
}

export async function POST(request: NextRequest) {
  const { skillId, action, context } = await request.json();
  const entry = await prisma.history.create({
    data: { skillId, action: action || 'view', context: context || null },
  });
  return Response.json({ entry });
}
