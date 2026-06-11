import { PrismaClient } from '../src/prisma-client/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';

const dbUrl = process.env.DATABASE_URL || 'file:./prisma/skillos.db';
const adapter = new PrismaLibSql({ url: dbUrl.startsWith('file:') ? dbUrl : `file:${dbUrl}` });
const prisma = new PrismaClient({ adapter } as any);

// Category inference from the app's categories library
// (duplicated here to avoid TypeScript module resolution issues with tsx)
const CATEGORIES = [
  { id: 'security', name: '网络安全', slug: 'security', icon: '🔐', parentGroups: ['cybersecurity-skills'], keywords: ['security', 'cyber', 'threat', 'hunt', 'detect', 'exploit', 'malware', 'ransomware', 'phishing', 'forensic', 'pentest', 'red-team', 'vulnerability', 'incident', 'attack', 'defense', 'breach', 'c2', 'ioc', 'apt', 'cryptography', 'zero-trust', 'siem', 'soar'], slugPatterns: ['cybersecurity', 'security-', '-security'] },
  { id: 'engineering', name: '开发工程', slug: 'engineering', icon: '💻', parentGroups: ['engineering-skills', 'engineering-advanced-skills'], keywords: ['code', 'developer', 'frontend', 'backend', 'fullstack', 'architect', 'api', 'database', 'docker', 'kubernetes', 'ci-cd', 'devops', 'testing', 'debug', 'review', 'refactor', 'typescript', 'react', 'next', 'node', 'python', 'git', 'terraform', 'helm', 'npm', 'cli'], slugPatterns: ['senior-', 'code-', 'api-', 'docker-', 'karpathy-'] },
  { id: 'marketing', name: '营销增长', slug: 'marketing', icon: '📈', parentGroups: ['marketing-skills', 'founder-skills'], keywords: ['marketing', 'seo', 'content', 'social', 'email', 'ad', 'growth', 'cro', 'conversion', 'landing', 'funnel', 'brand', 'copywriting', 'acquisition', 'referral', 'paid', 'organic', 'traffic', 'linkedin', 'twitter', 'outreach', 'campaign', 'analytics', 'gtm', 'lead', 'demand'], slugPatterns: ['marketing-', 'social-', 'email-', 'seo-', 'cro-', 'growth-'] },
  { id: 'c-suite', name: '高管顾问', slug: 'c-suite', icon: '👔', parentGroups: ['c-level-agents'], keywords: ['ceo', 'cto', 'cfo', 'cmo', 'ciso', 'cpo', 'cro', 'coo', 'vpe', 'board', 'executive', 'advisor', 'chief', 'strategy', 'leadership', 'founder', 'venture', 'management', 'decision', 'director'], slugPatterns: ['ceo-', 'cto-', 'cfo-', 'cmo-', 'ciso-', 'cpo-', 'cro-', 'coo-', 'board', 'chief-', 'c-level', 'vpe-', 'founder-'] },
  { id: 'product', name: '产品管理', slug: 'product', icon: '🏗️', parentGroups: ['product-skills', 'pm-skills'], keywords: ['product', 'prd', 'roadmap', 'backlog', 'sprint', 'agile', 'scrum', 'user-story', 'feature', 'mvp', 'prototype', 'wireframe', 'ux', 'research', 'discovery', 'stakeholder', 'requirement', 'spec', 'launch'], slugPatterns: ['product-', 'prd-', 'epic-', 'agile-', 'scrum-'] },
  { id: 'lark', name: '飞书/Lark', slug: 'lark', icon: '🦜', parentGroups: [], keywords: ['lark', 'feishu', '飞书', 'document', 'sheet', 'approval', 'calendar', 'meeting', 'message', 'wiki', 'task', 'okr', 'base'], slugPatterns: ['lark-'] },
  { id: 'ai-ml', name: 'AI/智能体', slug: 'ai-ml', icon: '🤖', parentGroups: [], keywords: ['agent', 'ai', 'ml', 'prompt', 'rag', 'llm', 'embedding', 'vector', 'mcp', 'skill', 'workflow', 'autonomous', 'model', 'deep-research', 'nlp', 'chatbot', 'generative'], slugPatterns: ['agent-', 'ai-', 'prompt-', 'rag-', 'mcp-', 'llm-'] },
  { id: 'finance-legal', name: '财务法务', slug: 'finance-legal', icon: '💰', parentGroups: ['finance-skills', 'commercial-skills'], keywords: ['finance', 'legal', 'contract', 'pricing', 'revenue', 'tax', 'compliance', 'audit', 'procurement', 'vendor', 'rfp', 'deal', 'budget', 'forecast', 'patent', 'grant', 'investment', 'saas'], slugPatterns: ['finance-', 'pricing-', 'contract-', 'grant', 'patent'] },
  { id: 'devops', name: '运维/SRE', slug: 'devops', icon: '🔧', parentGroups: ['business-operations-skills'], keywords: ['devops', 'sre', 'infrastructure', 'monitor', 'logging', 'alert', 'incident', 'postmortem', 'slo', 'sla', 'chaos', 'runbook', 'deploy', 'pipeline', 'capacity', 'backup', 'recovery'], slugPatterns: ['incident-', 'postmortem', 'chaos-', 'slo-', 'runbook'] },
  { id: 'qa-testing', name: '测试/QA', slug: 'qa-testing', icon: '🧪', parentGroups: [], keywords: ['test', 'qa', 'quality', 'verify', 'validate', 'e2e', 'unit-test', 'integration-test', 'coverage', 'benchmark', 'stress-test', 'tdd', 'browserstack', 'playwright', 'testrail'], slugPatterns: ['test-', 'tdd-', 'coverage', 'stress-test'] },
  { id: 'writing', name: '内容创作', slug: 'writing', icon: '✍️', parentGroups: ['writing-skills'], keywords: ['writing', 'content', 'copy', 'blog', 'article', 'email', 'social', 'newsletter', 'script', 'video', 'youtube', 'creative', 'story', 'editorial'], slugPatterns: ['content-', 'copywriting', 'copy-', 'writing-'] },
  { id: 'data', name: '数据分析', slug: 'data', icon: '📊', parentGroups: [], keywords: ['data', 'analytics', 'statistics', 'report', 'dashboard', 'metrics', 'visualization', 'sql', 'database', 'schema', 'quality', 'pipeline'], slugPatterns: ['data-', 'analytics-', 'statistical-', 'sql-'] },
  { id: 'design', name: '设计/UX', slug: 'design', icon: '🎨', parentGroups: [], keywords: ['design', 'ui', 'ux', 'figma', 'prototype', 'wireframe', 'apple', 'hig', 'accessibility', 'a11y', 'color', 'typography', 'animation'], slugPatterns: ['ui-', 'ux-', 'a11y-', 'design-', 'apple-'] },
  { id: 'business', name: '商业运营', slug: 'business', icon: '🏢', parentGroups: ['business-growth-skills', 'business-operations-skills', 'commercial-skills'], keywords: ['business', 'strategy', 'operation', 'growth', 'revenue', 'sales', 'customer', 'onboarding', 'retention', 'churn', 'partnership', 'expansion', 'competitive', 'market', 'forecast', 'process', 'change', 'culture'], slugPatterns: ['business-', 'commercial-', 'customer-', 'sales-'] },
  { id: 'other', name: '其他工具', slug: 'other', icon: '🛠️', parentGroups: [], keywords: [], slugPatterns: [] },
];

