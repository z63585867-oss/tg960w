import prisma from '@/lib/db';

export async function GET(
  _request: Request,
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
  return Response.json({ workflow });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { name, description, steps } = await request.json();

  // Delete old steps and recreate
  await prisma.workflowStep.deleteMany({ where: { workflowId: id } });

  const workflow = await prisma.workflow.update({
    where: { id },
    data: {
      name,
      description: description || null,
      steps: {
        create: steps.map((step: { skillSlug: string; config?: unknown; label?: string }, idx: number) => ({
          skill: { connect: { slug: step.skillSlug } },
          orderIndex: idx,
          config: step.config ? JSON.stringify(step.config) : null,
          label: step.label || null,
        })),
      },
    },
    include: {
      steps: {
        orderBy: { orderIndex: 'asc' },
        include: { skill: { select: { slug: true, name: true } } },
      },
    },
  });

  return Response.json({ workflow });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.workflow.delete({ where: { id } });
  return Response.json({ deleted: true });
}
