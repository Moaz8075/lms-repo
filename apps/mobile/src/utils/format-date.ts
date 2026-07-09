export function formatDate(
  date: string | Date | null | undefined,
  options?: Intl.DateTimeFormatOptions,
): string {
  if (!date) return '—';

  const value = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(value.getTime())) return '—';

  return value.toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  });
}

export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return '—';

  const value = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(value.getTime())) return '—';

  return value.toLocaleString('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatTime(time: string | null | undefined): string {
  if (!time) return '—';

  const [hours, minutes] = time.split(':');
  const date = new Date();
  date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

  if (Number.isNaN(date.getTime())) return '—';

  return date.toLocaleTimeString('en-PK', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function toDateInputValue(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10);
}
