'use client';
import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/stores/ui';

export function QuickSearch() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const close = useUIStore(s => s.closeQuickSearch);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    if (!q.trim()) { setResults([]); return; }
    const t = setTimeout(() => {
      fetch(`/api/skills?q=${encodeURIComponent(q)}&limit=6`)
        .then(r => r.json()).then(d => setResults(d.skills || [])).catch(() => {});
    }, 200);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div className="overlay-backdrop" onClick={close}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 480, maxHeight: "70vh", overflow: "auto", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 12, marginTop: "15vh", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", borderBottom: "1px solid var(--line)" }}>
          <Search size={16} style={{ color: "var(--text3)" }} />
          <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)} placeholder="搜索智能体…" style={{ flex: 1, border: "none", background: "none", outline: "none", fontSize: 15, color: "var(--text)" }} />
          <kbd style={{ padding: "2px 6px", borderRadius: 4, background: "var(--ink)", border: "1px solid var(--line)", fontSize: 11, fontFamily: "monospace", color: "var(--text3)" }}>Esc</kbd>
        </div>
        {results.length > 0 ? (
          <div style={{ padding: 8 }}>
            {results.map((s: any) => (
              <button key={s.id} onClick={() => { close(); router.push(`/skills/${s.slug}`); }}
                style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", border: "none", background: "none", cursor: "pointer", borderRadius: 8, textAlign: "left", color: "var(--text)" }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--ink)"}
                onMouseLeave={e => e.currentTarget.style.background = "none"}>
                <span style={{ fontWeight: 600 }}>{s.name}</span>
                <span style={{ fontSize: 12, color: "var(--text3)", marginLeft: "auto" }}>{s.category}</span>
              </button>
            ))}
          </div>
        ) : q && (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text3)", fontSize: 14 }}>没有找到匹配的智能体</div>
        )}
      </div>
    </div>
  );
}
