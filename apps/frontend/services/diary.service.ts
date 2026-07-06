import { api, unwrap } from './api';
import type { DailyDiaryResponse, UpcomingDiaryResponse } from '@/types';

export const diaryService = {
  getDaily: (date: string, caseId?: string) =>
    unwrap<DailyDiaryResponse>(
      api.get('/diary', { params: { date, ...(caseId ? { caseId } : {}) } }),
    ),

  getUpcoming: (caseId?: string, days = 30) =>
    unwrap<UpcomingDiaryResponse>(
      api.get('/diary/upcoming', { params: { ...(caseId ? { caseId } : {}), days } }),
    ),
};
