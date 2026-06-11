'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, CornerDownLeft } from 'lucide-react';
import { useUIStore } from '@/stores/ui';
import { searchSkills } from '@/lib/search';
import { CATEGORIES } from '@/lib/categories';
import type { Skill } from '@/types';

export function QuickSearch() {
  const close = useUIStore((s) => s.closeQuickSearch);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Skill[]>([]);
  const [all, setAll] = useState<Skill[]>([]);
  const [idx, setIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/skills?pageSize=2000').then((r) => r.json()).then((d) => setAll(d.skills || [])).catch(() => {});
  }, []);

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => { setResults(query ? searchSkills(all, query) : []); setIdx(0); }, [query, all]);

  const select = (s: Skill) => { close(); router.push(`/skills/${s.slug}`); };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setIdx((i) => Math.min(i + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setIdx((i) => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter' && results[idx]) select(results[idx]);
    else if (e.key === 'Escape') close();
  };

  const catIcon = (id: string) => CATEGORIES.find((c) => c.id === id)?.icon || '📦';

  return (
    <div className="overlay-backdrop" onClick={close}>
      <div className="w-full max-w-lg rounded-xl overflow-hidden shadow-2xl border"
        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <Search className="w-4 h-4 text-[var(--color-text2)]" />
          <input ref={inputRef} type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={onKey}
            placeholder="搜索技能…" className="flex-1 py-3.5 bg-transparent border-none outline-none text-sm text-[var(--color-text)] placeholder:text-[var(--color-text2)]" />
          {query && <span className="text-xs text-[var(--color-text2)]">{results.length} 个结果</span>}
        </div>
        {results.length > 0 && (
          <div className="max-h-72 overflow-y-auto p-2">
            {results.slice(0, 16).map((s, i) => (
              <button key={s.id} onClick={() => select(s)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${i === idx ? 'bg-[var(--color-accent-bg)]' : 'hover:bg-[var(--color-surface2)]'}`}>
                <span>{catIcon(s.category)}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{s.name}</div>
                  <div className="text-xs text-[var(--color-text2)] truncate">{s.description}</div>
                </div>
                {i === idx && <ArrowRight className="w-4 h-4 text-[var(--color-accent)] flex-shrink-0" />}
              </button>
            ))}
          </div>
        )}
        {query && results.length === 0 && (
          <div className="px-4 py-12 text-center text-sm text-[var(--color-text2)]">未找到匹配的技能</div>
        )}
        <div className="px-4 py-2 border-t text-xs text-[var(--color-text2)] flex items-center gap-4"
          style={{ borderColor: 'var(--color-border)' }}>
          <span>↑↓ 导航</span><span><CornerDownLeft className="w-3 h-3 inline" /> 选择</span><span>Esc 关闭</span>
        </div>
      </div>
    </div>
  );
}
