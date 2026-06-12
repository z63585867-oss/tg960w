import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: { default: 'TG960W · AI智能体精选平台', template: '%s | TG960W' },
  description: '中国最大的 Claude Code 智能体精选平台。1143+ 安全审计AI智能体，每日更新。找智能体、看评测、学用法，一站式解决。',
  keywords: ['AI智能体', 'Claude Code', 'Agent Skills', 'AI工具', '智能体评测', '人工智能'],
  metadataBase: new URL('https://tg960w.com'),
  openGraph: { type: 'website', siteName: 'TG960W', title: 'TG960W · AI智能体精选平台', description: '1143+ 安全审计AI智能体，每日更新', locale: 'zh_CN' },
  twitter: { card: 'summary_large_image', title: 'TG960W · AI智能体精选平台' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="dark" suppressHydrationWarning>
      <body className={inter.className}>
        <AppShell>{children}</AppShell>
        <Toaster position="bottom-center" theme="dark" />
      </body>
    </html>
  );
}
