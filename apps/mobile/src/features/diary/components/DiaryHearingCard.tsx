import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/providers';
import { formatHearingClock } from '@/features/diary/utils/diary-format';
import type { DiaryCaseRow } from '@/types';

interface DiaryHearingCardProps {
  row: DiaryCaseRow;
  badge?: 'PRIORITY' | 'PENDING' | null;
  onPress?: (hearingId: string) => void;
}

export function DiaryHearingCard({ row, badge, onPress }: DiaryHearingCardProps) {
  const { typography, colors, borderRadius, spacing, shadows } = useTheme();
  const isPriority = badge === 'PRIORITY';

  return (
    <Pressable
      onPress={() => onPress?.(row.hearingId)}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.background.paper,
          borderRadius: borderRadius.lg,
          opacity: pressed ? 0.92 : 1,
          ...shadows.sm,
        },
      ]}
    >
      <View
        style={[
          styles.accent,
          { backgroundColor: isPriority ? colors.primary.main : colors.neutral[300] },
        ]}
      />
      <View style={{ flex: 1, padding: spacing.lg }}>
        <View style={styles.topRow}>
          <Text
            style={[
              typography.label,
              { color: isPriority ? colors.primary.main : colors.text.secondary, fontWeight: '700' },
            ]}
          >
            {formatHearingClock(row.hearingTime)}
          </Text>
          {badge ? (
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: isPriority ? '#E6F4EA' : '#FEF7E0',
                },
              ]}
            >
              <Text
                style={[
                  typography.caption,
                  {
                    color: isPriority ? colors.success.dark : colors.warning.dark,
                    fontWeight: '700',
                  },
                ]}
              >
                {badge}
              </Text>
            </View>
          ) : null}
        </View>

        <Text style={[typography.h3, { marginTop: 8 }]}>{row.caseTitle}</Text>
        <Text style={[typography.bodySmall, { color: colors.text.secondary, marginTop: 2 }]}>
          #{row.caseNumber}
        </Text>

        <View style={styles.metaRow}>
          <View style={{ flex: 1 }}>
            <Text style={[typography.caption, styles.metaLabel]}>COURT</Text>
            <Text style={[typography.bodySmall, { fontWeight: '600' }]}>
              {[row.courtName, row.courtRoom].filter(Boolean).join(', ') || '—'}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[typography.caption, styles.metaLabel]}>HEARING ACTION</Text>
            <Text
              style={[
                typography.bodySmall,
                { fontWeight: '700', color: isPriority ? colors.primary.main : colors.text.primary },
              ]}
            >
              {row.todayPurpose ?? 'Hearing'}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={[typography.caption, { color: colors.text.secondary }]}>
            Client: {row.clientName}
          </Text>
          <View style={[styles.chevron, { backgroundColor: colors.neutral[100] }]}>
            <Text style={{ color: colors.text.secondary }}>›</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  accent: {
    borderBottomLeftRadius: 16,
    borderTopLeftRadius: 16,
    width: 4,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  card: {
    flexDirection: 'row',
    marginBottom: 12,
    overflow: 'hidden',
  },
  chevron: {
    alignItems: 'center',
    borderRadius: 14,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  metaLabel: {
    color: '#9CA3AF',
    fontWeight: '700',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
