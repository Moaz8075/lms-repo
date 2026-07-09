import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/providers';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  const { colors, typography, spacing, borderRadius } = useTheme();

  return (
    <View style={[styles.container, { marginBottom: spacing['2xl'] }]}>
      <View
        style={[
          styles.logoMark,
          {
            backgroundColor: colors.primary.main,
            borderRadius: borderRadius.md,
            marginBottom: spacing.lg,
          },
        ]}
      >
        <Text style={[typography.h3, { color: colors.primary.contrast }]}>LE</Text>
      </View>
      <Text style={typography.h2}>{title}</Text>
      <Text style={[typography.bodySmall, { marginTop: spacing.xs, color: colors.text.secondary }]}>
        {subtitle}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
  },
  logoMark: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
