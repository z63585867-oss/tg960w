'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, Eye, Copy, Play } from 'lucide-react';

interface Entry { id: string; skillSlug: string; skillName: string; category: string; action: string; createdAt: string; }

export default function HistoryPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/history?limit=50').then(r => r.json()).then(d => { setEntries(d.entries||[]); setLoading(false); }).catch(()=>setLoading(false));
  }, []);

  const iconMap: Record<string, any> = { view: Eye, copy: Copy, invoke: Play };

  return (
    <div className="page" style={{ paddingTop: 32, paddingBottom: 64, maxWidth: 700 }}>
      <div className="section-head">
        <div className="section-head-bar" />
        <h1 className="section-head-title">使用记录</h1>
        <span className="tag tag-gray">{entries.length} 条</span>
      </div>

      {loading ? (
        <div style={{ display:"flex",flexDirection:"column",gap:8}}>{Array.from({length:5}).map((_,i)=><div key={i} style={{height:52,background:"var(--paper)",borderRadius:"var(--radius)"}}/>)}</div>
      ) : entries.length === 0 ? (
        <div className="card" style={{ padding: 64, textAlign: "center" }}><Clock size={36} style={{color:"var(--text3)",marginBottom:12}} /><div className="body">还没有使用记录</div></div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {entries.map(e => {
            const Icon = iconMap[e.action] || Eye;
            return (
              <Link key={e.id} href={`/skills/${e.skillSlug}`} className="card" style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 18px", textDecoration:"none", color:"inherit" }}>
                <Icon size={15} style={{ color: e.action==='invoke'?"var(--red)":"var(--text3)" }} />
                <span style={{ fontWeight:600, fontSize:14, flex:1 }}>{e.skillName}</span>
                <span className="tag tag-gray">{e.category}</span>
                <span style={{ fontSize:12, color:"var(--text3)" }}>{new Date(e.createdAt).toLocaleDateString('zh-CN')}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
