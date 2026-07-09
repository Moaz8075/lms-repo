import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/providers';
import { formatTime } from '@/utils/format-date';
import type { DashboardHearingCard } from '@/types/dashboard';

interface HearingCardProps {
  hearing: DashboardHearingCard;
  onCheckIn?: (hearingId: string) => void;
}

export function HearingCard({ hearing, onCheckIn }: HearingCardProps) {
  const { typography, colors, borderRadius, spacing, shadows } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.background.paper,
          borderRadius: borderRadius.lg,
          ...shadows.sm,
        },
      ]}
    >
      <View style={[styles.accent, { backgroundColor: colors.primary.main }]} />

      <View style={{ flex: 1, padding: spacing.lg }}>
        <View style={styles.topRow}>
          {hearing.courtName ? (
            <View style={[styles.badge, { backgroundColor: colors.primary.light }]}>
              <Text style={[typography.caption, { color: colors.primary.dark, fontWeight: '700' }]}>
                {hearing.courtName.toUpperCase()}
              </Text>
            </View>
          ) : null}
          {hearing.courtRoom ? (
            <Text style={[typography.caption, { color: colors.text.secondary }]}>
              {hearing.courtRoom}
            </Text>
          ) : null}
          <Text style={[typography.label, { color: colors.primary.main, marginLeft: 'auto' }]}>
            {formatTime(hearing.hearingTime)}
          </Text>
        </View>

        <Text style={[typography.h3, { color: colors.text.primary, marginTop: 8 }]}>
          {hearing.caseTitle}
        </Text>
        <Text style={[typography.bodySmall, { color: colors.text.secondary, marginTop: 4 }]}>
          {hearing.caseNumber}
          {hearing.todayPurpose ? ` • ${hearing.todayPurpose}` : ''}
        </Text>

        <View style={styles.footer}>
          <View style={[styles.avatar, { backgroundColor: colors.neutral[200] }]}>
            <Text style={[typography.caption, { fontWeight: '700' }]}>
              {hearing.clientName.slice(0, 2).toUpperCase()}
            </Text>
          </View>
          <Pressable
            onPress={() => onCheckIn?.(hearing.hearingId)}
            style={[styles.checkIn, { backgroundColor: colors.primary.main, borderRadius: borderRadius.md }]}
          >
            <Text style={[typography.button, { color: colors.primary.contrast }]}>Check-in</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  accent: {
    borderBottomLeftRadius: 4,
    borderTopLeftRadius: 12,
    width: 4,
  },
  avatar: {
    alignItems: 'center',
    borderRadius: 14,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  badge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  card: {
    flexDirection: 'row',
    overflow: 'hidden',
  },
  checkIn: {
    marginLeft: 'auto',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
