'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, X, Save, GripVertical, Loader2 } from 'lucide-react';
import type { Skill } from '@/types';
import { CATEGORIES } from '@/lib/categories';
import { toast } from 'sonner';

interface Step {
  skillSlug: string;
  label: string;
  skillName: string;
}

export default function EditWorkflowPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState<Step[]>([]);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/skills?limit=2000').then((r) => r.json()),
      fetch(`/api/workflows/${id}`).then((r) => r.json()),
    ]).then(([skillsData, wfData]) => {
      setAllSkills(skillsData.skills || []);
      if (wfData.workflow) {
        setName(wfData.workflow.name);
        setDescription(wfData.workflow.description || '');
        setSteps(wfData.workflow.steps.map((s: any) => ({
          skillSlug: s.skill.slug,
          skillName: s.skill.name,
          label: s.label || '',
        })));
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const filtered = allSkills.filter((s) => {
    if (selectedCat && s.category !== selectedCat) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.slug.toLowerCase().includes(q);
    }
    return true;
  });

  const addStep = (skill: Skill) => {
    setSteps([...steps, { skillSlug: skill.slug, label: '', skillName: skill.name }]);
  };

  const removeStep = (idx: number) => {
    setSteps(steps.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    const res = await fetch(`/api/workflows/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, steps }),
    });
    if (res.ok) {
      toast.success('已更新');
      router.push('/workflows');
    } else {
      toast.error('更新失败');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  return (
    <div className="flex gap-6 max-w-7xl mx-auto h-[calc(100vh-8rem)]">
      <div className="flex-1 overflow-auto">
        <Link href="/workflows" className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] mb-4">
          <ArrowLeft className="w-4 h-4" /> 返回
        </Link>
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full text-xl font-bold bg-transparent border-none outline-none text-[var(--text)] mb-2" />
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full text-sm bg-transparent border-none outline-none text-[var(--text-muted)] mb-6" />
          <div>
            <h3 className="text-sm font-medium text-[var(--text-muted)] mb-3">技能步骤 ({steps.length})</h3>
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg)] border border-[var(--border)] mb-2">
                <GripVertical className="w-4 h-4 text-[var(--text-muted)]" />
                <span className="text-xs font-mono text-[var(--accent)] w-8">{idx + 1}.</span>
                <div className="flex-1"><div className="text-sm">{step.skillName}</div></div>
                <button onClick={() => removeStep(idx)} className="text-[var(--text-muted)] hover:text-red-400"><X className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>
        <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 mt-4 rounded-lg bg-[var(--accent)] text-white font-medium hover:bg-[var(--accent-hover)]">
          <Save className="w-4 h-4" /> 保存修改
        </button>
      </div>

      <div className="w-80 shrink-0">
        <div className="sticky top-0 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 max-h-[calc(100vh-10rem)] flex flex-col">
          <h3 className="font-medium text-sm mb-3">技能面板</h3>
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="搜索技能..." className="w-full px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-sm outline-none focus:border-[var(--accent)] mb-2" />
          <div className="flex gap-1.5 mb-3 flex-wrap">
            <button onClick={() => setSelectedCat('')} className={`px-2 py-0.5 rounded text-xs ${!selectedCat ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg)] text-[var(--text-muted)]'}`}>全部</button>
            {CATEGORIES.map((cat) => (
              <button key={cat.id} onClick={() => setSelectedCat(cat.id)} className={`px-2 py-0.5 rounded text-xs ${selectedCat === cat.id ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg)] text-[var(--text-muted)]'}`}>{cat.icon} {cat.name}</button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto space-y-1">
            {filtered.slice(0, 100).map((skill) => (
              <button key={skill.id} onClick={() => addStep(skill)} className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left text-sm hover:bg-[var(--bg)] group">
                <Plus className="w-3 h-3 text-[var(--text-muted)] opacity-0 group-hover:opacity-100" />
                <span className="flex-1 truncate">{skill.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
