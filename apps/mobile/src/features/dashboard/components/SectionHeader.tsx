import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/providers';

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
}

export function SectionHeader({ title, actionLabel, onActionPress }: SectionHeaderProps) {
  const { typography, colors } = useTheme();

  return (
    <View style={styles.row}>
      <Text style={[typography.h3, { color: colors.text.primary }]}>{title}</Text>
      {actionLabel && onActionPress ? (
        <Pressable onPress={onActionPress} hitSlop={8}>
          <Text style={[typography.label, { color: colors.primary.main }]}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
});
