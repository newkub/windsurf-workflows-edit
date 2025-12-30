export type ParsedArgv = {
  command: string | null;
  flags: Record<string, string | boolean>;
};

export function parseArgv(argv: string[]): ParsedArgv {
  const args = argv.slice(2);
  const command = args[0] ?? null;

  const flags: Record<string, string | boolean> = {};

  for (const a of args.slice(1)) {
    if (!a.startsWith("--")) continue;
    const [k, v] = a.slice(2).split("=");
    if (!k) continue;
    flags[k] = v === undefined ? true : v;
  }

  return { command, flags };
}
