<script setup lang="ts">
const workflowsComposable = useWorkflows();
const {
  workflows,
  pending,
  error,
  isModalOpen,
  selectedWorkflow,
  openModal,
} = workflowsComposable;

function formatDateTime(isoString: string) {
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
    <div v-if="pending">
      Loading...
    </div>
    <div v-else-if="error">
      Error loading workflows: {{ error.message }}
    </div>
    <div v-else-if="workflows" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div 
        v-for="workflow in workflows" 
        :key="workflow.id" 
        class="bg-white p-4 rounded-lg shadow hover:shadow-md cursor-pointer transition-shadow flex flex-col justify-between"
        @click="openModal(workflow)"
      >
        <div class="flex-grow">
          <h2 class="text-lg font-bold truncate">{{ workflow.title }}</h2>
          <p class="text-gray-600 text-sm mt-2 h-12 overflow-hidden text-ellipsis">
            {{ workflow.description }}
          </p>
        </div>
        <div class="mt-4 pt-2 border-t border-gray-100">
          <p class="text-gray-400 text-xs">
            Last updated: {{ formatDateTime(workflow.lastUpdated) }}
          </p>
        </div>
      </div>
    </div>

    <WorkflowsWorkflowEditorModal
      v-if="isModalOpen && selectedWorkflow"
      :workflow="selectedWorkflow"
      @close="workflowsComposable.closeModal"
      @saved="workflowsComposable.handleSaved"
    />
  </div>
</template>
