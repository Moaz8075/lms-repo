import { type ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/providers/ThemeProvider';

interface ScreenContainerProps {
  children: ReactNode;
  style?: ViewStyle;
  padded?: boolean;
  safe?: boolean;
}

export function ScreenContainer({
  children,
  style,
  padded = true,
  safe = true,
}: ScreenContainerProps) {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background.default,
          paddingTop: safe ? insets.top : 0,
          paddingBottom: safe ? insets.bottom : 0,
          paddingHorizontal: padded ? spacing.lg : 0,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
