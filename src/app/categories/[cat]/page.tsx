'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { SkillCard } from '@/components/ui/SkillCard';
import { Pagination } from '@/components/ui/Pagination';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { CATEGORIES } from '@/lib/categories';
import type { Skill } from '@/types';
import { ArrowLeft } from 'lucide-react';

interface PaginationMeta { page: number; pageSize: number; total: number; totalPages: number; }

export default function CategoryPage() {
  const params = useParams();
  const cat = params.cat as string;
  const [skills, setSkills] = useState<Skill[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({ page: 1, pageSize: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const catDef = CATEGORIES.find((c) => c.slug === cat);

  const fetchPage = (p: number) => {
    setLoading(true);
    fetch(`/api/skills?category=${cat}&page=${p}&pageSize=20`)
      .then((r) => r.json())
      .then((d) => { setSkills(d.skills || []); setPagination(d.pagination || { page: 1, pageSize: 20, total: 0, totalPages: 0 }); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPage(1); }, [cat]);

  return (
    <div className="max-w-6xl mx-auto">
      <Link href="/skills" className="flex items-center gap-1.5 text-sm text-[var(--color-text2)] hover:text-[var(--color-text)] mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> 返回全部技能
      </Link>

      <div className="flex items-center gap-4 mb-6">
        <span className="text-4xl">{catDef?.icon || '📦'}</span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{catDef?.name || cat}</h1>
          <p className="text-sm text-[var(--color-text2)]">{pagination.total} 个技能</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (<SkeletonCard key={i} />))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {skills.map((s) => (<SkillCard key={s.id} skill={s} />))}
        </div>
      )}

      <Pagination page={pagination.page} totalPages={pagination.totalPages}
        onPageChange={(p) => { fetchPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
    </div>
  );
}
