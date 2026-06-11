'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Workflow as WorkflowIcon, ArrowRight, Play, Trash2, Clock, Edit3 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { Workflow } from '@/types';
import { toast } from 'sonner';

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetch('/api/workflows')
      .then((r) => r.json())
      .then((d) => setWorkflows(d.workflows || []))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除？')) return;
    await fetch(`/api/workflows/${id}`, { method: 'DELETE' });
    toast.success('已删除');
    load();
  };

  const handleRun = async (id: string) => {
    const res = await fetch(`/api/workflows/${id}/execute`, { method: 'POST' });
    const data = await res.json();
    navigator.clipboard.writeText(data.commands.map((c: any) => c.command).join('\n'));
    toast.success('命令已复制到剪贴板');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><WorkflowIcon className="w-6 h-6" />工作流</h1>
          <p className="text-sm text-[var(--color-text2)] mt-0.5">编排技能，一键执行</p>
        </div>
        <Link href="/workflows/new" className="btn btn-primary"><Plus className="w-4 h-4" />创建</Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (<div key={i} className="skeleton h-28 w-full rounded-xl" />))}
        </div>
      ) : workflows.length === 0 ? (
        <div className="text-center py-16 card">
          <WorkflowIcon className="w-16 h-16 mx-auto mb-4 opacity-10" />
          <p className="text-[var(--color-text2)] text-lg mb-1">暂无工作流</p>
          <p className="text-[var(--color-text2)] text-sm opacity-70 mb-4">创建你的第一个技能编排工作流</p>
          <Link href="/workflows/new" className="btn btn-primary">开始创建</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {workflows.map((wf) => (
            <div key={wf.id} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{wf.name}</h3>
                  {wf.description && <p className="text-sm text-[var(--color-text2)] mt-0.5">{wf.description}</p>}
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => handleRun(wf.id)} className="btn btn-sm" style={{ background: 'oklch(0.65 0.18 160 / 0.15)', color: 'var(--color-green)' }}>
                    <Play className="w-3 h-3" /> 执行
                  </button>
                  <Link href={`/workflows/${wf.id}`} className="btn btn-sm btn-ghost"><Edit3 className="w-3 h-3" /></Link>
                  <button onClick={() => handleDelete(wf.id)} className="btn btn-sm btn-ghost hover:!text-red-400"><Trash2 className="w-3 h-3" /></button>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap mb-2">
                {wf.steps.map((s, i) => (
                  <span key={s.id} className="flex items-center gap-1">
                    {i > 0 && <ArrowRight className="w-3 h-3 text-[var(--color-text2)]" />}
                    <span className="tag">{s.skillName || s.skillSlug}</span>
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-4 text-xs text-[var(--color-text2)]">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDate(wf.createdAt)}</span>
                {wf.runCount > 0 && <span>执行 {wf.runCount} 次</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
