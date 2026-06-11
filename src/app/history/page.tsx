'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, ArrowLeft, Eye, Copy, Zap, Workflow } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { CATEGORIES } from '@/lib/categories';
import type { UsageEntry } from '@/types';

const ICONS: Record<string, React.FC<{ className?: string }>> = { view: Eye, copy: Copy, invoke: Zap, workflow: Workflow };
const LABELS: Record<string, string> = { view: '查看', copy: '复制命令', invoke: '调用', workflow: '工作流' };

export default function HistoryPage() {
  const [entries, setEntries] = useState<UsageEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/history?limit=200')
      .then((r) => r.json())
      .then((d) => setEntries(d.entries || []))
      .finally(() => setLoading(false));
  }, []);

  const grouped: Record<string, UsageEntry[]> = {};
  entries.forEach((e) => {
    const d = new Date(e.createdAt).toLocaleDateString('zh-CN');
    if (!grouped[d]) grouped[d] = [];
    grouped[d].push(e);
  });

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/" className="flex items-center gap-1.5 text-sm text-[var(--color-text2)] hover:text-[var(--color-text)] mb-6">
        <ArrowLeft className="w-4 h-4" /> 返回
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-6 h-6 text-[var(--color-accent)]" />
        <h1 className="text-2xl font-bold">使用历史</h1>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (<div key={i} className="skeleton h-12 w-full rounded-lg" />))}
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-20 card">
          <Clock className="w-16 h-16 mx-auto mb-4 opacity-10" />
          <p className="text-[var(--color-text2)] text-lg">暂无使用记录</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, items]) => (
            <div key={date}>
              <div className="text-xs font-semibold text-[var(--color-text2)] mb-2 px-1">{date}</div>
              <div className="space-y-1">
                {items.map((e) => {
                  const Icon = ICONS[e.action] || Eye;
                  const catIcon = CATEGORIES.find((c) => c.id === (e as any).category)?.icon;
                  return (
                    <Link key={e.id} href={`/skills/${e.skillSlug}`}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg card hover:border-[var(--color-accent)] transition-colors group">
                      <Icon className="w-4 h-4 text-[var(--color-text2)] flex-shrink-0" />
                      <span className="text-xs text-[var(--color-text2)] flex-shrink-0">{catIcon}</span>
                      <span className="flex-1 text-sm font-medium truncate group-hover:text-[var(--color-accent)] transition-colors">{e.skillName}</span>
                      <span className="tag flex-shrink-0">{LABELS[e.action] || e.action}</span>
                      <span className="text-[10px] text-[var(--color-text2)] flex-shrink-0 w-16 text-right">{formatDate(e.createdAt)}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
