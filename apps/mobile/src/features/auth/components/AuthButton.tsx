import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
} from 'react-native';

import { useTheme } from '@/providers';

interface AuthButtonProps extends PressableProps {
  label: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
}

export function AuthButton({
  label,
  loading = false,
  disabled,
  variant = 'primary',
  style,
  ...props
}: AuthButtonProps) {
  const { colors, typography, spacing, borderRadius } = useTheme();
  const isDisabled = disabled || loading;
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      style={(state) => {
        const baseStyle = {
          backgroundColor: isPrimary ? colors.primary.main : colors.background.paper,
          borderColor: isPrimary ? colors.primary.main : colors.border.default,
          borderRadius: borderRadius.md,
          paddingVertical: spacing.md,
          opacity: isDisabled ? 0.6 : state.pressed ? 0.92 : 1,
        };

        if (typeof style === 'function') {
          return [styles.button, baseStyle, style(state)];
        }

        return [styles.button, baseStyle, style];
      }}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? colors.primary.contrast : colors.primary.main} />
      ) : (
        <Text
          style={[
            typography.button,
            { color: isPrimary ? colors.primary.contrast : colors.primary.main },
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    minHeight: 48,
  },
});
