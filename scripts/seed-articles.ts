import { PrismaClient as PC } from "@/prisma-client/client";
import type { PrismaClient } from "@/prisma-client/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: "file:./prisma/skillos.db" });
const p = new (PC as any)({ adapter }) as PrismaClient;

async function seed() {
  const count = await p.article.count();
  if (count > 0) { console.log(`Already ${count} articles`); await p.$disconnect(); return; }

  const articles = [
    {
      slug: "getting-started-claude-code",
      title: "Claude Code 入门指南：从零到一搭建你的 AI 工作台",
      description: "手把手教你安装、配置 Claude Code，安装第一个智能体，10 分钟上手 AI 编程助手。",
      excerpt: "Claude Code 是 Anthropic 推出的 AI 编程助手。本指南带你完成安装、配置全流程。",
      category: "engineering",
      tags: JSON.stringify(["Claude Code", "入门", "教程"]),
      author: "TG960W 编辑部",
      content: `# Claude Code 入门指南

## 什么是 Claude Code？

Claude Code 是 Anthropic 推出的终端 AI 编程助手，可以直接在你的命令行中工作。

## 安装

\`\`\`bash
npm install -g @anthropic-ai/claude-code
\`\`\`

## 第一个智能体

安装完成后，试试这个安全审计智能体：

\`\`\`bash
claude "帮我用 skill-security-scan 扫描我的项目"
\`\`\`

## 核心功能

- **智能体市场**：1100+ 预置智能体，覆盖安全、开发、运维、营销
- **安全审计**：双引擎扫描，先审后用，确保安全
- **工作流编排**：组合多个智能体完成复杂任务

## 最佳实践

1. 先用安全扫描器审查智能体
2. 从小任务开始，逐步复杂
3. 善用收藏和工作流功能

> 每天访问 TG960W 查看最新智能体和教程。`,
      relatedSkills: JSON.stringify(["skill-shielder", "secure-claude-code"]),
      isPublished: true,
      publishedAt: new Date(Date.now() - 86400000 * 2),
    },
    {
      slug: "top-10-security-skills",
      title: "2026 年最值得安装的 10 个安全审计智能体",
      description: "精选 10 个通过双引擎安全审计的智能体，涵盖代码审查、漏洞扫描、渗透测试。",
      excerpt: "从 1100+ 智能体中精选 10 个安全审计神器，每个都经过双引擎验证。",
      category: "security",
      tags: JSON.stringify(["安全审计", "Top10", "推荐"]),
      author: "TG960W 编辑部",
      content: `# 2026 年最值得安装的 10 个安全审计智能体

我们测试了 1100+ 个智能体，精选以下推荐：

## 1. skill-shielder
零依赖 Bash 脚本扫描器，快速检测恶意代码模式。

## 2. secure-claude-code
Docker 隔离 + 四层防御体系。

## 3. threat-detection
实时威胁检测，覆盖 CVE、恶意软件。

## 4. skill-security-scan
Python 命令行工具，轻量快扫。

## 5. claude-skill-antivirus
九引擎深度审计。

> 完整列表请访问 TG960W 智能体目录。`,
      relatedSkills: JSON.stringify(["skill-shielder", "secure-claude-code", "threat-detection"]),
      isPublished: true,
      publishedAt: new Date(Date.now() - 86400000),
    },
    {
      slug: "build-ai-workflow",
      title: "如何用工作流编排打造全自动 AI 生产线",
      description: "组合多个智能体，搭建从需求分析到代码部署的全自动 AI 工作流。",
      excerpt: "单个智能体只能做一件事。把它们串起来，你就有了一条 AI 生产线。",
      category: "engineering",
      tags: JSON.stringify(["工作流", "自动化", "效率"]),
      author: "TG960W 编辑部",
      content: `# 如何用工作流编排打造全自动 AI 生产线

## 为什么需要工作流？

单个智能体擅长一件事。但真实项目需要多步骤协作。

## 示例：代码上线流水线

1. **code-reviewer** — 审查代码质量
2. **senior-qa** — 生成测试用例
3. **ci-cd-pipeline-builder** — 一键部署

## 创建你的第一个工作流

访问 TG960W 的「工作流」页面，拖拽组合智能体，一键执行。

> 从简单的 2-3 步开始，逐步增加复杂度。`,
      relatedSkills: JSON.stringify(["code-reviewer", "senior-qa"]),
      isPublished: true,
      publishedAt: new Date(),
    },
  ];

  for (const a of articles) await p.article.create({ data: a });
  console.log(`Seeded ${articles.length} articles`);
  await p.$disconnect();
}

seed().catch((e) => { console.error(e); process.exit(1); });
