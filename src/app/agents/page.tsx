'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bot, Plus } from 'lucide-react';
import { CATEGORIES } from '@/lib/categories';

interface AgentData { id: string; name: string; description: string; icon: string; category: string; goal: string; runCount: number; }

export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('/api/agents').then(r => r.json()).then(d => { setAgents(d.agents || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const cats = [...new Set(agents.map(a => a.category))];
  const filtered = filter === 'all' ? agents : agents.filter(a => a.category === filter);

  return (
    <div className="page" style={{ paddingTop: 32, paddingBottom: 64 }}>
      <div className="section-head">
        <div className="section-head-bar" />
        <h1 className="section-head-title">智能体编排</h1>
        <Link href="/agents/new" className="btn btn-red btn-sm" style={{ marginLeft: "auto" }}><Plus size={14} /> 新建</Link>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        <button onClick={() => setFilter('all')} className={`btn btn-sm ${filter === 'all' ? 'btn-red' : 'btn-line'}`}>全部</button>
        {cats.map(c => (
          <button key={c} onClick={() => setFilter(c)} className={`btn btn-sm ${filter === c ? 'btn-red' : 'btn-line'}`}>{c}</button>
        ))}
      </div>

      {loading ? (
        <div className="grid-3">{Array.from({length:3}).map((_,i)=><div key={i} style={{height:200,background:"var(--paper)",borderRadius:"var(--radius)"}}/>)}</div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ padding: 64, textAlign: "center" }}><Bot size={36} style={{color:"var(--text3)",marginBottom:12}} /><div className="body">还没有智能体编排</div></div>
      ) : (
        <div className="grid-3">
          {filtered.map(a => (
            <Link key={a.id} href={`/agents/${a.id}`} className="card card-padded">
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <span style={{ fontSize: 28 }}>{a.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{a.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text3)" }}>{CATEGORIES.find(c=>c.id===a.category)?.name || a.category}</div>
                </div>
              </div>
              <p className="body" style={{ fontSize: 13, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{a.description}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
