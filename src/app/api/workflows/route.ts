import prisma from '@/lib/db';

export async function GET() {
  try {
    const workflows = await prisma.workflow.findMany({
      include: {
        steps: {
          orderBy: { orderIndex: 'asc' },
          include: {
            skill: { select: { slug: true, name: true } },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return Response.json({ workflows });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, description, steps } = await request.json();

    const workflow = await prisma.workflow.create({
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

    return Response.json({ workflow }, { status: 201 });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
