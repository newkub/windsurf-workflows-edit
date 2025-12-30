// shared/types/workflow.ts

export interface Workflow {
  id: string;
  path: string;
  title: string;
  description: string;
  frontmatter: Record<string, unknown>;
  raw: string;
  content: string;
  lastUpdated: string;
}
