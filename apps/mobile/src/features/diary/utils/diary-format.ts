export function toLocalDateString(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addDays(dateStr: string, days: number): string {
  const date = new Date(`${dateStr}T12:00:00`);
  date.setDate(date.getDate() + days);
  return toLocalDateString(date);
}

export function formatDiaryDayHeading(dateStr: string): string {
  const today = toLocalDateString();
  const tomorrow = addDays(today, 1);

  if (dateStr === today) return 'Today';
  if (dateStr === tomorrow) return 'Tomorrow';

  return new Date(`${dateStr}T12:00:00`).toLocaleDateString('en-PK', {
    weekday: 'long',
  });
}

export function formatDiaryDateLabel(dateStr: string): string {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString('en-PK', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

export function formatMonthLabel(month: string): string {
  const [year, monthNum] = month.split('-').map(Number);
  return new Date(year, monthNum - 1, 1).toLocaleDateString('en-PK', {
    month: 'long',
    year: 'numeric',
  });
}

export function shiftMonth(month: string, delta: number): string {
  const [year, monthNum] = month.split('-').map(Number);
  const date = new Date(year, monthNum - 1 + delta, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function getMonthGrid(month: string): Array<string | null> {
  const [year, monthNum] = month.split('-').map(Number);
  const first = new Date(year, monthNum - 1, 1);
  const daysInMonth = new Date(year, monthNum, 0).getDate();
  // Monday-first calendar
  const startOffset = (first.getDay() + 6) % 7;
  const cells: Array<string | null> = Array.from({ length: startOffset }, () => null);

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(
      `${year}-${String(monthNum).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    );
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

export function formatHearingClock(time: string | null | undefined): string {
  if (!time) return '—';
  const [hours, minutes] = time.split(':');
  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);
  return date.toLocaleTimeString('en-PK', {
    hour: '2-digit',
    minute: '2-digit',
  });
}
