'use client';

import { memo } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Copy } from 'lucide-react';
import { useFavoritesStore } from '@/stores/favorites';
import { CATEGORIES } from '@/lib/categories';
import { toast } from 'sonner';
import type { Skill } from '@/types';

interface SkillCardProps {
  skill: Skill & { tags?: string[] };
}

export const SkillCard = memo(function SkillCard({ skill }: SkillCardProps) {
  const router = useRouter();
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const fav = isFavorite(skill.id);
  const cat = CATEGORIES.find((c) => c.id === skill.category);
  const tags: string[] = typeof skill.tags === 'string' ? JSON.parse(skill.tags as string) : (skill.tags || []);
  const cmd = skill.slug.includes(':') ? `/${skill.slug.split(':')[1]}` : `/${skill.slug}`;

  const onCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(cmd);
    toast.success('已复制命令');
    fetch('/api/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skillId: skill.id, action: 'copy' }),
    }).catch(() => {});
  };

  const onFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(skill.id);
    toast.success(fav ? '已取消收藏' : '已添加收藏');
  };

  return (
    <div
      onClick={() => router.push(`/skills/${skill.slug}`)}
      className="card-interactive group relative overflow-hidden p-5 flex flex-col"
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl flex-shrink-0">{cat?.icon || '📦'}</span>
          <span className="text-[10px] font-medium text-[var(--color-text2)] bg-[var(--color-surface2)] px-2 py-0.5 rounded-full">
            {cat?.name || skill.category}
          </span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onCopy} className="p-1.5 rounded-md hover:bg-[var(--color-accent-bg)] text-[var(--color-accent)] transition-colors" title="复制命令">
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button onClick={onFav} className={`p-1.5 rounded-md transition-colors ${fav ? 'text-yellow-400' : 'text-[var(--color-text2)] hover:text-yellow-400'}`}>
            <Star className={`w-3.5 h-3.5 ${fav ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content */}
      <h3 className="font-semibold text-sm leading-snug mb-1.5 group-hover:text-[var(--color-accent)] transition-colors line-clamp-1">
        {skill.name}
      </h3>
      <p className="text-xs text-[var(--color-text2)] leading-relaxed line-clamp-2 flex-1 mb-3">
        {skill.description || '暂无描述'}
      </p>

      {/* Tags */}
      <div className="flex items-center gap-1 flex-wrap">
        {tags.slice(0, 3).map((tag: string) => (
          <span key={tag} className="tag">{tag}</span>
        ))}
        {tags.length > 3 && (
          <span className="text-[10px] text-[var(--color-text2)]">+{tags.length - 3}</span>
        )}
        {tags.length === 0 && (
          <span className="text-[10px] text-[var(--color-text2)] italic">无标签</span>
        )}
      </div>

      {/* Hover glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{ boxShadow: 'inset 0 1px 0 oklch(0.62 0.22 280 / 0.08)' }} />
    </div>
  );
});
