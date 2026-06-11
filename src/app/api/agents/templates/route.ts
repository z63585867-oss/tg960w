import prisma from '@/lib/db';

// Pre-built agent templates
const TEMPLATES = [
  {
    name: '🛡️ 安全审计官',
    description: '自动扫描代码库安全漏洞，生成修复方案，验证修复效果。适用于上线前安全审查。',
    icon: '🛡️',
    category: 'security',
    goal: '全面审计代码安全，发现并修复漏洞',
    skillChain: ['senior-security', 'code-reviewer', 'security-review', 'focused-fix', 'verify'],
  },
  {
    name: '🚀 全栈发布官',
    description: '从 PRD 到生产部署的全流程自动化——需求分析 → 架构设计 → 编码 → 测试 → 部署。',
    icon: '🚀',
    category: 'engineering',
    goal: '端到端完成一个功能的开发、测试和部署',
    skillChain: ['senior-fullstack', 'api-design-reviewer', 'database-designer', 'test-driven-development', 'ci-cd-pipeline-builder', 'verify'],
  },
  {
    name: '📝 内容创作官',
    description: '研究话题 → 撰写爆款文章 → SEO 优化 → 多渠道分发。内容营销一站式。',
    icon: '📝',
    category: 'marketing',
    goal: '从0到1完成一篇高质量内容的创作、优化和分发',
    skillChain: ['research', 'content-creator', 'seo-audit', 'copy-editing', 'social-content'],
  },
  {
    name: '💼 商业尽调官',
    description: '竞品分析 → 市场调研 → 财务评估 → 战略报告。投资和合作决策的智能助手。',
    icon: '💼',
    category: 'business',
    goal: '完成目标公司的全方位商业尽调并生成报告',
    skillChain: ['competitive-intel', 'competitive-teardown', 'research', 'financial-analyst', 'report'],
  },
  {
    name: '🔧 应急响应官',
    description: '事件检测 → 根因分析 → 紧急修复 → 事后复盘。7×24 自动化运维防线。',
    icon: '🔧',
    category: 'devops',
    goal: '快速响应生产事故，定位根因，执行修复，输出复盘报告',
    skillChain: ['incident-response', 'incident-commander', 'systematic-debugging', 'focused-fix', 'post-mortem'],
  },
  {
    name: '🎨 设计系统官',
    description: 'UI 设计审计 → 组件库搭建 → 无障碍检查 → 前端代码生成。设计到代码零损耗。',
    icon: '🎨',
    category: 'design',
    goal: '从设计规范到可用的前端组件库',
    skillChain: ['ui-design-system', 'a11y-audit', 'senior-frontend', 'code-reviewer'],
  },
  {
    name: '📊 数据分析官',
    description: '数据质量检查 → 统计分析 → 可视化 → 洞察报告。让数据说话。',
    icon: '📊',
    category: 'data',
    goal: '对目标数据完成全面分析并输出可执行的洞察报告',
    skillChain: ['data-quality-auditor', 'sql-database-assistant', 'statistical-analyst', 'report'],
  },
  {
    name: '🧪 质量保证官',
    description: '自动化测试 → 性能压测 → 安全测试 → 质量报告。零缺陷上线。',
    icon: '🧪',
    category: 'qa-testing',
    goal: '全面测试代码质量，确保达到上线标准',
    skillChain: ['senior-qa', 'tdd-guide', 'testrail', 'stress-test', 'skill-tester', 'report'],
  },
  {
    name: '🦜 飞书运营官',
    description: '会议纪要 → 任务分配 → 审批流转 → 日程同步。飞书办公全自动化。',
    icon: '🦜',
    category: 'lark',
    goal: '自动化处理飞书办公场景的文档、会议、审批和日程',
    skillChain: ['lark-minutes', 'lark-task', 'lark-approval', 'lark-calendar', 'lark-doc'],
  },
  {
    name: '🤖 AI 开发官',
    description: 'Agent 设计 → Prompt 优化 → RAG 搭建 → MCP 开发 → 评估测试。AI 应用全栈研发。',
    icon: '🤖',
    category: 'ai-ml',
    goal: '从零搭建一个完整的 AI 应用系统',
    skillChain: ['agent-designer', 'prompt-engineer-toolkit', 'rag-architect', 'mcp-server-builder', 'agent-eval'],
  },
  {
    name: '💰 定价策略官',
    description: '竞品价格分析 → 成本核算 → 定价模型设计 → 收入预测。科学定价决策。',
    icon: '💰',
    category: 'finance-legal',
    goal: '制定最优定价策略并预测收入影响',
    skillChain: ['competitive-intel', 'pricing-strategist', 'financial-analyst', 'deal-desk', 'report'],
  },
  {
    name: '✍️ 品牌建设官',
    description: '品牌定位 → 视觉规范 → 社媒矩阵 → 内容日历。从 0 到 1 打造品牌。',
    icon: '✍️',
    category: 'marketing',
    goal: '完整搭建品牌体系并制定内容策略',
    skillChain: ['brand-guidelines', 'copywriting', 'social-media-manager', 'content-strategy', 'social-calendar-skill'],
  },
];

export async function GET() {
  try {
    // Upsert templates into database
    const results = [];
    for (const t of TEMPLATES) {
      const existing = await prisma.agent.findFirst({
        where: { name: t.name, isTemplate: true },
      });
      if (!existing) {
        const agent = await prisma.agent.create({
          data: {
            ...t,
            skillChain: JSON.stringify(t.skillChain),
            config: JSON.stringify({ mode: 'sequential', autoRetry: true }),
            isTemplate: true,
            isPublic: true,
          },
        });
        results.push(agent);
      } else {
        results.push(existing);
      }
    }
    return Response.json({ templates: results, count: results.length });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
