import prisma from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const workflow = await prisma.workflow.findUnique({
    where: { id },
    include: {
      steps: {
        orderBy: { orderIndex: 'asc' },
        include: { skill: { select: { slug: true, name: true, description: true } } },
      },
    },
  });

  if (!workflow) return Response.json({ error: 'Not found' }, { status: 404 });

  // Generate commands for each step
  const commands = workflow.steps.map((step) => ({
    skill: step.skill.slug,
    name: step.skill.name,
    command: `/${step.skill.slug}`,
  }));

  // Update run count
  await prisma.workflow.update({
    where: { id },
    data: { runCount: { increment: 1 }, lastRunAt: new Date() },
  });

  return Response.json({ workflow: { id: workflow.id, name: workflow.name }, commands });
}
