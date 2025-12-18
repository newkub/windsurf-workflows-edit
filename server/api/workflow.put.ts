import { defineEventHandler, readBody, type H3Event } from "h3";
import { updateWorkflow } from "../utils/workflowHandler";

export default defineEventHandler(async (event: H3Event) => {
  try {
    const { path, content } = await readBody(event);

    if (!path || typeof content !== "string") {
      return new Response(JSON.stringify({ error: "Invalid request body" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await updateWorkflow(path, content);

    return { success: true };
  } catch (error: unknown) {
    const isError = error instanceof Error;
    const isForbidden = isError && error.message === "Access denied";
    console.error("Error in /api/workflow:", error);
    return new Response(
      JSON.stringify({
        error: isError ? error.message : "Could not write to workflow file",
      }),
      {
        status: isForbidden ? 403 : 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
});
