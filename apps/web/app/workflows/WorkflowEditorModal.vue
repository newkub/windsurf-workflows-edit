<script setup lang="ts">
import { ref, watch } from "vue";
import type { Workflow } from "../../shared/types/workflow";

const props = defineProps<{
  workflow: Workflow;
}>();

const emit = defineEmits(["close", "saved"]);

const localContent = ref("");
const isSaving = ref(false);
const error = ref<string | null>(null);

// Watch for changes in the workflow prop and update the local content
watch(
  () => props.workflow,
  (newWorkflow) => {
    if (newWorkflow) {
      localContent.value = newWorkflow.content;
    }
  },
  { immediate: true },
);

async function _saveChanges() {
  isSaving.value = true;
  error.value = null;
  try {
    await $fetch("/api/workflow", {
      method: "PUT",
      body: {
        path: props.workflow.path,
        content: localContent.value,
      },
    });
    emit("saved");
  } catch (e: unknown) {
    if (e instanceof Error) {
      error.value = e.message;
    } else {
      error.value = "An error occurred while saving.";
    }
  } finally {
    isSaving.value = false;
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="emit('close')">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-3xl h-5/6 flex flex-col p-4">
      <div class="flex justify-between items-center border-b pb-2 mb-4">
        <h2 class="text-xl font-bold">Editing: {{ workflow.title }}</h2>
        <button @click="emit('close')" class="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
      </div>

      <textarea 
        v-model="localContent"
        class="flex-grow w-full p-2 border rounded font-mono text-sm resize-none"
        placeholder="Enter your markdown here..."
      ></textarea>

      <div class="flex justify-end items-center border-t pt-2 mt-4">
        <p v-if="error" class="text-red-500 mr-4">{{ error }}</p>
        <button 
          @click="_saveChanges"
          :disabled="isSaving"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {{ isSaving ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </div>
  </div>
</template>
