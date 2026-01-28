export interface Workflow {
  name: string;
  description: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowFile {
  filename: string;
  path: string;
  content: string;
}
