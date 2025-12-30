import { fromHighlighter } from "@shikijs/markdown-it/core";
import MarkdownIt from "markdown-it";
import { createHighlighterCore } from "shiki/core";
import { createOnigurumaEngine } from "shiki/engine/oniguruma";

let _renderPromise: Promise<(markdown: string) => string> | null = null;

async function _createRenderer(): Promise<(markdown: string) => string> {
  const highlighter = await createHighlighterCore({
    themes: [import("@shikijs/themes/vitesse-light")],
    langs: [
      import("@shikijs/langs/javascript"),
      import("@shikijs/langs/typescript"),
      import("@shikijs/langs/json"),
      import("@shikijs/langs/bash"),
      import("@shikijs/langs/markdown"),
    ],
    engine: createOnigurumaEngine(() => import("shiki/wasm")),
  });

  const md = new MarkdownIt({
    html: false,
    linkify: true,
    breaks: false,
  });

  md.use(fromHighlighter(highlighter as unknown as never, { theme: "vitesse-light" }));

  return (markdown: string) => md.render(markdown ?? "");
}

export default defineNuxtPlugin(async () => {
  if (!_renderPromise) {
    _renderPromise = _createRenderer();
  }

  const renderMarkdown = await _renderPromise;

  return {
    provide: {
      renderMarkdown,
    },
  };
});
