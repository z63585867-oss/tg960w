'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Play, Clock, Layers, Target, History, Copy, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { SkeletonCard } from '@/components/ui/Skeleton';

interface StepInfo { skill: string; name: string; command: string; status: string; note: string; }
interface RunInfo { id: string; status: string; steps: StepInfo[]; startedAt: string; completedAt: string | null; result: string | null; error: string | null; }
interface AgentDetail { id: string; name: string; description: string; icon: string; goal: string; skillChain: string[]; config: any; isTemplate: boolean; runCount: number; runs: RunInfo[]; }

export default function AgentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [agent, setAgent] = useState<AgentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [expandStep, setExpandStep] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/agents/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setAgent(d.agent);
        setExpandStep(d.agent?.skillChain?.length || 0 - 1);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleExecute = async () => {
    setExecuting(true);
    const res = await fetch(`/api/agents/${id}/execute`, { method: 'POST' });
    const data = await res.json();
    if (data.run) {
      setAgent((prev) => prev ? { ...prev, runs: [data.run, ...(prev.runs || [])], runCount: prev.runCount + 1 } : prev);
      navigator.clipboard.writeText(data.run.commands.join('\n'));
      toast.success(`已启动！${data.run.steps.length} 条命令已复制`);
    }
    setExecuting(false);
  };

  if (loading) return <div className="max-w-3xl mx-auto space-y-4"><SkeletonCard /><SkeletonCard /></div>;
  if (!agent) return <div className="text-center py-20"><p className="text-[var(--color-text2)]">未找到</p></div>;

  const statusIcon = (s: string) => {
    switch (s) {
      case 'done': return <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--color-green)' }} />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'running': return <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--color-accent)', borderTopColor: 'transparent' }} />;
      default: return <Circle className="w-4 h-4 text-[var(--color-text2)]" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-[var(--color-text2)] hover:text-[var(--color-text)] mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> 返回
      </button>

      {/* Header */}
      <div className="card p-6 sm:p-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
          <span className="text-5xl">{agent.icon}</span>
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight mb-1">{agent.name}</h1>
            <p className="text-sm text-[var(--color-text2)] mb-3">{agent.description}</p>
            <div className="flex items-center gap-3 text-xs text-[var(--color-text2)]">
              <span className="flex items-center gap-1"><Target className="w-3.5 h-3.5" />{agent.goal}</span>
              <span className="flex items-center gap-1"><Layers className="w-3.5 h-3.5" />{agent.skillChain.length} 技能</span>
              <span className="flex items-center gap-1"><Play className="w-3.5 h-3.5" />{agent.runCount} 次执行</span>
            </div>
          </div>
          <button onClick={handleExecute} disabled={executing}
            className="btn flex items-center gap-2 px-6 py-2.5 text-base disabled:opacity-50"
            style={{ background: 'oklch(0.65 0.18 160 / 0.15)', color: 'var(--color-green)', border: '1px solid oklch(0.65 0.18 160 / 0.3)' }}>
            <Play className="w-4 h-4" /> {executing ? '启动中…' : '启动智能体'}
          </button>
        </div>
      </div>

      {/* Execution Plan */}
      <div className="card p-6 mb-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-[var(--color-accent)]" />
          执行计划 ({agent.skillChain.length} 个步骤)
        </h2>
        <div className="space-y-3">
          {agent.skillChain.map((slug: string, i: number) => (
            <div key={i} className="flex items-start gap-3">
              {/* Step indicator */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ background: i === expandStep ? 'var(--color-accent-bg)' : 'var(--color-surface2)', color: i === expandStep ? 'var(--color-accent)' : 'var(--color-text2)' }}>
                  {i + 1}
                </div>
                {i < agent.skillChain.length - 1 && (
                  <div className="w-0.5 h-8 my-0.5" style={{ background: 'var(--color-border)' }} />
                )}
              </div>
              {/* Content */}
              <div
                className={`flex-1 p-3 rounded-lg cursor-pointer transition-all ${i === expandStep ? 'card border-[var(--color-accent)]' : 'card hover:border-[var(--color-text2)]'}`}
                onClick={() => setExpandStep(expandStep === i ? null : i)}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">{slug}</div>
                    <div className="text-[10px] text-[var(--color-text2)] font-mono mt-0.5">/{slug}</div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(`/${slug}`); toast.success('已复制'); }}
                    className="btn btn-ghost btn-sm"><Copy className="w-3 h-3" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Run History */}
      {agent.runs && agent.runs.length > 0 && (
        <div className="card p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-[var(--color-text2)]" />
            执行历史 ({agent.runs.length})
          </h2>
          <div className="space-y-2">
            {agent.runs.map((run) => (
              <div key={run.id} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)]">
                {statusIcon(run.status)}
                <div className="flex-1">
                  <div className="text-sm font-medium">
                    {run.status === 'running' ? '执行中' : run.status === 'completed' ? '已完成' : '失败'}
                  </div>
                  <div className="text-[10px] text-[var(--color-text2)]">
                    {run.startedAt ? new Date(run.startedAt).toLocaleString('zh-CN') : ''}
                  </div>
                </div>
                <span className="tag">{run.steps?.length || 0} 步骤</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
