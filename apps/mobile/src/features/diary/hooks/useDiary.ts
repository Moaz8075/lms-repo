import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { diaryApi } from '@/api/diary.api';
import { hearingsApi } from '@/api/hearings.api';
import {
  DIARY_REFETCH_INTERVAL_MS,
  diaryKeys,
} from '@/features/diary/constants';
import type { CreateHearingPayload, UpdateHearingPayload } from '@/types';

export function useDailyDiary(date: string) {
  return useQuery({
    queryKey: diaryKeys.daily(date),
    queryFn: () => diaryApi.getDaily(date),
    enabled: !!date,
    refetchInterval: DIARY_REFETCH_INTERVAL_MS,
  });
}

export function useUpcomingDiary(days = 14) {
  return useQuery({
    queryKey: diaryKeys.upcoming(days),
    queryFn: () => diaryApi.getUpcoming(days),
    refetchInterval: DIARY_REFETCH_INTERVAL_MS,
  });
}

export function useDiaryCalendar(month: string) {
  return useQuery({
    queryKey: diaryKeys.calendar(month),
    queryFn: () => diaryApi.getCalendar(month),
    enabled: !!month,
  });
}

export function useDiaryEntry(hearingId: string) {
  return useQuery({
    queryKey: diaryKeys.entry(hearingId),
    queryFn: () => diaryApi.getEntry(hearingId),
    enabled: !!hearingId,
  });
}

export function useCreateHearing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateHearingPayload) => hearingsApi.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: diaryKeys.all });
    },
  });
}

export function useUpdateHearing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateHearingPayload;
    }) => hearingsApi.update(id, payload),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: diaryKeys.all });
      void queryClient.invalidateQueries({
        queryKey: diaryKeys.entry(variables.id),
      });
    },
  });
}
