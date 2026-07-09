import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/providers';
import {
  formatCaseStatus,
  formatCaseType,
  formatNextHearing,
  isHearingToday,
} from '@/features/cases/utils/case-format';
import type { Case } from '@/types';

interface CaseCardProps {
  caseItem: Case;
  onPress?: (caseId: string) => void;
}

export function CaseCard({ caseItem, onPress }: CaseCardProps) {
  const { typography, colors, borderRadius, spacing, shadows } = useTheme();
  const hearingToday = isHearingToday(caseItem.nextHearingDate);

  return (
    <Pressable
      onPress={() => onPress?.(caseItem.id)}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.background.paper,
          borderRadius: borderRadius.lg,
          padding: spacing.lg,
          opacity: pressed ? 0.9 : 1,
          ...shadows.sm,
        },
      ]}
    >
      <View style={styles.topRow}>
        <View style={[styles.badge, { backgroundColor: colors.primary.light }]}>
          <Text style={[typography.caption, { color: colors.primary.dark, fontWeight: '700' }]}>
            #{caseItem.caseNumber}
          </Text>
        </View>
        <Text style={{ color: colors.text.secondary }}>⋮</Text>
      </View>

      <Text style={[typography.h3, { color: colors.text.primary, marginTop: 10 }]}>
        {caseItem.title}
      </Text>
      <Text style={[typography.bodySmall, { color: colors.text.secondary, marginTop: 4 }]}>
        {formatCaseType(caseItem.caseType)}
        {caseItem.courtName ? ` • ${caseItem.courtName}` : ''}
      </Text>

      <View style={styles.metaRow}>
        <View style={styles.metaCol}>
          <Text style={[typography.caption, styles.metaLabel]}>CLIENT</Text>
          <Text style={[typography.bodySmall, { fontWeight: '600' }]}>
            {caseItem.client?.name ?? '—'}
          </Text>
        </View>
        <View style={styles.metaCol}>
          <Text style={[typography.caption, styles.metaLabel]}>STAGE</Text>
          <Text style={[typography.bodySmall, { fontWeight: '700', color: colors.primary.main }]}>
            {formatCaseStatus(caseItem.status)}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={{ fontSize: 14 }}>{hearingToday ? '⚠️' : '📅'}</Text>
        <Text
          style={[
            typography.bodySmall,
            {
              color: hearingToday ? colors.error.main : colors.text.secondary,
              fontWeight: hearingToday ? '700' : '500',
            },
          ]}
        >
          Next: {formatNextHearing(caseItem.nextHearingDate)}
        </Text>
        <Text style={[typography.label, { color: colors.primary.main, marginLeft: 'auto' }]}>
          View Case ›
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  card: {
    marginBottom: 12,
  },
  footer: {
    alignItems: 'center',
    borderTopColor: '#E5E7EB',
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
    paddingTop: 12,
  },
  metaCol: {
    flex: 1,
  },
  metaLabel: {
    color: '#9CA3AF',
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 14,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
