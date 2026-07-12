import { useMemo } from 'react';
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
import { DiaryHearingCard } from '@/features/diary/components';
import { useDailyDiary, useUpcomingDiary } from '@/features/diary/hooks/useDiary';
import { diaryRoutes } from '@/features/diary/routes';
import {
  addDays,
  formatDiaryDateLabel,
  formatDiaryDayHeading,
  toLocalDateString,
} from '@/features/diary/utils/diary-format';
import { useAuthContext, useTheme } from '@/providers';
import type { DiaryCaseRow, UpcomingDiaryGroup } from '@/types';

export default function DiaryAgendaScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuthContext();
  const { typography, colors, spacing, borderRadius } = useTheme();

  const today = toLocalDateString();
  const tomorrow = addDays(today, 1);
  const { data: todayData, isLoading, refetch, isRefetching } = useDailyDiary(today);
  const { data: tomorrowData } = useDailyDiary(tomorrow);
  const { data: upcoming } = useUpcomingDiary(14);

  const nextWeekGroups = useMemo(() => {
    const start = addDays(today, 2);
    const end = addDays(today, 8);
    return (upcoming?.groups ?? []).filter(
      (group) => group.date >= start && group.date <= end,
    );
  }, [upcoming?.groups, today]);

  const nextWeekHearingCount = nextWeekGroups.reduce(
    (sum, group) => sum + group.items.filter((item) => item.type === 'HEARING').length,
    0,
  );

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
        <AppTabHeader firstName={user.firstName} lastName={user.lastName} />

        <View style={styles.titleRow}>
          <View>
            <Text style={typography.h2}>Diary</Text>
            <Text style={[typography.bodySmall, { color: colors.text.secondary }]}>
              Court schedule & hearings
            </Text>
          </View>
          <View style={styles.titleActions}>
            <Pressable
              onPress={() => router.push(diaryRoutes.calendar)}
              style={[styles.iconBtn, { backgroundColor: colors.primary.light }]}
            >
              <Text>📅</Text>
            </Pressable>
            <Pressable
              onPress={() => router.push(diaryRoutes.wrapUp)}
              style={[styles.iconBtn, { backgroundColor: colors.neutral[100] }]}
            >
              <Text>✅</Text>
            </Pressable>
          </View>
        </View>

        {isLoading ? (
          <ActivityIndicator color={colors.primary.main} style={{ marginTop: 24 }} />
        ) : null}

        <SectionHeader
          title="Today"
          subtitle={formatDiaryDateLabel(today)}
          actionLabel="Timeline ›"
          onAction={() => router.push(diaryRoutes.timeline)}
        />
        <HearingList
          rows={todayData?.caseRows ?? []}
          empty="No hearings scheduled for today."
          onPress={(id) => router.push(diaryRoutes.entry(id))}
        />

        <SectionHeader title="Tomorrow" subtitle={formatDiaryDateLabel(tomorrow)} />
        <HearingList
          rows={tomorrowData?.caseRows ?? []}
          empty="No hearings tomorrow."
          onPress={(id) => router.push(diaryRoutes.entry(id))}
        />

        <SectionHeader title="Next Week" subtitle={`Starts ${formatDiaryDateLabel(addDays(today, 7)).split(',')[1]?.trim() ?? ''}`} />
        <View
          style={[
            styles.nextWeekCard,
            {
              borderColor: colors.primary.main,
              borderRadius: borderRadius.lg,
              backgroundColor: colors.background.paper,
            },
          ]}
        >
          <Text style={{ fontSize: 20 }}>📆</Text>
          <View style={{ flex: 1 }}>
            <Text style={[typography.body, { fontWeight: '600' }]}>
              {nextWeekHearingCount} hearing{nextWeekHearingCount === 1 ? '' : 's'} scheduled for next week.
            </Text>
            <Pressable onPress={() => router.push(diaryRoutes.calendar)}>
              <Text style={[typography.label, { color: colors.primary.main, marginTop: 4 }]}>
                View Schedule
              </Text>
            </Pressable>
          </View>
        </View>

        {nextWeekGroups.slice(0, 3).map((group) => (
          <UpcomingPreview key={group.date} group={group} />
        ))}
      </ScrollView>

      <Pressable
        onPress={() => router.push(diaryRoutes.new)}
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

function SectionHeader({
  title,
  subtitle,
  actionLabel,
  onAction,
}: {
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const { typography, colors } = useTheme();
  return (
    <View style={styles.sectionHeader}>
      <View>
        <Text style={[typography.h3, { fontWeight: '800' }]}>{title}</Text>
        <Text style={[typography.caption, { color: colors.text.secondary }]}>{subtitle}</Text>
      </View>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction}>
          <Text style={[typography.label, { color: colors.primary.main }]}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function HearingList({
  rows,
  empty,
  onPress,
}: {
  rows: DiaryCaseRow[];
  empty: string;
  onPress: (id: string) => void;
}) {
  const { typography, colors } = useTheme();
  if (rows.length === 0) {
    return (
      <Text style={[typography.bodySmall, { color: colors.text.secondary, marginBottom: 20 }]}>
        {empty}
      </Text>
    );
  }

  return (
    <View style={{ marginBottom: 8 }}>
      {rows.map((row, index) => (
        <DiaryHearingCard
          key={row.hearingId}
          row={row}
          badge={index === 0 ? 'PRIORITY' : 'PENDING'}
          onPress={onPress}
        />
      ))}
    </View>
  );
}

function UpcomingPreview({ group }: { group: UpcomingDiaryGroup }) {
  const { typography, colors } = useTheme();
  const hearings = group.items.filter((item) => item.type === 'HEARING');
  if (hearings.length === 0) return null;

  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={[typography.caption, { color: colors.text.secondary, marginBottom: 4 }]}>
        {formatDiaryDayHeading(group.date)} · {group.label}
      </Text>
      {hearings.slice(0, 2).map((item) => (
        <Text key={item.id} style={[typography.bodySmall, { marginBottom: 2 }]}>
          {item.time ?? '—'} · {item.caseTitle ?? item.title}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    alignItems: 'center',
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    position: 'absolute',
    right: 20,
    width: 56,
  },
  iconBtn: {
    alignItems: 'center',
    borderRadius: 12,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  nextWeekCard: {
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 1.5,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    padding: 16,
  },
  root: { flex: 1 },
  sectionHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 8,
  },
  titleActions: { flexDirection: 'row', gap: 8 },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
});
