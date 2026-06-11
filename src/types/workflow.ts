export interface WorkflowStep {
  id: string;
  workflowId: string;
  skillId: string;
  skillSlug: string;
  skillName: string;
  orderIndex: number;
  config: Record<string, unknown> | null;
  label: string | null;
}

export interface Workflow {
  id: string;
  name: string;
  description: string | null;
  steps: WorkflowStep[];
  isBuiltIn: boolean;
  runCount: number;
  lastRunAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowDraft {
  name: string;
  description?: string;
  steps: { skillSlug: string; config?: Record<string, unknown>; label?: string }[];
}
