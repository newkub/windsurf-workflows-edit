import { renderHelp } from "./components/help";
import { parseArgv } from "./utils/argv";
import { runMakeCompletelyInteractive, runMakeCompletelyNonInteractive } from "./app";

const { command, flags } = parseArgv(process.argv);

if (!command || command === "help" || command === "--help" || command === "-h") {
  process.stdout.write(`${renderHelp()}\n`);
} else if (command === "make-completely") {
  const isNonInteractive =
    typeof flags.id === "string" ||
    typeof flags.title === "string" ||
    typeof flags.description === "string" ||
    flags.overwrite === true;

  const res = isNonInteractive
    ? await runMakeCompletelyNonInteractive(flags)
    : await runMakeCompletelyInteractive();

  if (!res.ok) {
    process.stderr.write(`${res.error.message}\n`);
    process.exitCode = 1;
  } else {
    process.stdout.write(`Created: ${res.value.filePath}\n`);
  }
} else {
  process.stderr.write(`Unknown command: ${command}\n`);
  process.stdout.write(`${renderHelp()}\n`);
  process.exitCode = 1;
}