// Manual slug → category mappings
const MANUAL_MAP: Record<string, string> = {
  'a11y-audit': 'design',
  'code-reviewer': 'engineering',
  'code-review': 'engineering',
  'security-review': 'security',
  'fix': 'engineering',
  'focused-fix': 'engineering',
  'simplify': 'engineering',
  'review': 'engineering',
  'init': 'engineering',
  'run': 'engineering',
  'verify': 'engineering',
  'generate': 'engineering',
  'test-driven-development': 'qa-testing',
  'pr-review-expert': 'engineering',
  'skill-creator': 'ai-ml',
  'skill-security-auditor': 'security',
  'adversarial-reviewer': 'ai-ml',
  'agent-designer': 'ai-ml',
  'agent-workflow-designer': 'ai-ml',
  'self-improving-agent': 'ai-ml',
  'prompt-engineer-toolkit': 'ai-ml',
  'deep-research': 'ai-ml',
  'rag-architect': 'ai-ml',
  'mcp-server-builder': 'ai-ml',
  'write-a-skill': 'ai-ml',
  'caveman': 'engineering',
  'caveman-commit': 'engineering',
  'caveman-review': 'engineering',
  'caveman-compress': 'engineering',
  'caveman-help': 'engineering',
  'caveman-stats': 'engineering',
  'cavecrew': 'engineering',
  'capture': 'engineering',
  'freeze': 'engineering',
  'spawn': 'engineering',
  'merge': 'engineering',
  'handoff': 'engineering',
  'brief': 'engineering',
  'execute': 'engineering',
  'loop': 'engineering',
  'remember': 'ai-ml',
  'reflect': 'ai-ml',
  'status': 'engineering',
  'setup': 'engineering',
  'board': 'c-suite',
  'board-deck-builder': 'c-suite',
  'board-meeting': 'c-suite',
  'board-prep': 'c-suite',
  'boardroom': 'c-suite',
  'ceo-advisor': 'c-suite',
  'cfo-advisor': 'c-suite',
  'cto-advisor': 'c-suite',
  'cmo-advisor': 'c-suite',
  'ciso-advisor': 'c-suite',
  'coo-advisor': 'c-suite',
  'cpo-advisor': 'c-suite',
  'cro-advisor': 'c-suite',
  'vpe-advisor': 'c-suite',
  'chro-advisor': 'c-suite',
  'general-counsel-advisor': 'c-suite',
  'chief-of-staff': 'c-suite',
  'executive-mentor': 'c-suite',
  'founder-coach': 'c-suite',
  'founder-mode': 'c-suite',
  'c-level-advisor': 'c-suite',
  'cold-email': 'marketing',
  'email-sequence': 'marketing',
  'email-template-builder': 'marketing',
  'content-creator': 'writing',
  'content-strategy': 'writing',
  'content-production': 'writing',
  'social-content': 'writing',
  'social-media-manager': 'marketing',
  'seo-audit': 'marketing',
  'paid-ads': 'marketing',
  'landing': 'marketing',
  'landing-page-generator': 'marketing',
  'copywriting': 'writing',
  'copy-editing': 'writing',
  'brand-guidelines': 'marketing',
  'competitive-intel': 'business',
  'competitive-teardown': 'business',
  'pricing-strategist': 'finance-legal',
  'pricing-strategy': 'finance-legal',
  'financial-analyst': 'finance-legal',
  'contract-and-proposal-writer': 'finance-legal',
  'rfp-responder': 'finance-legal',
  'procurement-optimizer': 'finance-legal',
  'vendor-management': 'business',
  'saas-metrics-coach': 'finance-legal',
  'deal-desk': 'finance-legal',
  'product-manager-toolkit': 'product',
  'product-strategist': 'product',
  'product-discovery': 'product',
  'agile-product-owner': 'product',
  'scrum-master': 'product',
  'epic-design': 'product',
  'roadmap-communicator': 'product',
  'experiment-designer': 'product',
  'incident-commander': 'devops',
  'incident-response': 'devops',
  'post-mortem': 'devops',
  'postmortem': 'devops',
  'slo-architect': 'devops',
  'chaos-engineering': 'devops',
  'runbook-generator': 'devops',
  'database-designer': 'data',
  'database-schema-designer': 'data',
  'sql-database-assistant': 'data',
  'data-quality-auditor': 'data',
  'statistical-analyst': 'data',
  'ui-design-system': 'design',
  'ux-researcher-designer': 'design',
  'apple-hig-expert': 'design',
  'performance-profiler': 'engineering',
  'dependency-auditor': 'engineering',
  'tech-debt-tracker': 'engineering',
  'release-manager': 'engineering',
  'ci-cd-pipeline-builder': 'engineering',
  'monorepo-navigator': 'engineering',
  'api-design-reviewer': 'engineering',
  'api-test-suite-builder': 'qa-testing',
  'terraform-patterns': 'engineering',
  'docker-development': 'engineering',
  'helm-chart-builder': 'engineering',
  'kubernetes-operator': 'engineering',
  'env-secrets-manager': 'engineering',
  'secrets-vault-manager': 'engineering',
  'observability-designer': 'devops',
  'senior-architect': 'engineering',
  'senior-backend': 'engineering',
  'senior-frontend': 'engineering',
  'senior-fullstack': 'engineering',
  'senior-devops': 'engineering',
  'senior-qa': 'qa-testing',
  'senior-security': 'security',
  'senior-pm': 'product',
  'senior-data-engineer': 'data',
  'senior-data-scientist': 'data',
  'senior-ml-engineer': 'ai-ml',
  'senior-computer-vision': 'ai-ml',
  'senior-secops': 'security',
  'senior-prompt-engineer': 'ai-ml',
  'karpathy-coder': 'engineering',
  'vercel-react-best-practices': 'engineering',
  'stripe-integration-expert': 'engineering',
  'security-pen-testing': 'security',
  'threat-detection': 'security',
  'security-guidance': 'security',
  'red-team': 'security',
  'ai-security': 'security',
  'lark-approval': 'lark', 'lark-apps': 'lark', 'lark-attendance': 'lark',
  'lark-base': 'lark', 'lark-calendar': 'lark', 'lark-contact': 'lark',
  'lark-doc': 'lark', 'lark-drive': 'lark', 'lark-event': 'lark',
  'lark-im': 'lark', 'lark-mail': 'lark', 'lark-markdown': 'lark',
  'lark-minutes': 'lark', 'lark-okr': 'lark', 'lark-openapi-explorer': 'lark',
  'lark-shared': 'lark', 'lark-sheets': 'lark', 'lark-skill-maker': 'lark',
  'lark-slides': 'lark', 'lark-task': 'lark', 'lark-vc': 'lark',
  'lark-vc-agent': 'lark', 'lark-whiteboard': 'lark', 'lark-wiki': 'lark',
  'x-twitter-growth': 'marketing', 'youtube-clipper': 'writing',
  'video-use': 'writing', 'demo-video': 'writing', 'remotion-best-practices': 'writing',
  'notebooklm': 'ai-ml', 'sales-engineer': 'business',
  'customer-success-manager': 'business', 'churn-prevention': 'business',
  'onboarding-cro': 'business', 'signup-flow-cro': 'marketing',
  'popup-cro': 'marketing', 'page-cro': 'marketing', 'form-cro': 'marketing',
  'paywall-upgrade-cro': 'marketing', 'referral-program': 'marketing',
  'partnerships-architect': 'business', 'launch-strategy': 'product',
  'app-store-optimization': 'marketing', 'intl-expansion': 'business',
  'org-health-diagnostic': 'business', 'culture-architect': 'business',
  'change-management': 'business', 'process-mapper': 'business',
  'internal-comms': 'business', 'internal-narrative': 'business',
  'team-communications': 'business', 'knowledge-ops': 'business',
  'hard-call': 'c-suite', 'scenario-war-room': 'c-suite',
  'strategic-alignment': 'c-suite', 'decision-logger': 'c-suite',
  'company-os': 'c-suite', 'industry-os': 'c-suite', 'context-engine': 'ai-ml',
  'executing-plans': 'engineering', 'writing-plans': 'engineering',
  'subagent-driven-development': 'engineering',
  'spec-driven-workflow': 'engineering', 'dispatching-parallel-agents': 'ai-ml',
  'using-superpowers': 'ai-ml', 'using-git-worktrees': 'engineering',
  'git-worktree-manager': 'engineering',
  'finishing-a-development-branch': 'engineering',
  'receiving-code-review': 'engineering', 'requesting-code-review': 'engineering',
  'code-tour': 'engineering', 'codebase-onboarding': 'engineering',
  'command-guide': 'engineering', 'code-to-prd': 'product',
  'spec-to-repo': 'engineering', 'saas-scaffolder': 'engineering',
  'grill-me': 'c-suite', 'stop-slop': 'ai-ml', 'brand-sentinel': 'marketing',
  'ma-playbook': 'business', 'add-lang': 'engineering', 'agent-eval': 'ai-ml',
  'ecommerce-analytics': 'data', 'ecommerce-ceo': 'business',
  'ecommerce-guardrails': 'security', 'ecommerce-intel': 'business',
  'ecommerce-marketing': 'marketing', 'ecommerce-operations': 'business',
  'ecommerce-product': 'product', 'short-video-creator': 'writing',
  'social-calendar-skill': 'marketing', 'ad-creative': 'marketing',
  'analytics-tracking': 'data', 'product-analytics': 'data',
  'campaign-analytics': 'marketing', 'web-access': 'engineering',
  'browserstack': 'qa-testing', 'full-page-screenshot': 'qa-testing',
  'systematic-debugging': 'engineering', 'tc-tracker': 'engineering',
  'tech-stack-evaluator': 'engineering', 'interview-system-designer': 'engineering',
  'site-architecture': 'engineering', 'programmatic-seo': 'marketing',
  'schema-markup': 'marketing', 'ai-seo': 'marketing', 'aeo': 'marketing',
  'apify-actor-development': 'engineering', 'apify-actorization': 'engineering',
  'apify-generate-output-schema': 'engineering',
  'apify-sdk-integration': 'engineering', 'apify-ultimate-scraper': 'engineering',
  'autoresearch-agent': 'ai-ml', 'aws-solution-architect': 'engineering',
  'azure-cloud-architect': 'engineering', 'gcp-cloud-architect': 'engineering',
  'migration-architect': 'engineering', 'changelog-generator': 'engineering',
  'ship-gate': 'engineering', 'caio-review': 'c-suite', 'cco-review': 'c-suite',
  'cdo-review': 'c-suite', 'cfo-review': 'c-suite', 'ciso-review': 'c-suite',
  'cmo-review': 'c-suite', 'cpo-review': 'c-suite', 'cro-review': 'c-suite',
  'cto-review': 'c-suite', 'gc-review': 'c-suite', 'vpe-review': 'c-suite',
  'coverage': 'qa-testing', 'cross-eval': 'ai-ml', 'self-eval': 'ai-ml',
  'eval': 'ai-ml', 'pulse': 'business', 'cs-onboard': 'business',
  'onboard': 'business', 'inbox-setup': 'business', 'inbox-triage': 'business',
  'office-hours': 'business', 'syllabus': 'business',
  'update-config': 'engineering', 'keybindings-help': 'engineering',
  'fewer-permission-prompts': 'engineering', 'research-summarizer': 'ai-ml',
  'dossier': 'business', 'meeting-analyzer': 'business',
  'brainstorming': 'product', 'andreessen': 'c-suite', 'agenthub': 'ai-ml',
  'agent-protocol': 'ai-ml', 'agent-reach': 'ai-ml', 'llm-wiki': 'ai-ml',
  'litreview': 'ai-ml', 'research': 'ai-ml', 'report': 'business',
  'extract': 'data', 'decide': 'c-suite', 'challenge': 'c-suite',
  'migrate': 'engineering', 'promote': 'marketing', 'resume': 'business',
  'free-tool-strategy': 'marketing', 'channel-economics': 'business',
  'revenue-operations': 'business', 'commercial-forecaster': 'finance-legal',
  'commercial-policy': 'finance-legal', 'marketing-context': 'marketing',
  'marketing-demand-acquisition': 'marketing', 'marketing-ideas': 'marketing',
  'marketing-ops': 'marketing', 'marketing-psychology': 'marketing',
  'marketing-strategy-pmm': 'marketing', 'social-media-analyzer': 'marketing',
  'viral-hook-creator': 'marketing', 'content-humanizer': 'writing',
  'cro-optimization': 'marketing', 'find-skills': 'ai-ml',
  'ab-test-setup': 'marketing',
  'cc-review': 'c-suite', 'claude-api': 'ai-ml',
};

