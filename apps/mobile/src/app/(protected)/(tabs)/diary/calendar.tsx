import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppTabHeader } from '@/components/layout/AppTabHeader';
import { DiaryMonthCalendar, TimelineEventCard } from '@/features/diary/components';
import { useDailyDiary, useDiaryCalendar } from '@/features/diary/hooks/useDiary';
import { diaryRoutes } from '@/features/diary/routes';
import {
  formatDiaryDateLabel,
  toLocalDateString,
} from '@/features/diary/utils/diary-format';
import { useAuthContext, useTheme } from '@/providers';

export default function DiaryCalendarScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuthContext();
  const { typography, colors, spacing } = useTheme();

  const today = toLocalDateString();
  const [selectedDate, setSelectedDate] = useState(today);
  const [month, setMonth] = useState(today.slice(0, 7));

  const { data: calendar, isLoading: calendarLoading } = useDiaryCalendar(month);
  const {
    data: daily,
    isLoading: dailyLoading,
    refetch,
    isRefetching,
  } = useDailyDiary(selectedDate);

  const isToday = selectedDate === today;

  if (!user) return null;

  return (
    <View style={[styles.root, { backgroundColor: colors.background.default }]}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + spacing.md,
          paddingHorizontal: spacing.lg,
          paddingBottom: insets.bottom + 100,
        }}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={() => void refetch()} />
        }
      >
        <AppTabHeader
          firstName={user.firstName}
          lastName={user.lastName}
          title="Diary Calendar"
          showBack
          onBack={() => router.back()}
        />

        {calendarLoading ? (
          <ActivityIndicator color={colors.primary.main} />
        ) : (
          <DiaryMonthCalendar
            month={month}
            selectedDate={selectedDate}
            days={calendar?.days ?? []}
            onMonthChange={setMonth}
            onSelectDate={(date) => {
              setSelectedDate(date);
              setMonth(date.slice(0, 7));
            }}
          />
        )}

        <View style={styles.dayHeader}>
          <Text style={typography.h3}>{formatDiaryDateLabel(selectedDate)}</Text>
          {isToday ? (
            <View style={[styles.todayBadge, { backgroundColor: colors.primary.light }]}>
              <Text style={[typography.caption, { color: colors.primary.dark, fontWeight: '700' }]}>
                TODAY
              </Text>
            </View>
          ) : null}
        </View>

        {dailyLoading ? (
          <ActivityIndicator color={colors.primary.main} style={{ marginTop: 16 }} />
        ) : (daily?.combinedTimeline.length ?? 0) === 0 ? (
          <Text style={[typography.bodySmall, { color: colors.text.secondary }]}>
            No hearings or tasks on this day.
          </Text>
        ) : (
          daily!.combinedTimeline.map((item) => (
            <TimelineEventCard
              key={`${item.type}-${item.id}`}
              item={item}
              onPress={(id) => router.push(diaryRoutes.entry(id))}
            />
          ))
        )}
      </ScrollView>

      <Pressable
        onPress={() =>
          router.push({
            pathname: '/(protected)/(tabs)/diary/new' as never,
            params: { date: selectedDate },
          })
        }
        style={[
          styles.fab,
          {
            backgroundColor: colors.primary.main,
            bottom: insets.bottom + 76,
          },
        ]}
      >
        <Text style={{ color: colors.primary.contrast, fontSize: 28, lineHeight: 30 }}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  dayHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
    marginTop: 20,
  },
  fab: {
    alignItems: 'center',
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    position: 'absolute',
    right: 20,
    width: 56,
  },
  root: { flex: 1 },
  todayBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
});
