import { promises as fs } from 'fs';
import { join } from 'path';
import { WorkflowFile } from '../types.js';

const GLOBAL_WORKFLOWS_DIR = 'C:\\Users\\Veerapong\\.codeium\\windsurf\\global_workflows';

export class WorkflowManager {
  private static async ensureDirectory(): Promise<void> {
    try {
      await fs.access(GLOBAL_WORKFLOWS_DIR);
    } catch {
      await fs.mkdir(GLOBAL_WORKFLOWS_DIR, { recursive: true });
    }
  }

  static async listWorkflows(): Promise<WorkflowFile[]> {
    await this.ensureDirectory();
    
    try {
      const files = await fs.readdir(GLOBAL_WORKFLOWS_DIR);
      const workflowFiles: WorkflowFile[] = [];

      for (const file of files) {
        if (file.endsWith('.md')) {
          const filePath = join(GLOBAL_WORKFLOWS_DIR, file);
          const content = await fs.readFile(filePath, 'utf-8');
          workflowFiles.push({
            filename: file,
            path: filePath,
            content
          });
        }
      }

      return workflowFiles;
    } catch (error) {
      console.error('Error listing workflows:', error);
      return [];
    }
  }

  static async addWorkflow(name: string, content: string): Promise<void> {
    await this.ensureDirectory();
    
    const filename = name.endsWith('.md') ? name : `${name}.md`;
    const filePath = join(GLOBAL_WORKFLOWS_DIR, filename);
    
    const workflowContent = `---
description: ${name}
---

${content}`;

    await fs.writeFile(filePath, workflowContent, 'utf-8');
  }

  static async editWorkflow(filename: string, content: string): Promise<void> {
    const filePath = join(GLOBAL_WORKFLOWS_DIR, filename);
    
    try {
      const existingContent = await fs.readFile(filePath, 'utf-8');
      const frontMatterMatch = existingContent.match(/^---\n[\s\S]*?\n---\n/);
      
      if (frontMatterMatch) {
        const newContent = `${frontMatterMatch[0]}\n${content}`;
        await fs.writeFile(filePath, newContent, 'utf-8');
      } else {
        await fs.writeFile(filePath, content, 'utf-8');
      }
    } catch (error) {
      throw new Error(`Failed to edit workflow ${filename}: ${error}`);
    }
  }

  static async deleteWorkflow(filename: string): Promise<void> {
    const filePath = join(GLOBAL_WORKFLOWS_DIR, filename);
    
    try {
      await fs.unlink(filePath);
    } catch (error) {
      throw new Error(`Failed to delete workflow ${filename}: ${error}`);
    }
  }

  static async getWorkflowContent(filename: string): Promise<string> {
    const filePath = join(GLOBAL_WORKFLOWS_DIR, filename);
    
    try {
      return await fs.readFile(filePath, 'utf-8');
    } catch (error) {
      throw new Error(`Failed to read workflow ${filename}: ${error}`);
    }
  }

  static async openWorkflow(filename: string): Promise<void> {
    const { spawn } = await import('child_process');
    const filePath = join(GLOBAL_WORKFLOWS_DIR, filename);
    
    // Try to open with default editor
    const start = process.platform === 'win32' ? 'start' : 'open';
    spawn(start, [filePath], { detached: true, stdio: 'ignore' }).unref();
  }
}
