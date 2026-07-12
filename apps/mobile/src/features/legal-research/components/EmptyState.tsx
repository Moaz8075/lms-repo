import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/providers';

interface EmptyStateProps {
  icon?: string;
  title: string;
  subtitle?: string;
}

export function EmptyState({
  icon = '📚',
  title,
  subtitle,
}: EmptyStateProps) {
  const { colors, typography, spacing, borderRadius } = useTheme();

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: colors.background.paper,
          borderRadius: borderRadius.lg,
          borderColor: colors.border.default,
          padding: spacing.xl,
          marginTop: spacing.lg,
        },
      ]}
    >
      <Text style={{ fontSize: 36, textAlign: 'center' }}>{icon}</Text>
      <Text
        style={[
          typography.h3,
          { textAlign: 'center', marginTop: spacing.md, fontSize: 16 },
        ]}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text
          style={[
            typography.bodySmall,
            {
              color: colors.text.secondary,
              textAlign: 'center',
              marginTop: spacing.sm,
            },
          ]}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderWidth: 1, borderStyle: 'dashed' },
});
