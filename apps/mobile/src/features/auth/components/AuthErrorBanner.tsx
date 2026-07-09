import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/providers';

interface AuthErrorBannerProps {
  message: string;
}

export function AuthErrorBanner({ message }: AuthErrorBannerProps) {
  const { colors, typography, spacing, borderRadius } = useTheme();

  return (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: colors.error.light,
          borderColor: colors.error.main,
          borderRadius: borderRadius.md,
          padding: spacing.md,
          marginBottom: spacing.lg,
        },
      ]}
    >
      <Text style={[typography.bodySmall, { color: colors.error.dark }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderWidth: 1,
  },
});
