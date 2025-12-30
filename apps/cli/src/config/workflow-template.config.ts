export type WorkflowTemplateConfig = {
  steps: string[];
};

export const workflowTemplateConfig: WorkflowTemplateConfig = {
  steps: [
    "/analyze-project",
    "/breakdown-into-bullet",
    "/make-completely",
    "/run-verify",
    "/refactor",
    "/follow-turborepo",
    "/commit-and-push",
  ],
};
