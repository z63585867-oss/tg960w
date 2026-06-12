'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Play, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface AgentData { id: string; name: string; description: string; icon: string; category: string; goal: string; skillChain: string; runCount: number; lastRunAt?: string; }
interface RunData { id: string; status: string; startedAt?: string; completedAt?: string; error?: string; }

export default function AgentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [agent, setAgent] = useState<AgentData | null>(null);
  const [runs, setRuns] = useState<RunData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/agents/${id}`).then(r => r.json()).then(d => { setAgent(d); setRuns(d.runs||[]); setLoading(false); }).catch(()=>setLoading(false));
  }, [id]);

  const handleExecute = async () => {
    toast.success('执行已触发');
    const r = await fetch(`/api/agents/${id}/execute`, { method: 'POST' });
    const d = await r.json();
    setRuns([d, ...runs]);
  };

  if (loading) return <div className="page" style={{ paddingTop: 32 }}><div style={{height:300,background:"var(--paper)",borderRadius:"var(--radius)"}} /></div>;
  if (!agent) return <div className="page" style={{ paddingTop: 32, textAlign:"center",padding:80 }}><div className="body">未找到</div></div>;

  const skills = JSON.parse(agent.skillChain || '[]');

  return (
    <div className="page" style={{ paddingTop: 32, paddingBottom: 80, maxWidth: 700 }}>
      <Link href="/agents" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--text3)", textDecoration: "none", fontSize: 13, marginBottom: 24 }}>
        <ArrowLeft size={14} /> 返回
      </Link>

      <div className="card card-padded" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <span style={{ fontSize: 40 }}>{agent.icon}</span>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>{agent.name}</h1>
            <div className="small" style={{ marginTop: 2 }}>{agent.category} · {agent.runCount} 次运行</div>
          </div>
          <button onClick={handleExecute} className="btn btn-red btn-sm" style={{ marginLeft: "auto" }}><Play size={14} /> 执行</button>
        </div>
        <p className="body">{agent.description}</p>
        <div className="body" style={{ marginTop: 8, fontWeight: 600 }}>目标: {agent.goal}</div>
      </div>

      <div className="card card-padded" style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 700, marginBottom: 12 }}>技能链 ({skills.length})</div>
        {skills.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {skills.map((s: string, i: number) => (
              <Link key={s} href={`/skills/${s}`} className="card" style={{ padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: "inherit" }}>
                <span style={{ width: 24, height: 24, borderRadius: 12, background: "var(--red)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{i+1}</span>
                {s}
              </Link>
            ))}
          </div>
        ) : <div className="small">暂无</div>}
      </div>

      {runs.length > 0 && (
        <div className="card card-padded">
          <div style={{ fontWeight: 700, marginBottom: 12 }}>运行记录</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {runs.map(r => (
              <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid var(--line)" }}>
                <Clock size={13} style={{ color: "var(--text3)" }} />
                <span className="tag tag-gray">{r.status}</span>
                <span className="small">{r.startedAt ? new Date(r.startedAt).toLocaleString('zh-CN') : '-'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
