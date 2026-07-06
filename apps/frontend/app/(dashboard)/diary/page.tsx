'use client';

import { Suspense, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import { DiaryStitchHeader } from '@/components/diary/DiaryStitchHeader';
import { DiaryDayTimeline } from '@/components/diary/DiaryDayTimeline';
import { DiaryUpcomingSidebar } from '@/components/diary/DiaryUpcomingSidebar';
import { RequireAccess } from '@/components/auth/RequireAccess';
import { PermissionResource } from '@/types/permissions';
import { useDailyDiary, useUpcomingDiary } from '@/hooks/useDiary';
import { toDateInputValue } from '@/utils/format';

function DiaryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedDate = searchParams.get('date') ?? toDateInputValue();

  const { data: daily, isLoading: dailyLoading, isError } = useDailyDiary(selectedDate);
  const { data: upcoming, isLoading: upcomingLoading } = useUpcomingDiary();

  const handleDateChange = (date: string) => {
    router.push(`/diary?date=${date}`);
  };

  const timeline = daily?.combinedTimeline ?? [];

  const datesWithItems = useMemo(() => {
    const set = new Set<string>();
    for (const group of upcoming?.groups ?? []) {
      set.add(group.date);
    }
    if (timeline.length > 0) set.add(selectedDate);
    return set;
  }, [upcoming?.groups, timeline.length, selectedDate]);

  return (
    <Box sx={{ bgcolor: '#F8FAFC', borderRadius: 3, p: { xs: 2, md: 3 }, minHeight: '70vh' }}>
      <DiaryStitchHeader date={selectedDate} onChange={handleDateChange} />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <DiaryDayTimeline
            items={timeline}
            loading={dailyLoading}
            selectedDate={selectedDate}
          />
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <DiaryUpcomingSidebar
            groups={upcoming?.groups ?? []}
            loading={upcomingLoading}
            selectedDate={selectedDate}
            onDateSelect={handleDateChange}
            datesWithItems={datesWithItems}
          />
        </Grid>
      </Grid>

      {isError && (
        <Box sx={{ mt: 2, p: 2, bgcolor: '#FCE8E6', borderRadius: 2, border: '1px solid #F5C6C2' }}>
          Unable to load diary. Ensure the backend API is running.
        </Box>
      )}
    </Box>
  );
}

export default function DiaryPage() {
  return (
    <RequireAccess resource={PermissionResource.DIARY}>
      <Suspense
        fallback={
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={32} />
          </Box>
        }
      >
        <DiaryContent />
      </Suspense>
    </RequireAccess>
  );
}
