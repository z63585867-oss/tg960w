export const APP_NAME = 'SkillOS';
export const APP_DESCRIPTION = 'AI 技能桌面工作台';

export const SKILLS_BASE_DIRS = [
  'C:/Users/78526/.agents/skills',
  'C:/Users/78526/.claude/skills',
];

export const DEFAULT_CATEGORY = 'other';

export const SORT_OPTIONS = [
  { value: 'name', label: '名称' },
  { value: 'category', label: '分类' },
  { value: 'recent', label: '最近使用' },
  { value: 'usage', label: '使用频率' },
] as const;

export const ACTION_LABELS: Record<string, string> = {
  view: '查看',
  copy: '复制命令',
  invoke: '调用技能',
  workflow: '执行工作流',
};
