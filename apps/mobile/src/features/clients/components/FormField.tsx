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
  required?: boolean;
}

export function FormField({
  label,
  error,
  required,
  multiline,
  style,
  ...props
}: FormFieldProps) {
  const { colors, typography, borderRadius, spacing } = useTheme();

  return (
    <View style={{ marginBottom: spacing.md }}>
      <Text
        style={[
          typography.caption,
          {
            color: colors.text.secondary,
            fontWeight: '700',
            marginBottom: 6,
            letterSpacing: 0.4,
            textTransform: 'uppercase',
          },
        ]}
      >
        {label}
        {required ? ' *' : ''}
      </Text>
      <TextInput
        {...props}
        multiline={multiline}
        placeholderTextColor={colors.text.disabled}
        style={[
          typography.body,
          styles.input,
          {
            backgroundColor: colors.background.paper,
            borderColor: error ? colors.error.main : colors.border.default,
            borderRadius: borderRadius.md,
            color: colors.text.primary,
            minHeight: multiline ? 96 : 48,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            textAlignVertical: multiline ? 'top' : 'center',
          },
          style,
        ]}
      />
      {error ? (
        <Text
          style={[
            typography.caption,
            { color: colors.error.main, marginTop: 4 },
          ]}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  input: { borderWidth: 1 },
});
