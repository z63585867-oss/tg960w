import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' });

export const metadata: Metadata = {
  title: { default: 'TG960W — Claude Code 智能体工作台', template: '%s | TG960W' },
  description: '发现 445+ 安全审计过的 Claude Code AI 智能体，每日更新教程，从零到一掌握 AI 编程助手。',
  keywords: ['Claude Code', 'AI智能体', 'Agent Skills', 'AI编程助手', 'Anthropic Claude', '智能体教程'],
  authors: [{ name: 'TG960W' }],
  metadataBase: new URL('https://tg960w.com'),
  openGraph: {
    type: 'website',
    siteName: 'TG960W',
    title: 'TG960W — Claude Code 智能体工作台',
    description: '发现 445+ 安全审计过的 Claude Code AI 智能体，每日更新教程。',
    locale: 'zh_CN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TG960W — Claude Code 智能体工作台',
    description: '445+ AI 智能体，每日教程，提升 10 倍开发效率。',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrains.variable}`}>
        <AppShell>{children}</AppShell>
        <Toaster position="bottom-right" theme="dark" />
      </body>
    </html>
  );
}
