'use client';
import Link from 'next/link';

interface AgentCardProps { agent: { id: string; name: string; description: string; icon: string; category: string; runCount: number; }; }

export function AgentCard({ agent }: AgentCardProps) {
  return (
    <Link href={`/agents/${agent.id}`} className="card card-padded">
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <span style={{ fontSize: 28 }}>{agent.icon}</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{agent.name}</div>
          <div style={{ fontSize: 12, color: "var(--text3)" }}>{agent.category} · 运行 {agent.runCount} 次</div>
        </div>
      </div>
      <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {agent.description}
      </p>
    </Link>
  );
}
