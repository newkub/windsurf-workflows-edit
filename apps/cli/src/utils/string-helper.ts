import { err, ok, type Result } from "../types/result";

export function sanitizeWorkflowId(value: string): Result<string> {
  const v = (value ?? "").trim();
  if (v.length === 0) return err(new Error("id is required"));

  const normalized = v
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");

  if (normalized.length === 0) return err(new Error("id is invalid"));

  return ok(normalized);
}
