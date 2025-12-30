import fs from "node:fs/promises";
import path from "node:path";
import { err, ok, type Result } from "../types/result";

export async function ensureDir(dirPath: string): Promise<Result<void>> {
  try {
    await fs.mkdir(dirPath, { recursive: true });
    return ok(undefined);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to create directory";
    return err(new Error(message));
  }
}

export async function fileExists(filePath: string): Promise<Result<boolean>> {
  try {
    await fs.access(filePath);
    return ok(true);
  } catch {
    return ok(false);
  }
}

export async function writeTextFile(filePath: string, content: string): Promise<Result<void>> {
  try {
    await fs.writeFile(filePath, content, "utf-8");
    return ok(undefined);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to write file";
    return err(new Error(message));
  }
}

export function joinPath(...segments: string[]): string {
  return path.join(...segments);
}
