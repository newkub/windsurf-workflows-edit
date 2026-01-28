import { intro, outro, text, select, confirm } from '@clack/prompts';
import { WorkflowManager } from '../utils/workflow-manager.js';

export class WorkflowPrompts {
  static async showMainMenu(): Promise<string> {
    intro('🚀 Windsurf Workflows Manager');

    const action = await select({
      message: 'What would you like to do?',
      options: [
        { value: 'add', label: '➕ Add new workflow' },
        { value: 'edit', label: '✏️  Edit existing workflow' },
        { value: 'delete', label: '🗑️  Delete workflow' },
        { value: 'open', label: '📂 Open workflow file' },
        { value: 'list', label: '📋 List all workflows' },
        { value: 'exit', label: '👋 Exit' }
      ]
    });

    return action as string;
  }

  static async addWorkflow(): Promise<void> {
    const name = await text({
      message: 'Enter workflow name:',
      placeholder: 'my-workflow',
      validate: (value) => {
        if (!value) return 'Name is required';
        if (value.length < 3) return 'Name must be at least 3 characters';
        return undefined;
      }
    });

    if (typeof name !== 'string') return;

    const content = await text({
      message: 'Enter workflow content:',
      placeholder: 'Describe your workflow steps...',
      validate: (value) => {
        if (!value) return 'Content is required';
        return undefined;
      }
    });

    if (typeof content !== 'string') return;

    try {
      await WorkflowManager.addWorkflow(name, content);
      outro(`✅ Workflow "${name}" added successfully!`);
    } catch (error) {
      outro(`❌ Failed to add workflow: ${error}`);
    }
  }

  static async editWorkflow(): Promise<void> {
    const workflows = await WorkflowManager.listWorkflows();
    
    if (workflows.length === 0) {
      outro('📂 No workflows found. Add one first!');
      return;
    }

    const filename = await select({
      message: 'Select workflow to edit:',
      options: workflows.map(w => ({
        value: w.filename,
        label: w.filename.replace('.md', '')
      }))
    });

    if (typeof filename !== 'string') return;

    const currentContent = await WorkflowManager.getWorkflowContent(filename);
    const contentMatch = currentContent.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
    const existingContent = contentMatch ? contentMatch[1] : currentContent;

    const newContent = await text({
      message: 'Enter new workflow content:',
      placeholder: existingContent,
      defaultValue: existingContent,
      validate: (value) => {
        if (!value) return 'Content is required';
        return undefined;
      }
    });

    if (typeof newContent !== 'string') return;

    try {
      await WorkflowManager.editWorkflow(filename, newContent);
      outro(`✅ Workflow "${filename}" updated successfully!`);
    } catch (error) {
      outro(`❌ Failed to update workflow: ${error}`);
    }
  }

  static async deleteWorkflow(): Promise<void> {
    const workflows = await WorkflowManager.listWorkflows();
    
    if (workflows.length === 0) {
      outro('📂 No workflows found.');
      return;
    }

    const filename = await select({
      message: 'Select workflow to delete:',
      options: workflows.map(w => ({
        value: w.filename,
        label: w.filename.replace('.md', '')
      }))
    });

    if (typeof filename !== 'string') return;

    const confirmed = await confirm({
      message: `Are you sure you want to delete "${filename.replace('.md', '')}"?`
    });

    if (!confirmed) {
      outro('❌ Deletion cancelled.');
      return;
    }

    try {
      await WorkflowManager.deleteWorkflow(filename);
      outro(`✅ Workflow "${filename}" deleted successfully!`);
    } catch (error) {
      outro(`❌ Failed to delete workflow: ${error}`);
    }
  }

  static async openWorkflow(): Promise<void> {
    const workflows = await WorkflowManager.listWorkflows();
    
    if (workflows.length === 0) {
      outro('📂 No workflows found.');
      return;
    }

    const filename = await select({
      message: 'Select workflow to open:',
      options: workflows.map(w => ({
        value: w.filename,
        label: w.filename.replace('.md', '')
      }))
    });

    if (typeof filename !== 'string') return;

    try {
      await WorkflowManager.openWorkflow(filename);
      outro(`📂 Opening "${filename}" in default editor...`);
    } catch (error) {
      outro(`❌ Failed to open workflow: ${error}`);
    }
  }

  static async listWorkflows(): Promise<void> {
    const workflows = await WorkflowManager.listWorkflows();
    
    if (workflows.length === 0) {
      outro('📂 No workflows found.');
      return;
    }

    console.log('\n📋 Available Workflows:');
    workflows.forEach((workflow, index) => {
      const contentMatch = workflow.content.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
      const content = contentMatch ? contentMatch[1].trim() : workflow.content.trim();
      const preview = content.length > 100 ? content.substring(0, 100) + '...' : content;
      
      console.log(`\n${index + 1}. ${workflow.filename.replace('.md', '')}`);
      console.log(`   ${preview}`);
    });
    
    outro(`\n📊 Found ${workflows.length} workflow(s)`);
  }
}
