'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Play, Trash2, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface Workflow { id: string; name: string; description?: string; runCount: number; lastRunAt?: string; steps?: any[]; }

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = () => {
    fetch('/api/workflows').then(r => r.json()).then(d => { setWorkflows(d.workflows||[]); setLoading(false); }).catch(()=>setLoading(false));
  };
  useEffect(() => { fetchAll(); }, []);

  const handleDelete = async (id: string) => {
    await fetch(`/api/workflows/${id}`, { method: 'DELETE' });
    toast.success('已删除'); fetchAll();
  };

  return (
    <div className="page" style={{ paddingTop: 32, paddingBottom: 64 }}>
      <div className="section-head">
        <div className="section-head-bar" />
        <h1 className="section-head-title">工作流</h1>
        <Link href="/workflows/new" className="btn btn-red btn-sm" style={{ marginLeft: "auto" }}><Plus size={14} /> 新建</Link>
      </div>

      {loading ? (
        <div style={{ display:"flex",flexDirection:"column",gap:8}}>{Array.from({length:3}).map((_,i)=><div key={i} style={{height:80,background:"var(--paper)",borderRadius:"var(--radius)"}}/>)}</div>
      ) : workflows.length === 0 ? (
        <div className="card" style={{ padding: 64, textAlign: "center" }}><div style={{fontSize:36,marginBottom:12}}>🔧</div><div className="body">还没有工作流</div><Link href="/workflows/new" className="btn btn-red" style={{marginTop:16,display:"inline-flex"}}>创建第一个</Link></div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {workflows.map(w => (
            <div key={w.id} className="card" style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px" }}>
              <Link href={`/workflows/${w.id}`} style={{ flex: 1, textDecoration: "none", color: "inherit" }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{w.name}</div>
                <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>{w.steps?.length || 0} 步骤 · {w.runCount} 次运行</div>
              </Link>
              <button onClick={() => fetch(`/api/workflows/${w.id}/execute`,{method:'POST'}).then(()=>toast.success('已执行'))} className="btn btn-line btn-sm"><Play size={12} /></button>
              <button onClick={() => handleDelete(w.id)} className="btn btn-line btn-sm" style={{ color: "var(--red)" }}><Trash2 size={12} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