function inferCategory(slug: string, _name: string, description: string, parentGroup: string | null): string {
  // 1. Check manual mappings first
  if (MANUAL_MAP[slug]) {
    return MANUAL_MAP[slug];
  }

  // 2. Check parent group → category mapping
  if (parentGroup) {
    for (const cat of CATEGORIES) {
      if (cat.parentGroups.includes(parentGroup)) {
        return cat.id;
      }
    }
  }

  // 3. Check slug patterns
  for (const cat of CATEGORIES) {
    for (const pattern of cat.slugPatterns) {
      if (slug.includes(pattern)) {
        return cat.id;
      }
    }
  }

  // 4. Check keyword matches in description
  const desc = description.toLowerCase();
  let bestMatch = 'other';
  let bestScore = 0;

  for (const cat of CATEGORIES) {
    let score = 0;
    for (const kw of cat.keywords) {
      if (desc.includes(kw)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = cat.id;
    }
  }

  return bestMatch;
}

interface SkillData {
  slug: string;
  name: string;
  description: string;
  fullContent: string;
  tags: string[];
  tier: string | null;
  author: string | null;
  version: string | null;
  sourcePath: string;
  sourceType: 'direct' | 'nested' | 'symlink';
  parentGroup: string | null;
}

function parseSkillMd(filePath: string): SkillData | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const { data, content: body } = matter(content);

    // Derive slug from directory name
    const dirName = path.basename(path.dirname(filePath));
    const name = data.name || dirName;
    const description = data.description || '';
    const slug = dirName;

    return {
      slug,
      name,
      description,
      fullContent: content,
      tags: data.tags || [],
      tier: data.tier || null,
      author: data.author || null,
      version: data.version || null,
      sourcePath: filePath,
      sourceType: 'direct',
      parentGroup: null,
    };
  } catch {
    return null;
  }
}

