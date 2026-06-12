'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SkillCard } from '@/components/ui/SkillCard';
import { Pagination } from '@/components/ui/Pagination';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { useUIStore } from '@/stores/ui';
import type { Skill } from '@/types';
import { Grid3X3, List } from 'lucide-react';

function SkillsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewMode = useUIStore((s) => s.viewMode);
  const setViewMode = useUIStore((s) => s.setViewMode);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const q = searchParams.get('q') || '';
  const cat = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'recent';

  const fetchSkills = useCallback(async (p = 1) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(p), limit: '24' });
    if (q) params.set('q', q);
    if (cat) params.set('category', cat);
    if (sort) params.set('sort', sort);
    try {
      const r = await fetch(`/api/skills?${params}`);
      const d = await r.json();
      setSkills(d.skills || []);
      setPagination({ page: d.pagination.page, totalPages: d.pagination.totalPages });
    } catch {}
    setLoading(false);
  }, [q, cat, sort]);

  useEffect(() => { fetchSkills(1); }, [fetchSkills]);

  return (
    <div className="page" style={{ paddingTop: 32, paddingBottom: 64 }}>
      <div className="section-head">
        <div className="section-head-bar" />
        <h1 className="section-head-title">全部智能体</h1>
        <span style={{ fontSize: 13, color: "var(--text3)" }}>{pagination.page * 24}+ 个</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          {[
            { k: "recent", l: "最新" },
            { k: "name", l: "名称" },
          ].map(s => (
            <button key={s.k} onClick={() => router.push(`/skills?sort=${s.k}`)}
              className={`btn btn-sm ${sort === s.k ? "btn-red" : "btn-line"}`}>{s.l}</button>
          ))}
          <button onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')} className="btn btn-line btn-sm">
            {viewMode === 'grid' ? <List size={14} /> : <Grid3X3 size={14} />}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid-4" style={{ gap: 14 }}>{Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : skills.length === 0 ? (
        <div className="card" style={{ padding: 64, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
          <div className="body">没有找到匹配的智能体</div>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? "grid-4" : ""} style={{ gap: viewMode === 'list' ? 8 : 14, display: viewMode === 'list' ? 'flex' : undefined, flexDirection: viewMode === 'list' ? 'column' : undefined }}>
          {skills.map(s => <SkillCard key={s.id} skill={s} />)}
        </div>
      )}

      <Pagination page={pagination.page} totalPages={pagination.totalPages}
        onPageChange={(p) => { fetchSkills(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
    </div>
  );
}

export default function SkillsPage() {
  return <Suspense fallback={<div className="page" style={{ paddingTop: 32 }}><div className="grid-4">{Array.from({length:8}).map((_,i)=><SkeletonCard key={i}/>)}</div></div>}><SkillsContent /></Suspense>;
}
