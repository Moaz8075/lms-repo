import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/providers';

interface TagChipsProps {
  tags: string[];
  max?: number;
}

export function TagChips({ tags, max = 4 }: TagChipsProps) {
  const { colors, typography, borderRadius, spacing } = useTheme();

  if (!tags.length) return null;

  const visible = tags.slice(0, max);
  const remaining = tags.length - visible.length;

  return (
    <View style={[styles.row, { gap: spacing.xs }]}>
      {visible.map((tag) => (
        <View
          key={tag}
          style={[
            styles.chip,
            {
              backgroundColor: colors.secondary.light,
              borderRadius: borderRadius.full,
              borderColor: '#C7D2FE',
            },
          ]}
        >
          <Text
            style={[
              typography.caption,
              { color: colors.secondary.dark, fontWeight: '700', fontSize: 11 },
            ]}
          >
            {tag}
          </Text>
        </View>
      ))}
      {remaining > 0 ? (
        <View
          style={[
            styles.chip,
            {
              backgroundColor: colors.neutral[100],
              borderRadius: borderRadius.full,
              borderColor: colors.border.default,
            },
          ]}
        >
          <Text style={[typography.caption, { color: colors.text.secondary }]}>
            +{remaining}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

interface CategoryChipsProps {
  categories: readonly string[];
  selected: string;
  onSelect: (value: string) => void;
}

export function CategoryChips({
  categories,
  selected,
  onSelect,
}: CategoryChipsProps) {
  const { colors, typography, borderRadius, spacing } = useTheme();

  return (
    <View style={[styles.row, { gap: spacing.sm, flexWrap: 'wrap' }]}>
      {categories.map((category) => {
        const active = category === selected;
        return (
          <Pressable
            key={category}
            onPress={() => onSelect(category)}
            style={[
              styles.categoryChip,
              {
                backgroundColor: active
                  ? colors.primary.main
                  : colors.background.paper,
                borderColor: active ? colors.primary.main : colors.border.default,
                borderRadius: borderRadius.full,
              },
            ]}
          >
            <Text
              style={[
                typography.caption,
                {
                  color: active ? colors.primary.contrast : colors.text.secondary,
                  fontWeight: '700',
                },
              ]}
            >
              {category}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  categoryChip: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chip: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
