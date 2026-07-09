import { type ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '@/providers';

interface AuthScreenLayoutProps {
  children: ReactNode;
  footer?: ReactNode;
  contentStyle?: ViewStyle;
}

export function AuthScreenLayout({ children, footer, contentStyle }: AuthScreenLayoutProps) {
  const { colors, spacing } = useTheme();

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: colors.background.default }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: spacing.lg, paddingVertical: spacing['3xl'] },
          contentStyle,
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inner}>{children}</View>
        {footer ? <View style={{ marginTop: spacing.xl }}>{footer}</View> : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  inner: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
  },
});
