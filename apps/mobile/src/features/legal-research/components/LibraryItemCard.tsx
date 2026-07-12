import { Pressable, StyleSheet, Text, View } from 'react-native';

import { TagChips } from '@/features/legal-research/components/TagChips';
import { useTheme } from '@/providers';
import type { LibraryItem } from '@/types';

interface LibraryItemCardProps {
  item: LibraryItem;
  onPress: () => void;
  onCreateNote?: () => void;
}

export function LibraryItemCard({
  item,
  onPress,
  onCreateNote,
}: LibraryItemCardProps) {
  const { colors, typography, borderRadius, spacing, shadows } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.background.paper,
          borderRadius: borderRadius.lg,
          padding: spacing.md,
          opacity: pressed ? 0.94 : 1,
          ...shadows.sm,
        },
      ]}
    >
      <View style={styles.topRow}>
        <View
          style={[
            styles.iconBox,
            {
              backgroundColor: colors.primary.light,
              borderRadius: borderRadius.md,
            },
          ]}
        >
          <Text style={{ fontSize: 18 }}>📕</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.titleRow}>
            <Text style={[typography.h3, { fontSize: 15, flex: 1 }]} numberOfLines={2}>
              {item.title}
            </Text>
            {item.isSystemDocument ? (
              <View
                style={[
                  styles.systemBadge,
                  {
                    backgroundColor: colors.success.light,
                    borderRadius: borderRadius.full,
                  },
                ]}
              >
                <Text
                  style={[
                    typography.caption,
                    { color: colors.success.dark, fontWeight: '700', fontSize: 10 },
                  ]}
                >
                  SYSTEM
                </Text>
              </View>
            ) : null}
          </View>
          {item.citation ? (
            <Text
              style={[
                typography.caption,
                { color: colors.primary.main, marginTop: 4, fontWeight: '600' },
              ]}
              numberOfLines={1}
            >
              {item.citation}
            </Text>
          ) : null}
        </View>
      </View>

      <View style={[styles.metaRow, { marginTop: spacing.sm }]}>
        {item.category ? (
          <Text style={[typography.caption, { color: colors.text.secondary }]}>
            {item.category}
          </Text>
        ) : null}
        {item.court ? (
          <Text style={[typography.caption, { color: colors.text.secondary }]}>
            {item.category ? ' · ' : ''}
            {item.court}
          </Text>
        ) : null}
        {item.year ? (
          <Text style={[typography.caption, { color: colors.text.secondary }]}>
            {(item.category || item.court) ? ' · ' : ''}
            {item.year}
          </Text>
        ) : null}
      </View>

      {item.tags.length ? (
        <View style={{ marginTop: spacing.sm }}>
          <TagChips tags={item.tags} max={3} />
        </View>
      ) : null}

      <View style={[styles.actions, { marginTop: spacing.md, gap: spacing.sm }]}>
        <Pressable
          onPress={onPress}
          style={[
            styles.actionBtn,
            {
              backgroundColor: colors.primary.light,
              borderRadius: borderRadius.md,
              flex: 1,
            },
          ]}
        >
          <Text
            style={[
              typography.caption,
              { color: colors.primary.dark, fontWeight: '700', textAlign: 'center' },
            ]}
          >
            Read PDF
          </Text>
        </Pressable>
        {onCreateNote ? (
          <Pressable
            onPress={onCreateNote}
            style={[
              styles.actionBtn,
              {
                backgroundColor: colors.secondary.light,
                borderRadius: borderRadius.md,
                flex: 1,
              },
            ]}
          >
            <Text
              style={[
                typography.caption,
                {
                  color: colors.secondary.dark,
                  fontWeight: '700',
                  textAlign: 'center',
                },
              ]}
            >
              + Note
            </Text>
          </Pressable>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  actionBtn: { paddingHorizontal: 12, paddingVertical: 10 },
  actions: { flexDirection: 'row' },
  card: { marginBottom: 12 },
  iconBox: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    marginRight: 12,
    width: 44,
  },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap' },
  systemBadge: { marginLeft: 8, paddingHorizontal: 8, paddingVertical: 3 },
  titleRow: { alignItems: 'flex-start', flexDirection: 'row' },
  topRow: { flexDirection: 'row' },
});