function parseNestedSkillMd(filePath: string, parentGroup: string): SkillData | null {
  const data = parseSkillMd(filePath);
  if (data) {
    data.sourceType = 'nested';
    data.parentGroup = parentGroup;
  }
  return data;
}

async function scanDirectory(dir: string): Promise<SkillData[]> {
  const skills: SkillData[] = [];

  if (!fs.existsSync(dir)) {
    console.log(`Directory not found: ${dir}`);
    return skills;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Check for direct SKILL.md (standard skill)
      const skillMd = path.join(fullPath, 'SKILL.md');
      if (fs.existsSync(skillMd)) {
        const data = parseSkillMd(skillMd);
        if (data) skills.push(data);
      }

      // Check for nested skills/ directory (group repos)
      const nestedSkillsDir = path.join(fullPath, 'skills');
      if (fs.existsSync(nestedSkillsDir)) {
        const nestedEntries = fs.readdirSync(nestedSkillsDir, { withFileTypes: true });
        for (const ne of nestedEntries) {
          if (ne.isDirectory()) {
            const nestedSkillMd = path.join(nestedSkillsDir, ne.name, 'SKILL.md');
            if (fs.existsSync(nestedSkillMd)) {
              const data = parseNestedSkillMd(nestedSkillMd, entry.name);
              if (data) skills.push(data);
            }
          }
        }
      }
    }
  }

  return skills;
}

