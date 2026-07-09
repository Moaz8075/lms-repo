import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/providers';
import type { DashboardTaskItem } from '@/types/dashboard';

interface TaskListItemProps {
  task: DashboardTaskItem;
  loading?: boolean;
  onToggle?: (taskId: string, completed: boolean) => void;
}

export function TaskListItem({ task, loading, onToggle }: TaskListItemProps) {
  const { typography, colors, borderRadius } = useTheme();
  const isCompleted = task.status === 'COMPLETED';

  return (
    <Pressable
      onPress={() => onToggle?.(task.id, !isCompleted)}
      disabled={loading}
      style={({ pressed }) => [
        styles.row,
        {
          borderBottomColor: colors.border.default,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <View
        style={[
          styles.checkbox,
          {
            borderColor: isCompleted ? colors.primary.main : colors.neutral[300],
            backgroundColor: isCompleted ? colors.primary.main : 'transparent',
            borderRadius: borderRadius.sm,
          },
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={colors.primary.contrast} />
        ) : isCompleted ? (
          <Text style={{ color: colors.primary.contrast, fontSize: 12, fontWeight: '700' }}>✓</Text>
        ) : null}
      </View>

      <Text
        style={[
          typography.body,
          {
            color: isCompleted ? colors.text.disabled : colors.text.primary,
            flex: 1,
            textDecorationLine: isCompleted ? 'line-through' : 'none',
          },
        ]}
      >
        {task.title}
      </Text>

      <Text style={{ color: colors.text.secondary }}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  checkbox: {
    alignItems: 'center',
    borderWidth: 2,
    height: 22,
    justifyContent: 'center',
    width: 22,
  },
  row: {
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
});
