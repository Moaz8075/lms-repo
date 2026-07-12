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
import { TimelineEventCard } from '@/features/diary/components';
import { useDailyDiary } from '@/features/diary/hooks/useDiary';
import { diaryRoutes } from '@/features/diary/routes';
import {
  formatDiaryDateLabel,
  formatHearingClock,
  toLocalDateString,
} from '@/features/diary/utils/diary-format';
import { useAuthContext, useTheme } from '@/providers';

export default function DiaryTimelineScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuthContext();
  const { typography, colors, spacing } = useTheme();
  const today = toLocalDateString();
  const { data, isLoading, refetch, isRefetching } = useDailyDiary(today);

  const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();

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
          title="Daily Timeline"
          showBack
          onBack={() => router.back()}
        />

        <View style={styles.headerRow}>
          <View>
            <Text style={typography.h2}>Daily Timeline</Text>
            <Text style={[typography.bodySmall, { color: colors.text.secondary }]}>
              {formatDiaryDateLabel(today)}
            </Text>
          </View>
          <Pressable
            onPress={() => router.push(diaryRoutes.new)}
            style={[styles.newBtn, { backgroundColor: colors.primary.main }]}
          >
            <Text style={[typography.caption, { color: colors.primary.contrast, fontWeight: '700' }]}>
              + New Entry
            </Text>
          </Pressable>
        </View>

        {isLoading ? <ActivityIndicator color={colors.primary.main} /> : null}

        <View style={styles.timeline}>
          <View style={[styles.line, { backgroundColor: colors.primary.light }]} />
          {(data?.combinedTimeline ?? []).map((item) => {
            const [h, m] = (item.time ?? '00:00').split(':').map(Number);
            const itemMinutes = h * 60 + m;
            const showNow = itemMinutes > nowMinutes - 30 && itemMinutes <= nowMinutes;

            return (
              <View key={`${item.type}-${item.id}`}>
                {showNow ? (
                  <View style={styles.nowRow}>
                    <View style={[styles.nowPill, { backgroundColor: colors.primary.main }]}>
                      <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>NOW</Text>
                    </View>
                    <View style={[styles.nowLine, { backgroundColor: colors.primary.main }]} />
                  </View>
                ) : null}
                <View style={styles.itemRow}>
                  <Text style={[typography.caption, styles.timeLabel]}>
                    {formatHearingClock(item.time)}
                  </Text>
                  <View style={[styles.node, { backgroundColor: colors.primary.main }]} />
                  <View style={{ flex: 1 }}>
                    <TimelineEventCard
                      item={item}
                      onPress={(id) => router.push(diaryRoutes.entry(id))}
                    />
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {(data?.combinedTimeline.length ?? 0) === 0 && !isLoading ? (
          <Text style={[typography.bodySmall, { color: colors.text.secondary }]}>
            No timeline items for today.
          </Text>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: 'row',
    gap: 10,
  },
  line: {
    bottom: 0,
    left: 52,
    position: 'absolute',
    top: 0,
    width: 2,
  },
  newBtn: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  node: {
    borderRadius: 6,
    height: 12,
    marginTop: 18,
    width: 12,
  },
  nowLine: {
    flex: 1,
    height: 2,
  },
  nowPill: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  nowRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
    marginLeft: 40,
  },
  root: { flex: 1 },
  timeLabel: {
    color: '#6B7280',
    fontWeight: '700',
    marginTop: 16,
    width: 42,
  },
  timeline: {
    position: 'relative',
  },
});
