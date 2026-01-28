<template>
  <div 
    class="bg-white p-4 rounded-lg shadow hover:shadow-md cursor-pointer transition-shadow flex flex-col justify-between"
    @click="$emit('select')"
  >
    <div class="flex-grow">
      <h2 class="text-lg font-bold truncate">{{ workflow.title }}</h2>
      <div class="mt-2 h-24 overflow-hidden text-sm text-gray-700">
        <div class="text-xs text-gray-500 mb-1" v-if="workflow.description">
          {{ workflow.description }}
        </div>
        <div class="rounded-md border border-gray-100 bg-white p-2">
          <div class="text-xs text-gray-400 mb-1">Preview</div>
          <div class="text-gray-700" v-html="previewHtml" />
        </div>
      </div>
    </div>
    <div class="mt-4 pt-2 border-t border-gray-100">
      <p class="text-gray-400 text-xs">
        Last updated: {{ formattedDate }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Workflow } from "@shared/types/workflow";
import { formatDateTime, renderCardPreview } from "../utils/workflowHelpers";

interface Props {
  workflow: Workflow;
  renderMarkdown: (markdown: string) => string;
}

interface Emits {
  select: [];
}

const props = defineProps<Props>();
defineEmits<Emits>();

const formattedDate = computed(() => formatDateTime(props.workflow.lastUpdated));
const previewHtml = computed(() => renderCardPreview(props.workflow.content, props.renderMarkdown));
</script>