async function main() {
  console.log('🔍 Scanning skills directories...\n');

  const allSkills: SkillData[] = [];

  // Scan .agents/skills/
  const agentSkillsDir = 'C:/Users/78526/.agents/skills';
  const agentSkills = await scanDirectory(agentSkillsDir);
  console.log(`  ${agentSkillsDir}: ${agentSkills.length} skills`);
  allSkills.push(...agentSkills);

  // Scan .claude/skills/ (non-symlinked directories only)
  const claudeSkillsDir = 'C:/Users/78526/.claude/skills';
  if (fs.existsSync(claudeSkillsDir)) {
    const entries = fs.readdirSync(claudeSkillsDir, { withFileTypes: true });
    let claudeCount = 0;

    for (const entry of entries) {
      const fullPath = path.join(claudeSkillsDir, entry.name);

      // Check if it's a symlink
      try {
        const lstat = fs.lstatSync(fullPath);
        if (lstat.isSymbolicLink()) continue; // Skip symlinks (already in .agents)
      } catch {
        continue;
      }

      if (entry.isDirectory()) {
        // Check for nested skills/ directory
        const nestedDir = path.join(fullPath, 'skills');
        if (fs.existsSync(nestedDir)) {
          const subEntries = fs.readdirSync(nestedDir, { withFileTypes: true });
          for (const se of subEntries) {
            if (se.isDirectory()) {
              const nestedSkillMd = path.join(nestedDir, se.name, 'SKILL.md');
              if (fs.existsSync(nestedSkillMd)) {
                const data = parseNestedSkillMd(nestedSkillMd, entry.name);
                if (data) {
                  allSkills.push(data);
                  claudeCount++;
                }
              }
            }
          }
        } else {
          // Direct SKILL.md
          const skillMd = path.join(fullPath, 'SKILL.md');
          if (fs.existsSync(skillMd)) {
            const data = parseSkillMd(skillMd);
            if (data) {
              allSkills.push(data);
              claudeCount++;
            }
          }
        }
      }
    }
    console.log(`  ${claudeSkillsDir}: ${claudeCount} skills (non-symlink)`);
  }

  // Also scan .claude/skills for direct skill dirs (not groups)
  // These are the 333 symlinks - they point back to .agents/skills so we skip them

  console.log(`\n📊 Total skills found: ${allSkills.length}`);

  // Infer categories and upsert into database
  console.log('\n📝 Indexing skills into database...');

  let indexed = 0;
  let cats: Record<string, number> = {};

  for (const skill of allSkills) {
    const category = inferCategory(skill.slug, skill.name, skill.description, skill.parentGroup);

    await prisma.skill.upsert({
      where: { slug: skill.slug },
      create: {
        slug: skill.slug,
        name: skill.name,
        description: skill.description,
        fullContent: skill.fullContent,
        category,
        subcategory: skill.parentGroup,
        tags: JSON.stringify(skill.tags),
        tier: skill.tier,
        author: skill.author,
        version: skill.version,
        sourcePath: skill.sourcePath,
        sourceType: skill.sourceType,
        parentGroup: skill.parentGroup,
        isIndexed: true,
      },
      update: {
        name: skill.name,
        description: skill.description,
        fullContent: skill.fullContent,
        category,
        subcategory: skill.parentGroup,
        tags: JSON.stringify(skill.tags),
        tier: skill.tier,
        author: skill.author,
        version: skill.version,
        sourcePath: skill.sourcePath,
        sourceType: skill.sourceType,
        parentGroup: skill.parentGroup,
        isIndexed: true,
      },
    });

    cats[category] = (cats[category] || 0) + 1;
    indexed++;
  }

  console.log(`\n✅ Indexed ${indexed} skills`);
  console.log('\n📈 Category distribution:');
  for (const [cat, count] of Object.entries(cats).sort((a, b) => b[1] - a[1])) {
    const catDef = CATEGORIES.find((c) => c.id === cat);
    const icon = catDef?.icon || '📦';
    const name = catDef?.name || cat;
    console.log(`  ${icon} ${name}: ${count}`);
  }

  await prisma.$disconnect();
  console.log('\n✨ Done!');
}

main().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
