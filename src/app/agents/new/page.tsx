'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, X, Save, Search, Sparkles } from 'lucide-react';
import { CATEGORIES } from '@/lib/categories';
import type { Skill } from '@/types';
import { toast } from 'sonner';

export default function NewAgentPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('🤖');
  const [category, setCategory] = useState('general');
  const [goal, setGoal] = useState('');
  const [skillChain, setSkillChain] = useState<string[]>([]);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [search, setSearch] = useState('');
  const [skillCat, setSkillCat] = useState('');

  useEffect(() => {
    fetch('/api/skills?pageSize=2000')
      .then((r) => r.json())
      .then((d) => setAllSkills(d.skills || []))
      .catch(() => {});
  }, []);

  const filtered = allSkills.filter((s) => {
    if (skillCat && s.category !== skillCat) return false;
    if (search) { const q = search.toLowerCase(); return s.name.toLowerCase().includes(q) || s.slug.toLowerCase().includes(q); }
    return true;
  });

  const icons = ['🤖','🛡️','🚀','📝','💼','🔧','🎨','📊','🧪','🦜','💰','✍️','⚡','🔥','💡','🎯','🌟','🏆'];

  const save = async () => {
    if (!name.trim()) return toast.error('请输入名称');
    if (!skillChain.length) return toast.error('请添加至少一个技能');
    const res = await fetch('/api/agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, icon, category, goal, skillChain, config: { mode: 'sequential', autoRetry: true } }),
    });
    if (res.ok) { toast.success('智能体已创建'); router.push('/agents'); }
    else toast.error('创建失败');
  };

  return (
    <div className="flex gap-6 max-w-6xl mx-auto h-[calc(100vh-7rem)]">
      <div className="flex-1 overflow-auto">
        <Link href="/agents" className="flex items-center gap-1.5 text-sm text-[var(--color-text2)] hover:text-[var(--color-text)] mb-4">
          <ArrowLeft className="w-4 h-4" /> 返回
        </Link>

        <div className="card p-6 space-y-5">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{icon}</span>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="智能体名称"
              className="flex-1 text-xl font-bold bg-transparent border-none outline-none text-[var(--color-text)] placeholder:text-[var(--color-text2)]" />
          </div>

          {/* Icon picker */}
          <div>
            <label className="text-xs font-medium text-[var(--color-text2)] mb-1.5 block">图标</label>
            <div className="flex gap-1 flex-wrap">
              {icons.map((i) => (
                <button key={i} onClick={() => setIcon(i)}
                  className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center transition-all ${icon === i ? 'ring-2 ring-[var(--color-accent)] bg-[var(--color-accent-bg)]' : 'hover:bg-[var(--color-surface2)]'}`}>{i}</button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-[var(--color-text2)] mb-1 block">分类</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-sm outline-none focus:border-[var(--color-accent)]">
                {CATEGORIES.map((c) => (<option key={c.id} value={c.id}>{c.icon} {c.name}</option>))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--color-text2)] mb-1 block">模式</label>
              <select className="w-full px-3 py-2 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-sm outline-none">
                <option>顺序执行</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[var(--color-text2)] mb-1 block">描述</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="这个智能体做什么…" rows={2}
              className="w-full px-3 py-2 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-sm outline-none focus:border-[var(--color-accent)] resize-none" />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--color-text2)] mb-1 block">目标</label>
            <input type="text" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="智能体要达成的最终目标…"
              className="w-full px-3 py-2 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-sm outline-none focus:border-[var(--color-accent)]" />
          </div>

          {/* Skill chain */}
          <div>
            <label className="text-xs font-medium text-[var(--color-text2)] mb-2 block">技能链 ({skillChain.length})</label>
            {!skillChain.length ? (
              <div className="text-center py-6 rounded-xl border-2 border-dashed border-[var(--color-border)] text-sm text-[var(--color-text2)]">
                从右侧面板添加技能步骤
              </div>
            ) : (
              <div className="space-y-1.5">
                {skillChain.map((slug, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)]">
                    <span className="text-xs font-mono font-bold text-[var(--color-accent)] w-5">{i + 1}.</span>
                    <span className="flex-1 text-sm">{slug}</span>
                    <button onClick={() => setSkillChain(skillChain.filter((_, j) => j !== i))}
                      className="text-[var(--color-text2)] hover:text-red-400"><X className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <button onClick={save} className="btn btn-primary mt-4"><Save className="w-4 h-4" /> 保存智能体</button>
      </div>

      {/* Skill Palette */}
      <div className="w-72 shrink-0">
        <div className="sticky top-0 card p-4 max-h-[calc(100vh-9rem)] flex flex-col">
          <h4 className="font-medium text-sm mb-3">技能面板</h4>
          <div className="relative mb-2">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text2)]" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜索技能…"
              className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs border outline-none bg-[var(--color-bg)] border-[var(--color-border)] focus:border-[var(--color-accent)]" />
          </div>
          <div className="flex gap-1 mb-2 flex-wrap">
            <button onClick={() => setSkillCat('')} className={`tag !text-[10px] cursor-pointer ${!skillCat ? '!bg-[var(--color-accent-bg)] !text-[var(--color-accent)]' : ''}`}>全部</button>
            {CATEGORIES.slice(0, 8).map((c) => (
              <button key={c.id} onClick={() => setSkillCat(c.id === skillCat ? '' : c.id)}
                className={`tag !text-[10px] cursor-pointer ${skillCat === c.id ? '!bg-[var(--color-accent-bg)] !text-[var(--color-accent)]' : ''}`}>{c.icon}</button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto space-y-0.5">
            {filtered.slice(0, 60).map((s) => (
              <button key={s.id} onClick={() => setSkillChain([...skillChain, s.slug])}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left text-xs hover:bg-[var(--color-bg)] transition-colors group">
                <Plus className="w-3 h-3 text-[var(--color-text2)] opacity-0 group-hover:opacity-100 flex-shrink-0" />
                <span className="flex-1 truncate">{s.name}</span>
                <span className="text-[10px] text-[var(--color-text2)] truncate max-w-16">{s.slug}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
