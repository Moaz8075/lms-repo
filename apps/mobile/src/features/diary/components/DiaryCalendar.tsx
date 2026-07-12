import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/providers';
import {
  formatHearingClock,
  formatMonthLabel,
  getMonthGrid,
  shiftMonth,
  toLocalDateString,
} from '@/features/diary/utils/diary-format';
import type { CalendarDaySummary, DiaryTimelineItem } from '@/types';

const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

interface DiaryCalendarProps {
  month: string;
  selectedDate: string;
  days: CalendarDaySummary[];
  onMonthChange: (month: string) => void;
  onSelectDate: (date: string) => void;
}

export function DiaryMonthCalendar({
  month,
  selectedDate,
  days,
  onMonthChange,
  onSelectDate,
}: DiaryCalendarProps) {
  const { typography, colors, borderRadius } = useTheme();
  const today = toLocalDateString();
  const dayMap = new Map(days.map((day) => [day.date, day]));
  const cells = getMonthGrid(month);

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: colors.background.paper,
          borderRadius: borderRadius.lg,
        },
      ]}
    >
      <View style={styles.monthRow}>
        <Text style={[typography.h3, { fontWeight: '700' }]}>{formatMonthLabel(month)}</Text>
        <View style={styles.monthNav}>
          <Pressable onPress={() => onMonthChange(shiftMonth(month, -1))} hitSlop={8}>
            <Text style={{ fontSize: 20, color: colors.primary.main }}>‹</Text>
          </Pressable>
          <Pressable onPress={() => onMonthChange(shiftMonth(month, 1))} hitSlop={8}>
            <Text style={{ fontSize: 20, color: colors.primary.main }}>›</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.weekRow}>
        {WEEKDAYS.map((day) => (
          <Text key={day} style={[typography.caption, styles.weekday]}>
            {day}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {cells.map((date, index) => {
          if (!date) {
            return <View key={`empty-${index}`} style={styles.cell} />;
          }

          const summary = dayMap.get(date);
          const selected = date === selectedDate;
          const isToday = date === today;

          return (
            <Pressable key={date} onPress={() => onSelectDate(date)} style={styles.cell}>
              <View
                style={[
                  styles.dayBubble,
                  selected && { backgroundColor: colors.primary.main },
                  !selected && isToday && { borderColor: colors.primary.main, borderWidth: 1 },
                ]}
              >
                <Text
                  style={[
                    typography.bodySmall,
                    {
                      fontWeight: '700',
                      color: selected ? colors.primary.contrast : colors.text.primary,
                    },
                  ]}
                >
                  {Number(date.slice(8))}
                </Text>
              </View>
              {summary ? (
                <View style={styles.dots}>
                  {Array.from({
                    length: Math.min(summary.hearingCount + summary.taskCount, 3),
                  }).map((_, dotIndex) => (
                    <View
                      key={dotIndex}
                      style={[
                        styles.dot,
                        {
                          backgroundColor: summary.hasUrgent
                            ? colors.error.main
                            : colors.primary.main,
                        },
                      ]}
                    />
                  ))}
                </View>
              ) : (
                <View style={styles.dotsPlaceholder} />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

interface TimelineEventCardProps {
  item: DiaryTimelineItem;
  onPress?: (id: string) => void;
}

export function TimelineEventCard({ item, onPress }: TimelineEventCardProps) {
  const { typography, colors, borderRadius, shadows } = useTheme();
  const isHearing = item.type === 'HEARING';

  return (
    <Pressable
      onPress={() => (isHearing ? onPress?.(item.id) : undefined)}
      style={[
        styles.eventCard,
        {
          backgroundColor: colors.background.paper,
          borderRadius: borderRadius.lg,
          borderLeftColor: isHearing ? colors.primary.main : colors.neutral[300],
          ...shadows.sm,
        },
      ]}
    >
      <Text style={[typography.caption, { color: colors.primary.main, fontWeight: '700' }]}>
        {formatHearingClock(item.time)}
      </Text>
      <Text style={[typography.caption, { color: colors.text.secondary, marginTop: 2 }]}>
        {isHearing ? 'HEARING' : item.taskType?.replace(/_/g, ' ') ?? 'TASK'}
      </Text>
      <Text style={[typography.body, { fontWeight: '700', marginTop: 6 }]}>
        {item.caseTitle ?? item.title}
      </Text>
      {item.courtName ? (
        <Text style={[typography.bodySmall, { color: colors.text.secondary, marginTop: 4 }]}>
          📍 {item.courtName}
        </Text>
      ) : null}
      {item.description ? (
        <Text style={[typography.bodySmall, { marginTop: 6 }]}>{item.description}</Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    alignItems: 'center',
    paddingVertical: 4,
    width: `${100 / 7}%`,
  },
  dayBubble: {
    alignItems: 'center',
    borderRadius: 10,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  dot: {
    borderRadius: 2,
    height: 4,
    width: 4,
  },
  dots: {
    flexDirection: 'row',
    gap: 2,
    height: 8,
    marginTop: 2,
  },
  dotsPlaceholder: {
    height: 8,
    marginTop: 2,
  },
  eventCard: {
    borderLeftWidth: 4,
    marginBottom: 10,
    padding: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  monthNav: {
    flexDirection: 'row',
    gap: 16,
  },
  monthRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  weekday: {
    color: '#9CA3AF',
    fontWeight: '700',
    textAlign: 'center',
    width: `${100 / 7}%`,
  },
  wrap: {
    padding: 16,
  },
});
