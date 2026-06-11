import prisma from '@/lib/db';

interface StepResult {
  skill: string;
  name: string;
  command: string;
  status: 'pending' | 'running' | 'done' | 'error';
  note: string;
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const agent = await prisma.agent.findUnique({ where: { id } });
    if (!agent) return Response.json({ error: 'Not found' }, { status: 404 });

    const skillNames: string[] = JSON.parse(agent.skillChain);
    const steps: StepResult[] = [];

    // Resolve each skill to its slug and name
    for (const name of skillNames) {
      const skill = await prisma.skill.findFirst({
        where: { slug: name },
        select: { slug: true, name: true },
      });
      if (skill) {
        steps.push({
          skill: skill.slug,
          name: skill.name,
          command: `/${skill.slug}`,
          status: 'pending',
          note: '',
        });
      } else {
        steps.push({
          skill: name,
          name: name,
          command: `/${name}`,
          status: 'error',
          note: '技能未在数据库中',
        });
      }
    }

    // Create run record
    const run = await prisma.agentRun.create({
      data: {
        agentId: id,
        status: 'running',
        steps: JSON.stringify(steps),
        startedAt: new Date(),
      },
    });

    // Update agent stats
    await prisma.agent.update({
      where: { id },
      data: { runCount: { increment: 1 }, lastRunAt: new Date() },
    });

    // Return the execution plan
    const commands = steps.map((s) => s.command);

    return Response.json({
      run: {
        id: run.id,
        agentId: agent.id,
        agentName: agent.name,
        status: 'running',
        steps,
        commands,
        instructions: [
          `🤖 智能体 **${agent.name}** 已启动`,
          `📋 目标: ${agent.goal}`,
          '---',
          '请在 Claude Code 中**依次**执行以下命令：',
          ...commands.map((c, i) => `  ${i + 1}. ${c}`),
          '---',
          '每个步骤完成后，报告执行结果。',
        ].join('\n'),
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
    const { runId, status, steps, result, error } = await request.json();
    const run = await prisma.agentRun.update({
      where: { id: runId },
      data: {
        status,
        steps: steps ? JSON.stringify(steps) : undefined,
        result: result || undefined,
        error: error || undefined,
        completedAt: status === 'completed' || status === 'failed' ? new Date() : undefined,
      },
    });
    return Response.json({ run });
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}
