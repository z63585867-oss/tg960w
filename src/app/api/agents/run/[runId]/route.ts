import prisma from '@/lib/db';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ runId: string }> }
) {
  const { runId } = await params;
  try {
    const run = await prisma.agentRun.findUnique({
      where: { id: runId },
      include: { agent: { select: { name: true, icon: true, goal: true } } },
    });
    if (!run) return Response.json({ error: 'Not found' }, { status: 404 });

    return Response.json({
      run: {
        ...run,
        steps: JSON.parse(run.steps),
        agentName: run.agent.name,
        agentIcon: run.agent.icon,
        agentGoal: run.agent.goal,
      },
    });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
