/** Short label for a highlight — never the full selected paragraph. */
export function suggestNoteTitle(text: string): string {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (!cleaned) return '';

  const words = cleaned.split(' ');
  const isShortHighlight = cleaned.length <= 40 && words.length <= 5;

  if (isShortHighlight) {
    return cleaned;
  }

  const MAX_WORDS = 7;
  const MAX_LEN = 48;

  let title = words.slice(0, MAX_WORDS).join(' ');
  if (title.length > MAX_LEN) {
    title = title.slice(0, MAX_LEN);
    const lastSpace = title.lastIndexOf(' ');
    if (lastSpace > 20) {
      title = title.slice(0, lastSpace);
    }
    title = title.trim();
  }

  if (title === cleaned) {
    title = words.slice(0, 4).join(' ');
  }

  return `${title.replace(/[.,;:!?]$/, '')}…`;
}
