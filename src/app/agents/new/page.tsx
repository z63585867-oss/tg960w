'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, X, Save, Search } from 'lucide-react';
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
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetch('/api/skills?limit=200').then(r=>r.json()).then(d=>setAllSkills(d.skills||[])).catch(()=>{}); }, []);

  const filtered = allSkills.filter(s => !skillChain.includes(s.slug) && s.name.toLowerCase().includes(search.toLowerCase()));

  const handleSave = async () => {
    if (!name.trim()) return toast.error('请输入名称');
    setSaving(true);
    const r = await fetch('/api/agents', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name, description, icon, category, goal, skillChain:JSON.stringify(skillChain), config:'{}' }) });
    setSaving(false);
    if (r.ok) { toast.success('创建成功'); router.push('/agents'); } else { toast.error('创建失败'); }
  };

  return (
    <div className="page" style={{ paddingTop: 32, paddingBottom: 64, maxWidth: 700 }}>
      <Link href="/agents" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--text3)", textDecoration: "none", fontSize: 13, marginBottom: 24 }}>
        <ArrowLeft size={14} /> 返回
      </Link>

      <div className="section-head"><div className="section-head-bar" /><h1 className="section-head-title">新建智能体编排</h1></div>

      <div className="card card-padded" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ fontSize: 40 }}>{icon}</span>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="名称" style={{ flex:1, padding:"10px 14px", borderRadius:8, border:"1px solid var(--line)", background:"var(--ink)", color:"var(--text)", fontSize:15, outline:"none" }} />
          </div>
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="描述" rows={3} style={{ padding:"10px 14px", borderRadius:8, border:"1px solid var(--line)", background:"var(--ink)", color:"var(--text)", fontSize:14, outline:"none", resize:"vertical" }} />
          <textarea value={goal} onChange={e => setGoal(e.target.value)} placeholder="目标" rows={2} style={{ padding:"10px 14px", borderRadius:8, border:"1px solid var(--line)", background:"var(--ink)", color:"var(--text)", fontSize:14, outline:"none", resize:"vertical" }} />
        </div>
      </div>

      <div className="card card-padded" style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 700, marginBottom: 12 }}>技能链 ({skillChain.length})</div>
        {skillChain.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
            {skillChain.map(s => (
              <span key={s} className="tag tag-red" style={{ cursor: "pointer" }} onClick={() => setSkillChain(skillChain.filter(x => x !== s))}>
                {s} <X size={10} />
              </span>
            ))}
          </div>
        )}
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search size={14} style={{ position: "absolute", left: 12, top: 10, color: "var(--text3)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索智能体添加…" style={{ width:"100%", padding:"8px 12px 8px 32px", borderRadius:8, border:"1px solid var(--line)", background:"var(--ink)", color:"var(--text)", fontSize:13, outline:"none" }} />
          </div>
        </div>
        <div style={{ maxHeight: 200, overflow: "auto" }}>
          {filtered.slice(0, 20).map(s => (
            <button key={s.id} onClick={() => setSkillChain([...skillChain, s.slug])}
              style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 10px", border: "none", background: "none", cursor: "pointer", borderRadius: 6, textAlign: "left", color: "var(--text)", fontSize: 13 }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--ink)"}
              onMouseLeave={e => e.currentTarget.style.background = "none"}>
              <Plus size={12} style={{ color: "var(--text3)" }} /> {s.name}
            </button>
          ))}
        </div>
      </div>

      <button onClick={handleSave} disabled={saving} className="btn btn-red" style={{ width: "100%", justifyContent: "center", padding: "12px" }}>
        <Save size={16} /> {saving ? "保存中…" : "保存"}
      </button>
    </div>
  );
}
