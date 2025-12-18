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
        class="bg-white p-4 rounded-lg shadow hover:shadow-md cursor-pointer transition-shadow"
        @click="openModal(workflow)"
      >
        <h2 class="text-lg font-bold">{{ workflow.title }}</h2>
        <p class="text-gray-600 text-sm mt-2 truncate">{{ workflow.description }}</p>
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
