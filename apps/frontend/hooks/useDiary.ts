import { useQuery } from '@tanstack/react-query';
import { diaryService } from '@/services/diary.service';

export function useDailyDiary(date: string, caseId?: string) {
  return useQuery({
    queryKey: ['diary', 'daily', date, caseId],
    queryFn: () => diaryService.getDaily(date, caseId),
    enabled: !!date,
  });
}

export function useUpcomingDiary(caseId?: string, days = 30) {
  return useQuery({
    queryKey: ['diary', 'upcoming', caseId, days],
    queryFn: () => diaryService.getUpcoming(caseId, days),
  });
}
