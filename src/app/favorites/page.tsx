'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SkillCard } from '@/components/ui/SkillCard';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { Star } from 'lucide-react';
import type { Skill } from '@/types';

export default function FavoritesPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/favorites')
      .then(r => r.json())
      .then(d => setSkills(d.favorites || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page" style={{ paddingTop: 32, paddingBottom: 64 }}>
      <div className="section-head">
        <div className="section-head-bar" />
        <h1 className="section-head-title">我的收藏</h1>
        <span className="tag tag-gold">{skills.length} 个</span>
      </div>

      {loading ? (
        <div className="grid-4">{Array.from({length:4}).map((_,i)=><SkeletonCard key={i}/>)}</div>
      ) : skills.length === 0 ? (
        <div className="card" style={{ padding: 64, textAlign: "center" }}>
          <Star size={36} style={{ color: "var(--text3)", marginBottom: 12 }} />
          <div className="body">还没有收藏智能体</div>
          <Link href="/skills" className="btn btn-red" style={{ marginTop: 16, display: "inline-flex" }}>去探索</Link>
        </div>
      ) : (
        <div className="grid-4">{skills.map(s => <SkillCard key={s.id} skill={s} />)}</div>
      )}
    </div>
  );
}
