'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { SkillCard } from '@/components/ui/SkillCard';
import { Pagination } from '@/components/ui/Pagination';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { CATEGORIES } from '@/lib/categories';
import type { Skill } from '@/types';

export default function CategoryPage() {
  const { cat } = useParams<{ cat: string }>();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const def = CATEGORIES.find(c => c.id === cat);

  const fetchPage = async (p = 1) => {
    setLoading(true);
    const r = await fetch(`/api/skills?category=${cat}&page=${p}&limit=24`);
    const d = await r.json();
    setSkills(d.skills || []);
    setPagination({ page: d.pagination.page, totalPages: d.pagination.totalPages });
    setLoading(false);
  };

  useEffect(() => { fetchPage(1); }, [cat]);

  return (
    <div className="page" style={{ paddingTop: 32, paddingBottom: 64 }}>
      <div className="section-head">
        <div className="section-head-bar" />
        <h1 className="section-head-title">{def?.name || cat}</h1>
        <span className="tag tag-gray">{pagination.page * 24}+ 个</span>
      </div>

      {loading ? (
        <div className="grid-4">{Array.from({length:8}).map((_,i)=><SkeletonCard key={i}/>)}</div>
      ) : skills.length === 0 ? (
        <div className="card" style={{ padding: 64, textAlign: "center" }}><div style={{fontSize:40,marginBottom:12}}>📭</div><div className="body">该分类下暂无智能体</div></div>
      ) : (
        <div className="grid-4">{skills.map(s => <SkillCard key={s.id} skill={s} />)}</div>
      )}

      <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={fetchPage} />
    </div>
  );
}
