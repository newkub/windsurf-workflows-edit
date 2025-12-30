import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import matter from "gray-matter";
import type { Workflow } from "../../shared/types/workflow";

const defaultWorkflowsDir =
  process.platform === "win32"
    ? path.join(
        process.env.USERPROFILE ?? os.homedir(),
        ".codeium",
        "windsurf",
        "global_workflows",
      )
    : path.join(os.homedir(), ".codeium", "windsurf", "global_workflows");

const workflowsDir = process.env.WINDSURF_WORKFLOWS_DIR ?? defaultWorkflowsDir;

export async function getWorkflows(): Promise<Workflow[]> {
  const files = await fs.readdir(workflowsDir);
  const markdownFiles = files.filter((file) => file.endsWith(".md"));

  const workflows = await Promise.all(
    markdownFiles.map(async (file) => {
      const filePath = path.join(workflowsDir, file);
      const stats = await fs.stat(filePath);
      const fileContent = await fs.readFile(filePath, "utf-8");
      const { data, content } = matter(fileContent);

      return {
        id: file.replace(".md", ""),
        path: filePath,
        title: data.title || file.replace(".md", ""),
        description: data.description || "",
        frontmatter: (data ?? {}) as Record<string, unknown>,
        raw: fileContent,
        content,
        lastUpdated: stats.mtime.toISOString(),
      };
    }),
  );
  return workflows;
}

export async function updateWorkflow(
  filePath: string,
  content: string,
): Promise<void> {
  // Basic security check to prevent path traversal
  if (!path.resolve(filePath).startsWith(path.resolve(workflowsDir))) {
    throw new Error("Access denied");
  }
  await fs.writeFile(filePath, content, "utf-8");
}
