export const diaryKeys = {
  all: ['diary'] as const,
  daily: (date: string) => ['diary', 'daily', date] as const,
  upcoming: (days: number) => ['diary', 'upcoming', days] as const,
  calendar: (month: string) => ['diary', 'calendar', month] as const,
  entry: (hearingId: string) => ['diary', 'entry', hearingId] as const,
};

export const DIARY_REFETCH_INTERVAL_MS = 30_000;
