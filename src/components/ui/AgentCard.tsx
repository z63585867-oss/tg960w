'use client';

import { memo } from 'react';
import { useRouter } from 'next/navigation';
import { Play, Clock, Layers } from 'lucide-react';
import { toast } from 'sonner';

interface AgentData {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  goal: string;
  skillChain: string[];
  isTemplate: boolean;
  runCount: number;
  lastRunAt: string | null;
}

export const AgentCard = memo(function AgentCard({ agent }: { agent: AgentData }) {
  const router = useRouter();
  const skillCount = Array.isArray(agent.skillChain) ? agent.skillChain.length : 0;

  const handleExecute = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const res = await fetch(`/api/agents/${agent.id}/execute`, { method: 'POST' });
    const data = await res.json();
    if (data.run) {
      navigator.clipboard.writeText(data.run.commands.join('\n'));
      toast.success(`智能体已启动！${data.run.steps.length} 个步骤已复制到剪贴板`);
    }
  };

  return (
    <div
      onClick={() => router.push(`/agents/${agent.id}`)}
      className="card-interactive group relative overflow-hidden p-5 flex flex-col"
    >
      {/* Badge */}
      {agent.isTemplate && (
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider"
          style={{ background: 'oklch(0.62 0.22 280 / 0.12)', color: 'var(--color-accent)' }}>
          模板
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <span className="text-2xl">{agent.icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm leading-snug group-hover:text-[var(--color-accent)] transition-colors">
            {agent.name}
          </h3>
          <p className="text-xs text-[var(--color-text2)] mt-0.5 line-clamp-2">{agent.description}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 mt-auto pt-3 border-t border-[var(--color-border)]">
        <span className="flex items-center gap-1 text-[10px] text-[var(--color-text2)]">
          <Layers className="w-3 h-3" /> {skillCount} 技能
        </span>
        {agent.runCount > 0 && (
          <span className="flex items-center gap-1 text-[10px] text-[var(--color-text2)]">
            <Play className="w-3 h-3" /> {agent.runCount} 次
          </span>
        )}
        <button
          onClick={handleExecute}
          className="ml-auto flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors opacity-0 group-hover:opacity-100"
          style={{ background: 'oklch(0.62 0.22 280 / 0.15)', color: 'var(--color-accent)' }}>
          <Play className="w-3 h-3" /> 启动
        </button>
      </div>
    </div>
  );
});
