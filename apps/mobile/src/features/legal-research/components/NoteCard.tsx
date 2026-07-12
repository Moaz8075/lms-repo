import { Pressable, StyleSheet, Text, View } from 'react-native';

import { TagChips } from '@/features/legal-research/components/TagChips';
import {
  formatCreatorName,
  getNoteSourceLabel,
} from '@/features/legal-research/utils';
import { useTheme } from '@/providers';
import type { LegalNote } from '@/types';
import { formatDate } from '@/utils/format-date';

interface NoteCardProps {
  note: LegalNote;
  onPress: () => void;
}

export function NoteCard({ note, onPress }: NoteCardProps) {
  const { colors, typography, borderRadius, spacing, shadows } = useTheme();
  const isPhysical = note.tags.includes('physical-book');

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.background.paper,
          borderRadius: borderRadius.lg,
          opacity: pressed ? 0.94 : 1,
          ...shadows.sm,
        },
      ]}
    >
      <View
        style={[
          styles.accent,
          {
            backgroundColor: isPhysical
              ? colors.warning.main
              : colors.secondary.main,
          },
        ]}
      />

      <View style={[styles.body, { padding: spacing.md }]}>
        <View style={styles.topRow}>
          <Text
            style={[
              typography.caption,
              { color: colors.secondary.main, fontWeight: '700' },
            ]}
            numberOfLines={1}
          >
            {getNoteSourceLabel(note)}
            {note.pageNumber ? ` · p.${note.pageNumber}` : ''}
          </Text>
          <Text style={[typography.caption, { color: colors.text.disabled }]}>
            {formatDate(note.createdAt)}
          </Text>
        </View>

        <Text
          style={[typography.h3, { marginTop: 6, fontSize: 16 }]}
          numberOfLines={2}
        >
          {note.title}
        </Text>

        <Text
          style={[
            typography.bodySmall,
            {
              color: colors.text.secondary,
              marginTop: 6,
              fontStyle: 'italic',
            },
          ]}
          numberOfLines={2}
        >
          “{note.selectedText}”
        </Text>

        {note.tags.length ? (
          <View style={{ marginTop: spacing.sm }}>
            <TagChips tags={note.tags} max={3} />
          </View>
        ) : null}

        <Text
          style={[
            typography.caption,
            { color: colors.text.disabled, marginTop: spacing.sm },
          ]}
        >
          by {formatCreatorName(note.createdBy)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  accent: {
    borderBottomLeftRadius: 12,
    borderTopLeftRadius: 12,
    width: 4,
  },
  body: { flex: 1 },
  card: {
    flexDirection: 'row',
    marginBottom: 12,
    overflow: 'hidden',
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
});
