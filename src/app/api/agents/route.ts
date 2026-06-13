import prisma, { safeQuery } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  return safeQuery(
    async (db) => {
      const where: Record<string, unknown> = {};
      if (category) where.category = category;
      const agents = await db.agent.findMany({ where: where as any, orderBy: { updatedAt: "desc" }, include: { runs: { orderBy: { createdAt: "desc" }, take: 1 } } });
      return Response.json({ agents });
    },
    Response.json({ agents: [] })
  );
}

export async function POST(request: Request) {
  try {
    const { name, description, icon, category, goal, skillChain, config } = await request.json();
    if (!name) return Response.json({ error: "Name required" }, { status: 400 });
    const agent = await prisma.agent.create({ data: { name, description: description || "", icon: icon || "🤖", category: category || "general", goal: goal || "", skillChain: skillChain || "[]", config: config || "{}" } });
    return Response.json({ agent }, { status: 201 });
  } catch (e: any) { return Response.json({ error: e.message }, { status: 500 }); }
}
