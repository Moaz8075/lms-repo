export function formatCaseType(value: string): string {
  return value
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatCaseStatus(value: string): string {
  switch (value) {
    case 'OPEN':
      return 'Pre-trial';
    case 'IN_PROGRESS':
      return 'In Progress';
    case 'CLOSED':
      return 'Closed';
    case 'ARCHIVED':
      return 'Archived';
    default:
      return formatCaseType(value);
  }
}

export function getCaseStatusBadgeColor(status: string): {
  bg: string;
  text: string;
} {
  switch (status) {
    case 'OPEN':
    case 'IN_PROGRESS':
      return { bg: '#E8F0FE', text: '#1A73E8' };
    case 'CLOSED':
      return { bg: '#F3F4F6', text: '#6B7280' };
    default:
      return { bg: '#FEF7E0', text: '#B45309' };
  }
}

export function isHearingToday(nextHearingDate: string | null | undefined): boolean {
  if (!nextHearingDate) return false;
  const hearing = new Date(nextHearingDate);
  const now = new Date();
  return (
    hearing.getUTCFullYear() === now.getUTCFullYear() &&
    hearing.getUTCMonth() === now.getUTCMonth() &&
    hearing.getUTCDate() === now.getUTCDate()
  );
}

export function formatNextHearing(
  nextHearingDate: string | null | undefined,
  time?: string | null,
): string {
  if (!nextHearingDate) return 'Not scheduled';

  if (isHearingToday(nextHearingDate)) {
    return time ? `Today, ${formatHearingTime(time)}` : 'Today';
  }

  const date = new Date(nextHearingDate);
  const formatted = date.toLocaleDateString('en-PK', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  return time ? `${formatted} • ${formatHearingTime(time)}` : formatted;
}

function formatHearingTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const value = new Date();
  value.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
  return value.toLocaleTimeString('en-PK', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const CASE_TYPE_OPTIONS = [
  'CIVIL',
  'CRIMINAL',
  'FAMILY',
  'CORPORATE',
  'CONSTITUTIONAL',
  'REVENUE',
  'OTHER',
] as const;

export const CASE_STATUS_FILTER_OPTIONS = [
  { label: 'Active', value: 'IN_PROGRESS' },
  { label: 'Open', value: 'OPEN' },
  { label: 'Closed', value: 'CLOSED' },
] as const;
