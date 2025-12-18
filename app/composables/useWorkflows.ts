import { ref } from "vue";
import type { Ref } from "vue";
import type { Workflow } from "../../shared/types/workflow";

export function useWorkflows() {
  const {
    data: workflows,
    pending,
    error,
    refresh,
  } = useFetch<Workflow[]>("/api/workflows", {
    transform: (data: Workflow[]) =>
      Array.isArray(data) ? data.filter((w) => w?.id) : [],
    default: () => [],
  });

  const isModalOpen = ref(false);
  const selectedWorkflow: Ref<Workflow | null> = ref(null);

  function openModal(workflow: Workflow) {
    selectedWorkflow.value = workflow;
    isModalOpen.value = true;
  }

  function closeModal() {
    isModalOpen.value = false;
    selectedWorkflow.value = null;
  }

  async function handleSaved() {
    closeModal();
    await refresh();
  }

  return {
    workflows,
    pending,
    error,
    isModalOpen,
    selectedWorkflow,
    openModal,
    closeModal,
    handleSaved,
  };
}
