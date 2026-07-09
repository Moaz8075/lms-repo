import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/providers';

interface AuthSuccessBannerProps {
  message: string;
}

export function AuthSuccessBanner({ message }: AuthSuccessBannerProps) {
  const { colors, typography, spacing, borderRadius } = useTheme();

  return (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: colors.success.light,
          borderColor: colors.success.main,
          borderRadius: borderRadius.md,
          padding: spacing.md,
          marginBottom: spacing.lg,
        },
      ]}
    >
      <Text style={[typography.bodySmall, { color: colors.success.dark }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderWidth: 1,
  },
});
