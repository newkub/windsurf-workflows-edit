import type { Workflow } from "@shared/types/workflow";

export type WorkflowGraphNode = {
  id: string;
  title: string;
};

export type WorkflowGraphEdge = {
  from: string;
  to: string;
  label?: string;
};

function _extractSlashCommands(markdown: string): string[] {
  const text = markdown ?? "";
  const matches = text.match(/\/[a-z0-9][a-z0-9-]*/gi) ?? [];
  return matches.map((m) => m.toLowerCase());
}

export function buildWorkflowGraph(workflows: Workflow[]): {
  nodes: WorkflowGraphNode[];
  edges: WorkflowGraphEdge[];
} {
  const list = Array.isArray(workflows) ? workflows : [];
  const idByCommand = new Map<string, string>();

  for (const w of list) {
    idByCommand.set(`/${w.id}`.toLowerCase(), w.id);
  }

  const edges: WorkflowGraphEdge[] = [];

  for (const w of list) {
    const commands = _extractSlashCommands(w.content);
    const unique = new Set(commands);

    for (const cmd of unique) {
      const targetId = idByCommand.get(cmd);
      if (!targetId) continue;
      if (targetId === w.id) continue;
      edges.push({ from: w.id, to: targetId, label: cmd });
    }
  }

  const nodes: WorkflowGraphNode[] = list.map((w) => ({
    id: w.id,
    title: w.title,
  }));

  return { nodes, edges };
}
