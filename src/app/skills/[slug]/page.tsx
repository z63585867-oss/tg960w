'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Star, Copy, Tag, Clock, ExternalLink } from 'lucide-react';
import { SkillCard } from '@/components/ui/SkillCard';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { useFavoritesStore } from '@/stores/favorites';
import { CATEGORIES } from '@/lib/categories';
import { formatDate } from '@/lib/utils';
import type { SkillWithMeta } from '@/types';
import { toast } from 'sonner';

export default function SkillDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [skill, setSkill] = useState<SkillWithMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const { toggleFavorite, isFavorite } = useFavoritesStore();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/skills/${slug}`)
      .then((r) => r.json())
      .then((d) => setSkill(d.skill))
      .finally(() => setLoading(false));
    fetch('/api/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'view' }),
    }).catch(() => {});
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="skeleton h-8 w-48 rounded-lg" />
        <div className="skeleton h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!skill) {
    return (
      <div className="text-center py-20">
        <p className="text-lg text-[var(--color-text2)] mb-3">技能未找到</p>
        <Link href="/skills" className="btn btn-primary">返回浏览</Link>
      </div>
    );
  }

  const fav = isFavorite(skill.id);
  const catDef = CATEGORIES.find((c) => c.id === skill.category);
  const tags: string[] = typeof skill.tags === 'string' ? JSON.parse(skill.tags as string) : (skill.tags || []);
  const cmd = skill.slug.includes(':') ? `/${skill.slug.split(':')[1]}` : `/${skill.slug}`;

  const copyCmd = () => {
    navigator.clipboard.writeText(cmd);
    toast.success('命令已复制');
    fetch('/api/history', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ skillId: skill.id, action: 'copy' }) }).catch(() => {});
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-[var(--color-text2)] hover:text-[var(--color-text)] mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> 返回
      </button>

      {/* Header card */}
      <div className="card p-6 sm:p-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ background: 'var(--color-surface2)' }}>
              {catDef?.icon || '📦'}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-1">{skill.name}</h1>
              <p className="text-sm text-[var(--color-text2)] leading-relaxed">{skill.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={copyCmd} className="btn btn-primary btn-sm">
              <Copy className="w-3.5 h-3.5" /> 复制命令
            </button>
            <button onClick={() => { toggleFavorite(skill.id); toast.success(fav ? '已取消收藏' : '已添加收藏'); }}
              className={`btn btn-sm ${fav ? '!text-yellow-400 !bg-yellow-400/10 !border-yellow-400/30' : 'btn-secondary'}`}>
              <Star className={`w-3.5 h-3.5 ${fav ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Meta line */}
        <div className="flex items-center gap-3 mb-4 flex-wrap text-xs text-[var(--color-text2)]">
          <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{catDef?.name || skill.category}</span>
          {skill.author && <span>👤 {skill.author}</span>}
          {skill.version && <span>v{skill.version}</span>}
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDate(skill.updatedAt)}</span>
        </div>

        {tags.length > 0 && (
          <div className="flex items-center gap-1.5 mb-5 flex-wrap">
            {tags.map((t) => (<span key={t} className="tag">{t}</span>))}
          </div>
        )}

        {/* Command box */}
        <div className="rounded-xl p-4 mb-1 flex items-center justify-between gap-4"
          style={{ background: 'var(--color-bg)', border: '1px dashed var(--color-border)' }}>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-[var(--color-text2)] mb-1">调用命令</div>
            <code className="text-sm font-mono font-medium" style={{ color: 'var(--color-accent)' }}>{cmd}</code>
          </div>
          <button onClick={copyCmd} className="btn btn-primary btn-sm flex-shrink-0">复制</button>
        </div>
      </div>

      {/* Full content */}
      <div className="card p-6 sm:p-8 mb-8">
        <div className="md-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{skill.fullContent || '暂无详细说明'}</ReactMarkdown>
        </div>
      </div>

      {/* Related */}
      {skill.relatedSkills && skill.relatedSkills.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">相关技能</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {skill.relatedSkills.map((r) => (<SkillCard key={r.id} skill={r as any} />))}
          </div>
        </div>
      )}
    </div>
  );
}
