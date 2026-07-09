import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { useTheme } from '@/providers';

interface CheckboxFieldProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export function CheckboxField({ label, value, onValueChange }: CheckboxFieldProps) {
  const { colors, typography, spacing } = useTheme();

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: value }}
      onPress={() => onValueChange(!value)}
      style={[styles.row, { marginBottom: spacing.lg }]}
    >
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.neutral[300], true: colors.primary.light }}
        thumbColor={value ? colors.primary.main : colors.neutral.white}
      />
      <Text style={[typography.bodySmall, { marginLeft: spacing.sm, color: colors.text.primary }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
