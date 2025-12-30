import os from "node:os";
import path from "node:path";

export function resolveWorkflowsDir(): string {
  const defaultDir =
    process.platform === "win32"
      ? path.join(
          process.env.USERPROFILE ?? os.homedir(),
          ".codeium",
          "windsurf",
          "global_workflows",
        )
      : path.join(os.homedir(), ".codeium", "windsurf", "global_workflows");

  return process.env.WINDSURF_WORKFLOWS_DIR ?? defaultDir;
}
