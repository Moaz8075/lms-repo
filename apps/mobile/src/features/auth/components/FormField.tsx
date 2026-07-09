import { forwardRef } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';

import { useTheme } from '@/providers';

interface FormFieldProps extends TextInputProps {
  label: string;
  error?: string;
}

export const FormField = forwardRef<TextInput, FormFieldProps>(function FormField(
  { label, error, style, ...props },
  ref,
) {
  const { colors, typography, spacing, borderRadius } = useTheme();
  const hasError = Boolean(error);

  return (
    <View style={{ marginBottom: spacing.lg }}>
      <Text style={[typography.label, { marginBottom: spacing.xs, color: colors.text.primary }]}>
        {label}
      </Text>
      <TextInput
        ref={ref}
        placeholderTextColor={colors.text.disabled}
        style={[
          styles.input,
          typography.body,
          {
            backgroundColor: colors.background.paper,
            borderColor: hasError ? colors.error.main : colors.border.default,
            color: colors.text.primary,
            borderRadius: borderRadius.md,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.md,
          },
          style,
        ]}
        {...props}
      />
      {hasError ? (
        <Text style={[typography.caption, { color: colors.error.main, marginTop: spacing.xs }]}>
          {error}
        </Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    minHeight: 48,
  },
});
