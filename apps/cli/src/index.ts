#!/usr/bin/env node

import { WorkflowPrompts } from './prompts/workflow-prompts.js';

async function main() {
  try {
    while (true) {
      const action = await WorkflowPrompts.showMainMenu();
      
      switch (action) {
        case 'add':
          await WorkflowPrompts.addWorkflow();
          break;
        case 'edit':
          await WorkflowPrompts.editWorkflow();
          break;
        case 'delete':
          await WorkflowPrompts.deleteWorkflow();
          break;
        case 'open':
          await WorkflowPrompts.openWorkflow();
          break;
        case 'list':
          await WorkflowPrompts.listWorkflows();
          break;
        case 'exit':
          console.log('👋 Goodbye!');
          process.exit(0);
          break;
        default:
          console.log('❌ Invalid option');
          break;
      }

      // Ask if user wants to continue
      const { confirm } = await import('@clack/prompts');
      const shouldContinue = await confirm({
        message: 'Would you like to perform another action?'
      });

      if (!shouldContinue) {
        console.log('👋 Goodbye!');
        process.exit(0);
      }
    }
  } catch (error) {
    console.error('❌ An error occurred:', error);
    process.exit(1);
  }
}

main();
