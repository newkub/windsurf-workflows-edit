<script setup lang="ts">
const _workflowsComposable = useWorkflows();

function _formatDateTime(isoString: string) {
  if (!isoString) return 'N/A';
  return new Date(isoString).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
</script>

<template>
  <div>
    <div v-if="_workflowsComposable.pending">
      Loading...
    </div>
    <div v-else-if="_workflowsComposable.error">
      Error loading workflows: {{ _workflowsComposable.error.message }}
    </div>
    <div v-else-if="_workflowsComposable.workflows" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div 
        v-for="workflow in _workflowsComposable.workflows" 
        :key="workflow.id" 
        class="bg-white p-4 rounded-lg shadow hover:shadow-md cursor-pointer transition-shadow flex flex-col justify-between"
        @click="_workflowsComposable.openModal(workflow)"
      >
        <div class="flex-grow">
          <h2 class="text-lg font-bold truncate">{{ workflow.title }}</h2>
          <p class="text-gray-600 text-sm mt-2 h-12 overflow-hidden text-ellipsis">
            {{ workflow.description }}
          </p>
        </div>
        <div class="mt-4 pt-2 border-t border-gray-100">
          <p class="text-gray-400 text-xs">
            Last updated: {{ _formatDateTime(workflow.lastUpdated) }}
          </p>
        </div>
      </div>
    </div>

    <WorkflowsWorkflowEditorModal
      v-if="_workflowsComposable.isModalOpen && _workflowsComposable.selectedWorkflow"
      :workflow="_workflowsComposable.selectedWorkflow"
      @close="_workflowsComposable.closeModal"
      @saved="_workflowsComposable.handleSaved"
    />
  </div>
</template>
