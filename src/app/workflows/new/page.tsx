'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, X, Save } from 'lucide-react';
import type { Skill } from '@/types';
import { toast } from 'sonner';

export default function NewWorkflowPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [steps, setSteps] = useState<string[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => { fetch('/api/skills?limit=200').then(r=>r.json()).then(d=>setSkills(d.skills||[])).catch(()=>{}); }, []);

  const filtered = skills.filter(s => !steps.includes(s.slug) && s.name.toLowerCase().includes(search.toLowerCase()));

  const handleSave = async () => {
    if (!name.trim()) return toast.error('请输入名称');
    const r = await fetch('/api/workflows', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name, description: desc, steps: steps.map((s,i)=>({ skillId: s, orderIndex: i })) }) });
    if (r.ok) { toast.success('创建成功'); router.push('/workflows'); } else { toast.error('创建失败'); }
  };

  return (
    <div className="page" style={{ paddingTop: 32, paddingBottom: 64, maxWidth: 700 }}>
      <Link href="/workflows" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--text3)", textDecoration: "none", fontSize: 13, marginBottom: 24 }}>
        <ArrowLeft size={14} /> 返回
      </Link>

      <div className="section-head"><div className="section-head-bar" /><h1 className="section-head-title">新建工作流</h1></div>

      <div className="card card-padded" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="工作流名称" style={{ padding:"10px 14px", borderRadius:8, border:"1px solid var(--line)", background:"var(--ink)", color:"var(--text)", fontSize:15, outline:"none" }} />
          <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="描述（可选）" rows={2} style={{ padding:"10px 14px", borderRadius:8, border:"1px solid var(--line)", background:"var(--ink)", color:"var(--text)", fontSize:14, outline:"none", resize:"vertical" }} />
        </div>
      </div>

      <div className="card card-padded" style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 700, marginBottom: 12 }}>步骤 ({steps.length})</div>
        {steps.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
            {steps.map((s, i) => (
              <span key={s} className="tag tag-red" style={{ cursor: "pointer" }} onClick={() => setSteps(steps.filter(x => x !== s))}>
                {i+1}. {s} <X size={10} />
              </span>
            ))}
          </div>
        )}
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索智能体添加…" style={{ width:"100%", padding:"8px 14px", borderRadius:8, border:"1px solid var(--line)", background:"var(--ink)", color:"var(--text)", fontSize:13, outline:"none", marginBottom:8 }} />
        <div style={{ maxHeight: 200, overflow: "auto" }}>
          {filtered.slice(0, 20).map(s => (
            <button key={s.id} onClick={() => setSteps([...steps, s.slug])}
              style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 10px", border: "none", background: "none", cursor: "pointer", borderRadius: 6, textAlign: "left", color: "var(--text)", fontSize: 13 }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--ink)"}
              onMouseLeave={e => e.currentTarget.style.background = "none"}>
              <Plus size={12} style={{ color: "var(--text3)" }} /> {s.name}
            </button>
          ))}
        </div>
      </div>

      <button onClick={handleSave} className="btn btn-red" style={{ width: "100%", justifyContent: "center", padding: "12px" }}>
        <Save size={16} /> 保存
      </button>
    </div>
  );
}
