'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, X, GripVertical, Save, Play, Search } from 'lucide-react';
import type { Skill } from '@/types';
import { CATEGORIES } from '@/lib/categories';
import { toast } from 'sonner';

interface Step { skillSlug: string; label: string; skillName: string; }

export default function NewWorkflowPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [steps, setSteps] = useState<Step[]>([]);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('');

  useEffect(() => {
    fetch('/api/skills?pageSize=2000')
      .then((r) => r.json())
      .then((d) => setAllSkills(d.skills || []))
      .catch(() => {});
  }, []);

  const filtered = allSkills.filter((s) => {
    if (cat && s.category !== cat) return false;
    if (search) { const q = search.toLowerCase(); return s.name.toLowerCase().includes(q) || s.slug.toLowerCase().includes(q); }
    return true;
  });

  const save = async () => {
    if (!name.trim()) return toast.error('请输入名称');
    if (!steps.length) return toast.error('请添加至少一个技能');
    const res = await fetch('/api/workflows', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description: desc, steps }),
    });
    if (res.ok) { toast.success('已创建'); router.push('/workflows'); }
    else toast.error('创建失败');
  };

  const run = () => {
    if (!steps.length) return;
    navigator.clipboard.writeText(steps.map((s) => `/${s.skillSlug}`).join('\n'));
    toast.success('命令已复制');
  };

  return (
    <div className="flex gap-6 max-w-6xl mx-auto h-[calc(100vh-7rem)]">
      {/* Builder */}
      <div className="flex-1 overflow-auto">
        <Link href="/workflows" className="flex items-center gap-1.5 text-sm text-[var(--color-text2)] hover:text-[var(--color-text)] mb-4">
          <ArrowLeft className="w-4 h-4" /> 返回
        </Link>
        <div className="card p-6">
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="工作流名称…"
            className="w-full text-xl font-bold bg-transparent border-none outline-none text-[var(--color-text)] placeholder:text-[var(--color-text2)] mb-2" />
          <input type="text" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="描述（可选）…"
            className="w-full text-sm bg-transparent border-none outline-none text-[var(--color-text2)] mb-6" />

          <div>
            <h3 className="text-sm font-medium text-[var(--color-text2)] mb-3">步骤 ({steps.length})</h3>
            {!steps.length ? (
              <div className="text-center py-12 rounded-xl border-2 border-dashed border-[var(--color-border)] text-sm text-[var(--color-text2)]">
                点击右侧面板添加技能步骤
              </div>
            ) : (
              <div className="space-y-2">
                {steps.map((s, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg"
                    style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
                    <GripVertical className="w-4 h-4 text-[var(--color-text2)] cursor-grab" />
                    <span className="text-xs font-mono text-[var(--color-accent)] w-6">{i + 1}.</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{s.skillName}</div>
                      <div className="text-[10px] text-[var(--color-text2)] font-mono">/{s.skillSlug}</div>
                    </div>
                    <button onClick={() => setSteps(steps.filter((_, j) => j !== i))}
                      className="p-1 text-[var(--color-text2)] hover:text-red-400 transition-colors"><X className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <button onClick={save} className="btn btn-primary"><Save className="w-4 h-4" />保存</button>
          <button onClick={run} className="btn btn-secondary" style={{ color: 'var(--color-green)', borderColor: 'oklch(0.65 0.18 160 / 0.3)' }}>
            <Play className="w-4 h-4" />执行并复制命令
          </button>
        </div>
      </div>

      {/* Palette */}
      <div className="w-72 shrink-0">
        <div className="sticky top-0 card p-4 max-h-[calc(100vh-9rem)] flex flex-col">
          <h4 className="font-medium text-sm mb-3">技能面板</h4>
          <div className="relative mb-2">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text2)]" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜索…"
              className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs border outline-none bg-[var(--color-bg)] border-[var(--color-border)] focus:border-[var(--color-accent)]" />
          </div>
          <div className="flex gap-1 mb-3 flex-wrap">
            <button onClick={() => setCat('')} className={`tag !text-[10px] cursor-pointer ${!cat ? '!bg-[var(--color-accent-bg)] !text-[var(--color-accent)]' : ''}`}>全部</button>
            {CATEGORIES.slice(0, 8).map((c) => (
              <button key={c.id} onClick={() => setCat(c.id === cat ? '' : c.id)}
                className={`tag !text-[10px] cursor-pointer ${cat === c.id ? '!bg-[var(--color-accent-bg)] !text-[var(--color-accent)]' : ''}`}>{c.icon}</button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto space-y-0.5">
            {filtered.slice(0, 80).map((s) => (
              <button key={s.id} onClick={() => { setSteps([...steps, { skillSlug: s.slug, label: '', skillName: s.name }]); }}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left text-xs hover:bg-[var(--color-bg)] transition-colors group">
                <Plus className="w-3 h-3 text-[var(--color-text2)] opacity-0 group-hover:opacity-100 flex-shrink-0" />
                <span className="flex-1 truncate">{s.name}</span>
                <span className="text-[10px] text-[var(--color-text2)] truncate max-w-20">{s.slug}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
