'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SkillCard } from '@/components/ui/SkillCard';
import { Pagination } from '@/components/ui/Pagination';
import { SkeletonCard, SkeletonList } from '@/components/ui/Skeleton';
import { useUIStore } from '@/stores/ui';
import { CATEGORIES } from '@/lib/categories';
import type { Skill } from '@/types';
import { Grid3X3, List } from 'lucide-react';

interface PaginationMeta { page: number; pageSize: number; total: number; totalPages: number; hasMore: boolean; }

function SkillsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewMode = useUIStore((s) => s.viewMode);
  const setViewMode = useUIStore((s) => s.setViewMode);

  const [skills, setSkills] = useState<Skill[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({ page: 1, pageSize: 20, total: 0, totalPages: 0, hasMore: false });
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'name');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPage = useCallback((p: number) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (activeCategory) params.set('category', activeCategory);
    if (searchTerm) params.set('q', searchTerm);
    params.set('sort', sort);
    params.set('page', String(p));
    params.set('pageSize', '20');

    fetch(`/api/skills?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setSkills(data.skills || []);
        setPagination(data.pagination || { page: 1, pageSize: 20, total: 0, totalPages: 0, hasMore: false });
      })
      .finally(() => setLoading(false));
  }, [activeCategory, sort, searchTerm]);

  useEffect(() => { fetchPage(1); }, [fetchPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPage(1);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">技能浏览</h1>
          <p className="text-sm text-[var(--color-text2)] mt-0.5">{pagination.total} 个技能</p>
        </div>
        <div className="flex items-center gap-2">
          <form onSubmit={handleSearch} className="flex items-center">
            <input
              type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索技能…"
              className="w-44 px-3 py-1.5 rounded-lg text-sm bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] outline-none focus:border-[var(--color-accent)] placeholder:text-[var(--color-text2)]"
            />
          </form>
          <select value={sort} onChange={(e) => { setSort(e.target.value); }}
            className="px-3 py-1.5 rounded-lg text-sm bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] outline-none focus:border-[var(--color-accent)]">
            <option value="name">按名称</option>
            <option value="category">按分类</option>
            <option value="recent">最近更新</option>
          </select>
          <div className="flex rounded-lg border border-[var(--color-border)] overflow-hidden">
            <button onClick={() => setViewMode('grid')}
              className={`px-2 py-1.5 text-xs ${viewMode === 'grid' ? 'bg-[var(--color-accent-bg)] text-[var(--color-accent)]' : 'text-[var(--color-text2)]'}`}>
              <Grid3X3 className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setViewMode('list')}
              className={`px-2 py-1.5 text-xs ${viewMode === 'list' ? 'bg-[var(--color-accent-bg)] text-[var(--color-accent)]' : 'text-[var(--color-text2)]'}`}>
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Category pills */}
      <div className="flex items-center gap-1.5 mb-6 flex-wrap">
        <button onClick={() => setActiveCategory('')}
          className={`tag !text-xs !px-3 !py-1 cursor-pointer transition-colors ${!activeCategory ? '!bg-[var(--color-accent-bg)] !text-[var(--color-accent)] !border-[var(--color-accent)]/20' : ''}`}>
          全部 ({pagination.total})
        </button>
        {CATEGORIES.map((cat) => (
          <button key={cat.id} onClick={() => setActiveCategory(cat.id === activeCategory ? '' : cat.id)}
            className={`tag !text-xs !px-3 !py-1 cursor-pointer transition-colors ${activeCategory === cat.id ? '!bg-[var(--color-accent-bg)] !text-[var(--color-accent)] !border-[var(--color-accent)]/20' : ''}`}>
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        viewMode === 'list' ? <SkeletonList /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (<SkeletonCard key={i} />))}
          </div>
        )
      ) : skills.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4 opacity-30">🔍</div>
          <p className="text-[var(--color-text2)] text-lg mb-1">没有找到匹配的技能</p>
          <p className="text-[var(--color-text2)] text-sm opacity-70">尝试其他分类或搜索词</p>
        </div>
      ) : viewMode === 'list' ? (
        <div className="space-y-1.5">
          {skills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {skills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      )}

      <Pagination page={pagination.page} totalPages={pagination.totalPages}
        onPageChange={(p) => { fetchPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
    </div>
  );
}

export default function SkillsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-zinc-400">加载中...</div>}>
      <SkillsContent />
    </Suspense>
  );
}
