export function renderHelp(): string {
  return [
    "windsurf-workflows <command>",
    "",
    "Commands:",
    "  make-completely   Interactive workflow generator",
    "",
    "Flags:",
    "  --id=<id> --title=<title> --description=<desc> --overwrite",
    "",
    "Env:",
    "  WINDSURF_WORKFLOWS_DIR   Target dir (defaults to ~/.codeium/windsurf/global_workflows)",
    "",
  ].join("\n");
}
