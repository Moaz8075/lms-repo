import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/providers';
import type { DashboardStats } from '@/types/dashboard';

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const { typography, colors, borderRadius, spacing } = useTheme();

  return (
    <View style={styles.row}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.neutral[100],
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
          },
        ]}
      >
        <Text style={[typography.caption, styles.label, { color: colors.text.secondary }]}>
          HEARINGS
        </Text>
        <Text style={[typography.h3, { color: colors.text.primary, marginTop: 4 }]}>
          {stats.hearingsToday} Today
        </Text>
      </View>

      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.neutral[100],
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
          },
        ]}
      >
        <Text style={[typography.caption, styles.label, { color: colors.text.secondary }]}>
          TASKS
        </Text>
        <Text style={[typography.h3, { color: colors.text.primary, marginTop: 4 }]}>
          {stats.tasksRemaining} Remaining
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
  },
  label: {
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
});
