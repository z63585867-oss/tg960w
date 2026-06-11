'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bot, Plus, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { AgentCard } from '@/components/ui/AgentCard';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { CATEGORIES } from '@/lib/categories';

interface AgentData {
  id: string; name: string; description: string; icon: string;
  category: string; goal: string; skillChain: string[];
  isTemplate: boolean; runCount: number; lastRunAt: string | null;
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('/api/agents')
      .then((r) => r.json())
      .then((d) => setAgents((d.agents || []).map((a: any) => ({
        ...a,
        skillChain: typeof a.skillChain === 'string' ? JSON.parse(a.skillChain) : (a.skillChain || []),
      }))))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? agents : agents.filter((a) => a.category === filter);
  const templates = agents.filter((a) => a.isTemplate);
  const custom = agents.filter((a) => !a.isTemplate);

  const catGroups = [...new Set(agents.map((a) => a.category))].map((c) => ({
    id: c,
    label: CATEGORIES.find((d) => d.id === c)?.name || c,
    icon: CATEGORIES.find((d) => d.id === c)?.icon || '📦',
  }));

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl p-8 border"
        style={{
          background: 'linear-gradient(135deg, oklch(0.20 0.04 160) 0%, oklch(0.15 0.02 270) 60%)',
          borderColor: 'oklch(0.30 0.04 160)',
        }}>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-15"
          style={{ background: 'oklch(0.65 0.18 160)' }} />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'oklch(0.65 0.18 160 / 0.2)' }}>
                <Sparkles className="w-5 h-5" style={{ color: 'oklch(0.70 0.18 160)' }} />
              </div>
              <span className="text-xs font-semibold tracking-widest uppercase opacity-50">Beta</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              <span style={{ color: 'oklch(0.70 0.18 160)' }}>智能体工坊</span>
            </h1>
            <p className="text-base opacity-50 max-w-lg">
              预置 12 个专业智能体，一键启动自动化工作流——安全审计、全栈开发、内容创作、商业尽调……
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/agents/new" className="btn btn-primary">
              <Plus className="w-4 h-4" /> 创建智能体
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: '模板智能体', value: templates.length.toString(), icon: Sparkles, color: 'oklch(0.70 0.18 160)' },
          { label: '自定义', value: custom.length.toString(), icon: Bot, color: 'oklch(0.72 0.22 280)' },
          { label: '总执行次数', value: agents.reduce((s, a) => s + a.runCount, 0).toString(), icon: Zap, color: 'oklch(0.70 0.16 80)' },
          { label: '覆盖领域', value: catGroups.length.toString(), icon: TrendingUp, color: 'oklch(0.60 0.20 30)' },
        ].map((s) => (
          <div key={s.label} className="card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${s.color}20` }}>
              <s.icon className="w-5 h-5" style={{ color: s.color }} />
            </div>
            <div>
              <div className="text-xl font-bold">{s.value}</div>
              <div className="text-xs text-[var(--color-text2)]">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        <button onClick={() => setFilter('all')}
          className={`tag !text-xs !px-3 !py-1.5 cursor-pointer ${filter === 'all' ? '!bg-[var(--color-accent-bg)] !text-[var(--color-accent)]' : ''}`}>
          🤖 全部 ({agents.length})
        </button>
        {catGroups.map((c) => (
          <button key={c.id} onClick={() => setFilter(c.id)}
            className={`tag !text-xs !px-3 !py-1.5 cursor-pointer ${filter === c.id ? '!bg-[var(--color-accent-bg)] !text-[var(--color-accent)]' : ''}`}>
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (<SkeletonCard key={i} />))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 card">
          <Bot className="w-16 h-16 mx-auto mb-4 opacity-10" />
          <p className="text-lg text-[var(--color-text2)] mb-1">暂无智能体</p>
          <p className="text-sm text-[var(--color-text2)] opacity-70 mb-4">创建你的第一个自动化工作流智能体</p>
          <Link href="/agents/new" className="btn btn-primary">创建智能体</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((a) => (<AgentCard key={a.id} agent={a} />))}
        </div>
      )}
    </div>
  );
}
