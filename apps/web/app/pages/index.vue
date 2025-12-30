<script setup lang="ts">
import WorkflowEditorModal from "../workflows/WorkflowEditorModal.vue";

const _workflowsComposable = useWorkflows();

const { renderMarkdown } = useMarkdownRenderer();

const _workflowsList = computed(() => _workflowsComposable.workflows.value ?? []);
const _errorMessage = computed(() => _workflowsComposable.error.value?.message ?? "");
const _selectedWorkflow = computed(() => _workflowsComposable.selectedWorkflow.value);

function _renderCardPreview(markdown: string): string {
  const slice = (markdown ?? "").trim().slice(0, 240);
  return renderMarkdown(slice.length > 0 ? slice : "");
}

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
      Error loading workflows: {{ _errorMessage }}
    </div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div 
        v-for="workflow in _workflowsList" 
        :key="workflow.id" 
        class="bg-white p-4 rounded-lg shadow hover:shadow-md cursor-pointer transition-shadow flex flex-col justify-between"
        @click="_workflowsComposable.openModal(workflow)"
      >
        <div class="flex-grow">
          <h2 class="text-lg font-bold truncate">{{ workflow.title }}</h2>
          <div class="mt-2 h-24 overflow-hidden text-sm text-gray-700">
            <div class="text-xs text-gray-500 mb-1" v-if="workflow.description">
              {{ workflow.description }}
            </div>
            <div class="rounded-md border border-gray-100 bg-white p-2">
              <div class="text-xs text-gray-400 mb-1">Preview</div>
              <div class="text-gray-700" v-html="_renderCardPreview(workflow.content)" />
            </div>
          </div>
        </div>
        <div class="mt-4 pt-2 border-t border-gray-100">
          <p class="text-gray-400 text-xs">
            Last updated: {{ _formatDateTime(workflow.lastUpdated) }}
          </p>
        </div>
      </div>
    </div>

    <WorkflowEditorModal
      v-if="_workflowsComposable.isModalOpen && _selectedWorkflow"
      :workflow="_selectedWorkflow"
      :workflows="_workflowsList"
      @close="_workflowsComposable.closeModal"
      @saved="_workflowsComposable.handleSaved"
    />
  </div>
</template>
