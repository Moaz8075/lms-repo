import { apiClient, unwrap } from '@/api/axios';
import type {
  DailyDiary,
  DiaryCalendar,
  DiaryEntryDetail,
  UpcomingDiary,
} from '@/types';

export const diaryApi = {
  getDaily: (date: string, caseId?: string) =>
    unwrap<DailyDiary>(
      apiClient.get('/diary', { params: { date, caseId } }),
    ),

  getUpcoming: (days = 30, caseId?: string) =>
    unwrap<UpcomingDiary>(
      apiClient.get('/diary/upcoming', { params: { days, caseId } }),
    ),

  getCalendar: (month: string) =>
    unwrap<DiaryCalendar>(
      apiClient.get('/diary/calendar', { params: { month } }),
    ),

  getEntry: (hearingId: string) =>
    unwrap<DiaryEntryDetail>(apiClient.get(`/diary/entries/${hearingId}`)),
};
