import { defineEventHandler } from "h3";
import { getWorkflows } from "../utils/workflowHandler";

export default defineEventHandler(async () => {
  try {
    return await getWorkflows();
  } catch (error: unknown) {
    const isError = error instanceof Error;
    console.error("Error in /api/workflows:", error);
    return new Response(
      JSON.stringify({
        error: isError ? error.message : "Could not read workflow files",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
});
