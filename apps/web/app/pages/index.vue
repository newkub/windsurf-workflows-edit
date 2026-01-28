<script setup lang="ts">
import WorkflowCard from "../components/WorkflowCard.vue";

const workflowsComposable = useWorkflows();
const { renderMarkdown } = useMarkdownRenderer();

const workflowsList = computed(() => workflowsComposable.workflows.value ?? []);
const errorMessage = computed(() => workflowsComposable.error.value?.message ?? "");
</script>

<template>
  <div>
    <div v-if="workflowsComposable.pending">
      Loading...
    </div>
    <div v-else-if="workflowsComposable.error">
      Error loading workflows: {{ errorMessage }}
    </div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <WorkflowCard
        v-for="workflow in workflowsList"
        :key="workflow.id"
        :workflow="workflow"
        :render-markdown="renderMarkdown"
        @select="workflowsComposable.openModal(workflow)"
      />
    </div>
  </div>
</template>
