#!/usr/bin/env node

import { getWorkflows } from './server/utils/workflowHandler';

async function main() {
  console.log('Windsurf Workflows CLI');
  const command = process.argv[2];

  if (command === 'list') {
    const workflows = await getWorkflows();
    console.table(workflows.map(w => ({ id: w.id, title: w.title, description: w.description, lastUpdated: w.lastUpdated })));
  } else {
    console.log('Unknown command. Available commands: list');
  }
}

main().catch(console.error);
