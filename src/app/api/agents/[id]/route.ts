import prisma from '@/lib/db';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const agent = await prisma.agent.findUnique({
      where: { id },
      include: {
        runs: { orderBy: { createdAt: 'desc' }, take: 10 },
      },
    });
    if (!agent) return Response.json({ error: 'Not found' }, { status: 404 });

    return Response.json({
      agent: {
        ...agent,
        skillChain: JSON.parse(agent.skillChain),
        config: JSON.parse(agent.config),
        runs: agent.runs.map((r) => ({
          ...r,
          steps: JSON.parse(r.steps),
        })),
      },
    });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { name, description, icon, category, goal, skillChain, config } = await request.json();
    const agent = await prisma.agent.update({
      where: { id },
      data: {
        name,
        description,
        icon: icon || '🤖',
        category: category || 'general',
        goal: goal || '',
        skillChain: JSON.stringify(skillChain || []),
        config: JSON.stringify(config || {}),
      },
    });
    return Response.json({ agent });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.agent.delete({ where: { id } });
  return Response.json({ deleted: true });
}
