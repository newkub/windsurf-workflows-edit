import yaml from "js-yaml";
import { clack } from "./lib/clack.lib";
import { workflowTemplateConfig } from "./config/workflow-template.config";
import { ensureDir, fileExists, joinPath, writeTextFile } from "./services/file-system.service";
import { resolveWorkflowsDir } from "./services/workflows-dir.service";
import { err, ok, type Result } from "./types/result";
import { sanitizeWorkflowId } from "./utils/string-helper";

type MakeCompletelyInput = {
  id: string;
  title: string;
  description: string;
  overwrite: boolean;
};

function buildWorkflowMarkdown(input: MakeCompletelyInput): string {
  const fm = yaml.dump(
    {
      title: input.title,
      description: input.description,
    },
    { noRefs: true, sortKeys: true, lineWidth: 120 },
  );

  const body = [
    "# Goal",
    "Describe the goal of this workflow.",
    "",
    "# Steps",
    ...workflowTemplateConfig.steps.map((s, i) => `${i + 1}. ${s}`),
    "",
    "# Notes",
    "- Keep steps deterministic",
    "- Prefer type safety",
    "",
  ].join("\n");

  return `---\n${fm.trim()}\n---\n\n${body}`;
}

async function writeWorkflowFile(input: MakeCompletelyInput): Promise<Result<{ filePath: string }>> {
  const idRes = sanitizeWorkflowId(input.id);
  if (!idRes.ok) return err(idRes.error);

  const workflowsDir = resolveWorkflowsDir();
  const ensure = await ensureDir(workflowsDir);
  if (!ensure.ok) return err(ensure.error);

  const filePath = joinPath(workflowsDir, `${idRes.value}.md`);

  if (!input.overwrite) {
    const exists = await fileExists(filePath);
    if (!exists.ok) return err(exists.error);
    if (exists.value) {
      return err(new Error(`File already exists: ${filePath} (use --overwrite)`));
    }
  }

  const content = buildWorkflowMarkdown({ ...input, id: idRes.value });
  const wrote = await writeTextFile(filePath, content);
  if (!wrote.ok) return err(wrote.error);

  return ok({ filePath });
}

export async function runMakeCompletelyInteractive(): Promise<Result<{ filePath: string }>> {
  clack.intro("Make Completely");

  const id = await clack.text({
    message: "Workflow id (used as filename)",
    placeholder: "make-completely",
    validate(value) {
      const r = sanitizeWorkflowId(String(value ?? ""));
      return r.ok ? undefined : r.error.message;
    },
  });

  if (clack.isCancel(id)) {
    clack.outro("Cancelled");
    return err(new Error("Cancelled"));
  }

  const title = await clack.text({
    message: "Title",
    placeholder: "Make Completely",
    initialValue: "Make Completely",
  });

  if (clack.isCancel(title)) {
    clack.outro("Cancelled");
    return err(new Error("Cancelled"));
  }

  const description = await clack.text({
    message: "Description",
    placeholder: "Generated workflow",
    initialValue: "Generated workflow",
  });

  if (clack.isCancel(description)) {
    clack.outro("Cancelled");
    return err(new Error("Cancelled"));
  }

  const overwrite = await clack.confirm({
    message: "Overwrite if file exists?",
    initialValue: false,
  });

  if (clack.isCancel(overwrite)) {
    clack.outro("Cancelled");
    return err(new Error("Cancelled"));
  }

  const spinner = clack.spinner();
  spinner.start("Writing workflow...");

  const res = await writeWorkflowFile({
    id: String(id),
    title: String(title),
    description: String(description),
    overwrite: Boolean(overwrite),
  });

  if (!res.ok) {
    spinner.stop(`Failed: ${res.error.message}`, 1);
    clack.outro("Done");
    return res;
  }

  spinner.stop(`Created: ${res.value.filePath}`);
  clack.outro("Done");
  return res;
}

export async function runMakeCompletelyNonInteractive(flags: Record<string, string | boolean>): Promise<Result<{ filePath: string }>> {
  const id = typeof flags.id === "string" ? flags.id : "";
  const title = typeof flags.title === "string" ? flags.title : "Make Completely";
  const description = typeof flags.description === "string" ? flags.description : "Generated workflow";
  const overwrite = flags.overwrite === true;

  return writeWorkflowFile({ id, title, description, overwrite });
}
