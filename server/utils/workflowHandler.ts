import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import type { Workflow } from "~/shared/types/workflow";

const workflowsDir =
  "C:\\Users\\Veerapong\\.codeium\\windsurf\\global_workflows";

export async function getWorkflows(): Promise<Workflow[]> {
  const files = await fs.readdir(workflowsDir);
  const markdownFiles = files.filter((file) => file.endsWith(".md"));

  const workflows = await Promise.all(
    markdownFiles.map(async (file) => {
      const filePath = path.join(workflowsDir, file);
      const fileContent = await fs.readFile(filePath, "utf-8");
      const { data, content } = matter(fileContent);

      return {
        id: file.replace(".md", ""),
        path: filePath,
        title: data.title || file.replace(".md", ""),
        description: data.description || "",
        content,
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
