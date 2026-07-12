import { StyleSheet, TextInput, View } from 'react-native';

import { useTheme } from '@/providers';

interface SearchBarProps {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search…',
}: SearchBarProps) {
  const { colors, typography, borderRadius, spacing } = useTheme();

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: colors.background.paper,
          borderColor: colors.border.default,
          borderRadius: borderRadius.lg,
          paddingHorizontal: spacing.md,
        },
      ]}
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.text.disabled}
        style={[
          typography.body,
          styles.input,
          { color: colors.text.primary, paddingVertical: spacing.md },
        ]}
        returnKeyType="search"
        clearButtonMode="while-editing"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: { flex: 1 },
  wrap: {
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
