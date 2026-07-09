import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/providers';

interface PlaceholderTabScreenProps {
  title: string;
  subtitle?: string;
}

export function PlaceholderTabScreen({ title, subtitle }: PlaceholderTabScreenProps) {
  const { typography, colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background.default,
          paddingTop: insets.top + spacing.lg,
          paddingHorizontal: spacing.lg,
        },
      ]}
    >
      <Text style={typography.h2}>{title}</Text>
      <Text style={[typography.body, { color: colors.text.secondary, marginTop: spacing.sm }]}>
        {subtitle ?? 'Coming soon'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
