import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useTheme } from '@/providers/ThemeProvider';

export function LoadingOverlay() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background.default }]}>
      <ActivityIndicator size="large" color={colors.primary.main} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
