import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/providers';
import { formatRelativeTime } from '@/utils/relative-time';
import type { DashboardRecentCase } from '@/types/dashboard';

interface RecentCaseItemProps {
  caseItem: DashboardRecentCase;
  onPress?: (caseId: string) => void;
}

export function RecentCaseItem({ caseItem, onPress }: RecentCaseItemProps) {
  const { typography, colors, borderRadius, spacing } = useTheme();

  return (
    <Pressable
      onPress={() => onPress?.(caseItem.id)}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.neutral[100],
          borderRadius: borderRadius.lg,
          padding: spacing.lg,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View style={[styles.folder, { backgroundColor: colors.background.paper }]}>
        <Text>📁</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={[typography.body, { fontWeight: '700', color: colors.text.primary }]}>
          {caseItem.title}
        </Text>
        <Text style={[typography.caption, { color: colors.text.secondary, marginTop: 2 }]}>
          Last updated {formatRelativeTime(caseItem.updatedAt)}
        </Text>
      </View>

      <Text style={{ color: colors.text.secondary, fontSize: 18 }}>⋮</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  folder: {
    alignItems: 'center',
    borderRadius: 10,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
});
