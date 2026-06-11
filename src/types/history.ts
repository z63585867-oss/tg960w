export type UsageAction = 'view' | 'copy' | 'invoke' | 'workflow';

export interface UsageEntry {
  id: string;
  skillId: string;
  skillSlug: string;
  skillName: string;
  action: UsageAction;
  context: string | null;
  createdAt: string;
}
