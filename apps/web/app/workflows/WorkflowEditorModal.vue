<script setup lang="ts">
import { computed, ref, watch } from "vue";
import yaml from "js-yaml";
import type { Workflow } from "@shared/types/workflow";
import WorkflowGraph from "./WorkflowGraph.vue";

const props = defineProps<{
  workflow: Workflow;
  workflows?: Workflow[];
}>();

const emit = defineEmits(["close", "saved"]);

const activeTab = ref<"edit" | "preview" | "graph">("edit");

const frontmatterYaml = ref("");
const markdownBody = ref("");

const previewHtml = computed(() => {
  const { renderMarkdown } = useMarkdownRenderer();
  return renderMarkdown(markdownBody.value);
});

const isSaving = ref(false);
const error = ref<string | null>(null);

// Watch for changes in the workflow prop and update the local content
watch(
  () => props.workflow,
  (newWorkflow) => {
    if (newWorkflow) {
      activeTab.value = "edit";

      const data = newWorkflow.frontmatter ?? {};
      frontmatterYaml.value = yaml.dump(data, {
        noRefs: true,
        sortKeys: true,
        lineWidth: 120,
      });
      markdownBody.value = newWorkflow.content;
    }
  },
  { immediate: true },
);

function _buildRawMarkdown(): string {
  const yamlText = frontmatterYaml.value.trim();

  if (yamlText.length === 0) {
    return `${markdownBody.value ?? ""}`;
  }

  return `---\n${yamlText}\n---\n\n${markdownBody.value ?? ""}`;
}

async function _saveChanges() {
  isSaving.value = true;
  error.value = null;
  try {
    try {
      const parsed = yaml.load(frontmatterYaml.value || "");
      if (parsed !== undefined && (typeof parsed !== "object" || parsed === null)) {
        throw new Error("Frontmatter must be a YAML mapping/object");
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Invalid YAML frontmatter";
      throw new Error(message);
    }

    await $fetch("/api/workflow", {
      method: "PUT",
      body: {
        path: props.workflow.path,
        content: _buildRawMarkdown(),
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
    <div class="bg-white rounded-xl shadow-xl w-full max-w-5xl h-5/6 flex flex-col overflow-hidden">
      <div class="flex items-center justify-between gap-4 px-4 py-3 border-b bg-white">
        <div class="min-w-0">
          <h2 class="text-lg font-bold truncate">{{ workflow.title }}</h2>
          <p class="text-xs text-gray-500 truncate">{{ workflow.path }}</p>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="px-3 py-1.5 rounded-md text-sm border border-gray-200 hover:bg-gray-50"
            @click="emit('close')"
          >
            Close
          </button>
          <button
            type="button"
            class="px-3 py-1.5 rounded-md text-sm bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300"
            :disabled="isSaving"
            @click="_saveChanges"
          >
            {{ isSaving ? "Saving..." : "Save" }}
          </button>
        </div>
      </div>

      <div class="px-4 pt-3">
        <div class="inline-flex rounded-lg bg-gray-100 p-1">
          <button
            type="button"
            class="px-3 py-1.5 text-sm rounded-md"
            :class="activeTab === 'edit' ? 'bg-white shadow' : 'text-gray-600 hover:text-gray-900'"
            @click="activeTab = 'edit'"
          >
            Edit
          </button>
          <button
            type="button"
            class="px-3 py-1.5 text-sm rounded-md"
            :class="activeTab === 'preview' ? 'bg-white shadow' : 'text-gray-600 hover:text-gray-900'"
            @click="activeTab = 'preview'"
          >
            Preview
          </button>
          <button
            type="button"
            class="px-3 py-1.5 text-sm rounded-md"
            :class="activeTab === 'graph' ? 'bg-white shadow' : 'text-gray-600 hover:text-gray-900'"
            @click="activeTab = 'graph'"
          >
            Graph
          </button>
        </div>
      </div>

      <div class="flex-1 min-h-0 p-4">
        <div v-if="activeTab === 'edit'" class="grid grid-rows-[auto,1fr] gap-3 h-full">
          <div>
            <div class="text-xs font-semibold text-gray-600 mb-1">Frontmatter (YAML)</div>
            <textarea
              v-model="frontmatterYaml"
              class="w-full h-28 p-3 border rounded-lg font-mono text-xs resize-none"
              spellcheck="false"
              placeholder="title: ...\ndescription: ..."
            />
          </div>

          <div class="min-h-0">
            <div class="text-xs font-semibold text-gray-600 mb-1">Markdown</div>
            <textarea
              v-model="markdownBody"
              class="w-full h-full p-3 border rounded-lg font-mono text-sm resize-none"
              spellcheck="false"
              placeholder="Write your workflow markdown..."
            />
          </div>
        </div>

        <div v-else-if="activeTab === 'preview'" class="h-full overflow-auto">
          <div class="prose prose-sm max-w-none bg-white rounded-lg border p-4" v-html="previewHtml" />
        </div>

        <div v-else class="h-full">
          <div class="h-full rounded-lg border bg-white p-3">
            <WorkflowGraph
              :workflows="props.workflows ?? [props.workflow]"
              :selected-workflow-id="props.workflow.id"
            />
          </div>
        </div>
      </div>

      <div class="px-4 py-3 border-t bg-white flex items-center justify-between">
        <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>
        <p v-else class="text-xs text-gray-500">
          Tip: Use the Preview tab to confirm formatting before saving.
        </p>
        <div class="text-xs text-gray-400">Last updated: {{ workflow.lastUpdated }}</div>
      </div>
    </div>
  </div>
</template>
