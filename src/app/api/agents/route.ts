import prisma from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const template = searchParams.get('template');

  try {
    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (template === 'true') where.isTemplate = true;
    if (template === 'false') where.isTemplate = false;

    const agents = await prisma.agent.findMany({
      where: where as any,
      orderBy: { updatedAt: 'desc' },
      include: { runs: { orderBy: { createdAt: 'desc' }, take: 1 } },
    });

    return Response.json({ agents });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, description, icon, category, goal, skillChain, config } = await request.json();
    const agent = await prisma.agent.create({
      data: {
        name,
        description,
        icon: icon || '🤖',
        category: category || 'general',
        goal: goal || '',
        skillChain: JSON.stringify(skillChain || []),
        config: JSON.stringify(config || {}),
        isTemplate: false,
      },
    });
    return Response.json({ agent }, { status: 201 });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
