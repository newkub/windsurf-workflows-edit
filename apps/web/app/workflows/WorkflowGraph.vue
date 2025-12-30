<script setup lang="ts">
import { computed, ref } from "vue";
import type { Workflow } from "@shared/types/workflow";
import { buildWorkflowGraph } from "./workflowGraph";

const props = defineProps<{
  workflows: Workflow[];
  selectedWorkflowId?: string;
}>();

const query = ref("");

const graph = computed(() => buildWorkflowGraph(props.workflows));

const filteredNodes = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (q.length === 0) return graph.value.nodes;
  return graph.value.nodes.filter(
    (n) => n.id.toLowerCase().includes(q) || n.title.toLowerCase().includes(q),
  );
});

const filteredNodeIds = computed(() => new Set(filteredNodes.value.map((n) => n.id)));

const filteredEdges = computed(() => {
  const keep = filteredNodeIds.value;
  return graph.value.edges.filter((e) => keep.has(e.from) && keep.has(e.to));
});
</script>

<template>
  <div class="h-full flex flex-col gap-3">
    <div class="flex items-center justify-between gap-3">
      <input
        v-model="query"
        type="text"
        placeholder="Search workflows..."
        class="w-full max-w-md px-3 py-2 border rounded-lg text-sm"
      />
      <div class="text-xs text-gray-500 whitespace-nowrap">
        Nodes: {{ filteredNodes.length }} | Edges: {{ filteredEdges.length }}
      </div>
    </div>

    <div class="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-3">
      <div class="rounded-lg border bg-white overflow-auto">
        <div class="px-3 py-2 border-b text-xs font-semibold text-gray-600">Relations</div>
        <div class="p-3">
          <div v-if="filteredEdges.length === 0" class="text-sm text-gray-500">No relations found.</div>
          <div v-else class="space-y-2">
            <div
              v-for="e in filteredEdges"
              :key="`${e.from}-->${e.to}`"
              class="rounded-md border border-gray-100 px-3 py-2"
            >
              <div class="text-sm font-semibold truncate">
                {{ e.from }}
                <span class="text-gray-400">→</span>
                {{ e.to }}
              </div>
              <div class="text-xs text-gray-500 truncate" v-if="e.label">{{ e.label }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-lg border bg-white overflow-auto">
        <div class="px-3 py-2 border-b text-xs font-semibold text-gray-600">Workflows</div>
        <div class="p-3 space-y-2">
          <div
            v-for="n in filteredNodes"
            :key="n.id"
            class="rounded-md border px-3 py-2"
            :class="n.id === selectedWorkflowId ? 'border-blue-300 bg-blue-50' : 'border-gray-100'"
          >
            <div class="text-sm font-semibold truncate">/{{ n.id }}</div>
            <div class="text-xs text-gray-600 truncate">{{ n.title }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
