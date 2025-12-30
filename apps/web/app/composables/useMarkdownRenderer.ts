type MarkdownRenderer = {
  renderMarkdown: (markdown: string) => string;
};

export function useMarkdownRenderer(): MarkdownRenderer {
  const nuxtApp = useNuxtApp() as unknown as {
    $renderMarkdown?: (markdown: string) => string;
  };

  function renderMarkdown(markdown: string): string {
    const fn = nuxtApp.$renderMarkdown;
    if (typeof fn !== "function") return "";
    return fn(markdown);
  }

  return { renderMarkdown };
}
