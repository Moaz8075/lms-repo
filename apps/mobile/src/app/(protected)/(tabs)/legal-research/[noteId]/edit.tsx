import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppTabHeader } from '@/components/layout/AppTabHeader';
import { FormField } from '@/features/legal-research/components';
import {
  useLegalNote,
  useUpdateLegalNote,
} from '@/features/legal-research/hooks';
import { legalResearchRoutes } from '@/features/legal-research/routes';
import { parseTagsInput } from '@/features/legal-research/utils';
import { useAuthContext, useTheme } from '@/providers';

export default function EditLegalNoteScreen() {
  const router = useRouter();
  const { noteId } = useLocalSearchParams<{ noteId: string }>();
  const insets = useSafeAreaInsets();
  const { user } = useAuthContext();
  const { typography, colors, spacing, borderRadius } = useTheme();

  const id = noteId ?? '';
  const { data: note, isLoading } = useLegalNote(id);
  const updateNote = useUpdateLegalNote();

  const [title, setTitle] = useState('');
  const [personalNote, setPersonalNote] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setPersonalNote(note.personalNote ?? '');
      setTagsInput(note.tags.join(', '));
    }
  }, [note]);

  const handleSave = async () => {
    setError(null);
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }

    try {
      await updateNote.mutateAsync({
        id,
        payload: {
          title: title.trim(),
          personalNote: personalNote.trim() || undefined,
          tags: parseTagsInput(tagsInput),
        },
      });
      router.replace(legalResearchRoutes.note(id));
    } catch {
      setError('Failed to update note.');
    }
  };

  if (!user) return null;

  return (
    <View style={[styles.root, { backgroundColor: colors.background.default }]}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + spacing.md,
          paddingHorizontal: spacing.lg,
          paddingBottom: insets.bottom + 40,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <AppTabHeader
          firstName={user.firstName}
          lastName={user.lastName}
          title="Edit Note"
          showBack
          onBack={() => router.back()}
        />

        <Text style={typography.h2}>Edit Research Note</Text>
        <Text
          style={[
            typography.bodySmall,
            { color: colors.text.secondary, marginTop: 4, marginBottom: spacing.lg },
          ]}
        >
          Title, remarks and tags can be updated. Excerpt stays locked.
        </Text>

        {isLoading ? <ActivityIndicator color={colors.primary.main} /> : null}

        {note ? (
          <>
            <View
              style={[
                styles.locked,
                {
                  backgroundColor: colors.neutral[100],
                  borderRadius: borderRadius.md,
                  marginBottom: spacing.lg,
                },
              ]}
            >
              <Text
                style={[
                  typography.caption,
                  { color: colors.text.secondary, fontWeight: '700' },
                ]}
              >
                HIGHLIGHTED TEXT (READ-ONLY)
              </Text>
              <Text
                style={[
                  typography.bodySmall,
                  { fontStyle: 'italic', marginTop: 6 },
                ]}
              >
                “{note.selectedText}”
              </Text>
            </View>

            <FormField label="Title" value={title} onChangeText={setTitle} />
            <FormField
              label="Personal note / remarks"
              value={personalNote}
              onChangeText={setPersonalNote}
              multiline
            />
            <FormField
              label="Tags"
              value={tagsInput}
              onChangeText={setTagsInput}
              placeholder="comma separated"
            />

            {error ? (
              <Text style={{ color: colors.error.main, marginBottom: 12 }}>
                {error}
              </Text>
            ) : null}

            <Pressable
              onPress={() => void handleSave()}
              disabled={updateNote.isPending}
              style={[
                styles.saveBtn,
                {
                  backgroundColor: colors.primary.main,
                  borderRadius: borderRadius.md,
                  opacity: updateNote.isPending ? 0.7 : 1,
                },
              ]}
            >
              {updateNote.isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={[typography.button, { color: '#fff' }]}>
                  Save Changes
                </Text>
              )}
            </Pressable>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  locked: { padding: 14 },
  root: { flex: 1 },
  saveBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
});
