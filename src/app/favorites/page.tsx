'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SkillCard } from '@/components/ui/SkillCard';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { Star, ArrowLeft } from 'lucide-react';
import type { Skill } from '@/types';

export default function FavoritesPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/favorites')
      .then((r) => r.json())
      .then((d) => setSkills((d.favorites || []).map((f: any) => ({ ...f, tags: typeof f.tags === 'string' ? JSON.parse(f.tags) : (f.tags || []) }))))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <Link href="/" className="flex items-center gap-1.5 text-sm text-[var(--color-text2)] hover:text-[var(--color-text)] mb-6">
        <ArrowLeft className="w-4 h-4" /> 返回
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
        <div>
          <h1 className="text-2xl font-bold">我的收藏</h1>
          <p className="text-sm text-[var(--color-text2)]">{skills.length} 个已收藏</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (<SkeletonCard key={i} />))}
        </div>
      ) : skills.length === 0 ? (
        <div className="text-center py-20 card">
          <Star className="w-16 h-16 mx-auto mb-4 opacity-10" />
          <p className="text-[var(--color-text2)] text-lg mb-1">暂无收藏</p>
          <p className="text-[var(--color-text2)] text-sm opacity-70 mb-4">收藏一些常用技能，快速访问</p>
          <Link href="/skills" className="btn btn-primary">去浏览技能</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {skills.map((s) => (<SkillCard key={s.id} skill={s} />))}
        </div>
      )}
    </div>
  );
}
