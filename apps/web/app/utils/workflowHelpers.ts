export function formatDateTime(isoString: string): string {
  if (!isoString) return 'N/A';
  return new Date(isoString).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function renderCardPreview(markdown: string, renderMarkdown: (markdown: string) => string): string {
  const slice = (markdown ?? "").trim().slice(0, 240);
  return renderMarkdown(slice.length > 0 ? slice : "");
}
