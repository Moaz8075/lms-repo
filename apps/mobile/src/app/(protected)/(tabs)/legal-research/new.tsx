import { useEffect, useMemo, useState } from 'react';
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
  useAttachNoteToCase,
  useCreateLegalNote,
  useLegalLibrary,
} from '@/features/legal-research/hooks';
import { legalResearchRoutes } from '@/features/legal-research/routes';
import {
  parseTagsInput,
  suggestNoteTitle,
} from '@/features/legal-research/utils';
import { useCases } from '@/features/cases/hooks/useCases';
import { useAuthContext, useTheme } from '@/providers';

export default function CreateLegalNoteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    libraryItemId?: string;
    selectedText?: string;
    pageNumber?: string;
    citation?: string;
    court?: string;
    title?: string;
  }>();
  const insets = useSafeAreaInsets();
  const { user } = useAuthContext();
  const { typography, colors, spacing, borderRadius } = useTheme();

  const createNote = useCreateLegalNote();
  const attachNote = useAttachNoteToCase();
  const { data: libraryData } = useLegalLibrary({ page: 1, limit: 100 });
  const { data: casesData } = useCases({ page: 1, limit: 50 });

  const [title, setTitle] = useState(params.title ?? '');
  const [selectedText, setSelectedText] = useState(params.selectedText ?? '');
  const [personalNote, setPersonalNote] = useState('');
  const [pageNumber, setPageNumber] = useState(params.pageNumber ?? '1');
  const [citation, setCitation] = useState(params.citation ?? '');
  const [court, setCourt] = useState(params.court ?? '');
  const [tagsInput, setTagsInput] = useState('');
  const [libraryItemId, setLibraryItemId] = useState(params.libraryItemId ?? '');
  const [caseId, setCaseId] = useState('');
  const [caseSearch, setCaseSearch] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!title && selectedText.trim()) {
      setTitle(suggestNoteTitle(selectedText));
    }
  }, [selectedText, title]);

  const filteredCases = useMemo(() => {
    const q = caseSearch.trim().toLowerCase();
    if (!q) return casesData?.items ?? [];
    return (casesData?.items ?? []).filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.caseNumber.toLowerCase().includes(q),
    );
  }, [casesData?.items, caseSearch]);

  const handleSave = async () => {
    setError(null);
    const page = Number(pageNumber);
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!selectedText.trim()) {
      setError('Highlighted / source text is required.');
      return;
    }
    if (!Number.isFinite(page) || page < 1) {
      setError('Page number must be at least 1.');
      return;
    }

    try {
      const note = await createNote.mutateAsync({
        title: title.trim(),
        pageNumber: page,
        selectedText: selectedText.trim(),
        personalNote: personalNote.trim() || undefined,
        libraryItemId: libraryItemId || undefined,
        citation: citation.trim() || undefined,
        court: court.trim() || undefined,
        tags: parseTagsInput(tagsInput),
      });

      if (caseId) {
        try {
          await attachNote.mutateAsync({
            caseId,
            payload: { legalNoteId: note.id },
          });
        } catch {
          // Note saved; attach may fail if duplicate — still navigate
        }
      }

      router.replace(legalResearchRoutes.note(note.id));
    } catch {
      setError('Failed to save note. Please try again.');
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
          title="New Note"
          showBack
          onBack={() => router.back()}
        />

        <Text style={typography.h2}>Add Research Note</Text>
        <Text
          style={[
            typography.bodySmall,
            { color: colors.text.secondary, marginTop: 4, marginBottom: spacing.lg },
          ]}
        >
          Capture an authority excerpt for court use
        </Text>

        <FormField
          label="Title"
          value={title}
          onChangeText={setTitle}
          placeholder="Short subject for this note"
        />
        <FormField
          label="Page number"
          value={pageNumber}
          onChangeText={setPageNumber}
          keyboardType="number-pad"
          placeholder="1"
        />
        <FormField
          label="Highlighted text"
          value={selectedText}
          onChangeText={setSelectedText}
          multiline
          placeholder="Paste or type the excerpt from the source…"
        />
        <FormField
          label="Personal note / remarks"
          value={personalNote}
          onChangeText={setPersonalNote}
          multiline
          placeholder="Counsel remarks, how to use this authority…"
        />
        <FormField
          label="Citation"
          value={citation}
          onChangeText={setCitation}
          placeholder="e.g. PLD 2021 SC 421"
        />
        <FormField
          label="Court / publisher"
          value={court}
          onChangeText={setCourt}
          placeholder="e.g. Supreme Court"
        />
        <FormField
          label="Tags"
          value={tagsInput}
          onChangeText={setTagsInput}
          placeholder="bail, section-497, interim (comma separated)"
        />

        <Text
          style={[
            typography.caption,
            {
              color: colors.text.secondary,
              fontWeight: '700',
              marginBottom: 8,
              textTransform: 'uppercase',
            },
          ]}
        >
          Source document (optional)
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: spacing.md }}
          contentContainerStyle={{ gap: 8 }}
        >
          <Chip
            label="None"
            active={!libraryItemId}
            onPress={() => setLibraryItemId('')}
          />
          {(libraryData?.items ?? []).map((item) => (
            <Chip
              key={item.id}
              label={item.title}
              active={libraryItemId === item.id}
              onPress={() => {
                setLibraryItemId(item.id);
                if (!citation && item.citation) setCitation(item.citation);
                if (!court && item.court) setCourt(item.court);
              }}
            />
          ))}
        </ScrollView>

        <Text
          style={[
            typography.caption,
            {
              color: colors.text.secondary,
              fontWeight: '700',
              marginBottom: 8,
              textTransform: 'uppercase',
            },
          ]}
        >
          Attach to case (optional)
        </Text>
        <FormField
          label="Search cases"
          value={caseSearch}
          onChangeText={setCaseSearch}
          placeholder="Case number or title…"
        />
        <View style={{ gap: 8, marginBottom: spacing.lg }}>
          {filteredCases.slice(0, 6).map((item) => (
            <Pressable
              key={item.id}
              onPress={() => setCaseId(item.id === caseId ? '' : item.id)}
              style={[
                styles.caseRow,
                {
                  borderColor:
                    caseId === item.id ? colors.primary.main : colors.border.default,
                  backgroundColor:
                    caseId === item.id
                      ? colors.primary.light
                      : colors.background.paper,
                  borderRadius: borderRadius.md,
                },
              ]}
            >
              <Text style={[typography.bodySmall, { fontWeight: '700' }]}>
                {item.caseNumber}
              </Text>
              <Text
                style={[typography.caption, { color: colors.text.secondary }]}
                numberOfLines={1}
              >
                {item.title}
              </Text>
            </Pressable>
          ))}
        </View>

        {error ? (
          <Text style={{ color: colors.error.main, marginBottom: 12 }}>{error}</Text>
        ) : null}

        <Pressable
          onPress={() => void handleSave()}
          disabled={createNote.isPending}
          style={[
            styles.saveBtn,
            {
              backgroundColor: colors.primary.main,
              borderRadius: borderRadius.md,
              opacity: createNote.isPending ? 0.7 : 1,
            },
          ]}
        >
          {createNote.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={[typography.button, { color: '#fff' }]}>Save Note</Text>
          )}
        </Pressable>
      </ScrollView>
    </View>
  );
}

function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const { colors, typography, borderRadius } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: active ? colors.secondary.main : colors.background.paper,
        borderColor: active ? colors.secondary.main : colors.border.default,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        maxWidth: 180,
        paddingHorizontal: 12,
        paddingVertical: 8,
      }}
    >
      <Text
        numberOfLines={1}
        style={[
          typography.caption,
          {
            color: active ? '#fff' : colors.text.secondary,
            fontWeight: '700',
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  caseRow: { borderWidth: 1, padding: 12 },
  root: { flex: 1 },
  saveBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
});
