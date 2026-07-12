import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';

import { AppTabHeader } from '@/components/layout/AppTabHeader';
import { TagChips } from '@/features/legal-research/components';
import {
  useDeleteLegalNote,
  useLegalNote,
} from '@/features/legal-research/hooks';
import { resolveMediaUrl } from '@/features/legal-research/pdf';
import { legalResearchRoutes } from '@/features/legal-research/routes';
import {
  formatCreatorName,
  getNoteSourceLabel,
} from '@/features/legal-research/utils';
import { useAuthContext, useTheme } from '@/providers';
import { formatDate } from '@/utils/format-date';


export default function LegalNoteDetailScreen() {
  const router = useRouter();
  const { noteId } = useLocalSearchParams<{ noteId: string }>();
  const insets = useSafeAreaInsets();
  const { user } = useAuthContext();
  const { typography, colors, spacing, borderRadius, shadows } = useTheme();

  const id = noteId ?? '';
  const { data: note, isLoading, isError } = useLegalNote(id);
  const deleteNote = useDeleteLegalNote();

  const handleDelete = () => {
    Alert.alert(
      'Delete note?',
      'This will remove the research note from your library.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteNote.mutateAsync(id);
            router.replace(legalResearchRoutes.index);
          },
        },
      ],
    );
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
      >
        <AppTabHeader
          firstName={user.firstName}
          lastName={user.lastName}
          title="Note"
          showBack
          onBack={() => router.back()}
        />

        {isLoading ? (
          <Text style={[typography.body, { color: colors.text.secondary }]}>
            Loading…
          </Text>
        ) : null}
        {isError || (!isLoading && !note) ? (
          <Text style={{ color: colors.error.main }}>Unable to load note.</Text>
        ) : null}

        {note ? (
          <>
            <Text
              style={[
                typography.caption,
                { color: colors.secondary.main, fontWeight: '700' },
              ]}
            >
              {getNoteSourceLabel(note)} · Page {note.pageNumber}
            </Text>
            <Text style={[typography.h2, { marginTop: 8 }]}>{note.title}</Text>
            <Text
              style={[
                typography.bodySmall,
                { color: colors.text.secondary, marginTop: 6 },
              ]}
            >
              {formatCreatorName(note.createdBy)} · {formatDate(note.createdAt)}
            </Text>

            <View style={[styles.actions, { gap: spacing.sm, marginTop: spacing.lg }]}>
              <ActionBtn
                label="Edit"
                onPress={() => router.push(legalResearchRoutes.edit(note.id))}
                bg={colors.primary.light}
                color={colors.primary.dark}
              />
              <ActionBtn
                label="Print"
                onPress={() => router.push(legalResearchRoutes.print(note.id))}
                bg={colors.secondary.light}
                color={colors.secondary.dark}
              />
              <ActionBtn
                label="Delete"
                onPress={handleDelete}
                bg={colors.error.light}
                color={colors.error.dark}
              />
            </View>

            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.background.paper,
                  borderRadius: borderRadius.lg,
                  marginTop: spacing.xl,
                  ...shadows.sm,
                },
              ]}
            >
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
                Excerpt
              </Text>
              <View
                style={[
                  styles.excerpt,
                  {
                    backgroundColor: colors.neutral[50],
                    borderLeftColor: colors.secondary.main,
                    borderRadius: borderRadius.md,
                  },
                ]}
              >
                <Text style={[typography.body, { fontStyle: 'italic' }]}>
                  “{note.selectedText}”
                </Text>
              </View>
            </View>

            {note.personalNote ? (
              <View
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.background.paper,
                    borderRadius: borderRadius.lg,
                    marginTop: spacing.md,
                    ...shadows.sm,
                  },
                ]}
              >
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
                  Counsel remarks
                </Text>
                <Text style={typography.body}>{note.personalNote}</Text>
              </View>
            ) : null}

            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.background.paper,
                  borderRadius: borderRadius.lg,
                  marginTop: spacing.md,
                  ...shadows.sm,
                },
              ]}
            >
              <MetaRow label="Citation" value={note.citation ?? '—'} />
              <MetaRow label="Court" value={note.court ?? '—'} />
              {note.tags.length ? (
                <View style={{ marginTop: 12 }}>
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
                    Tags
                  </Text>
                  <TagChips tags={note.tags} max={8} />
                </View>
              ) : null}
            </View>

            {note.libraryItem?.pdfUrl ? (
              <Pressable
                onPress={() =>
                  void WebBrowser.openBrowserAsync(
                    resolveMediaUrl(note.libraryItem!.pdfUrl),
                  )
                }
                style={[
                  styles.linkBtn,
                  {
                    backgroundColor: colors.primary.light,
                    borderRadius: borderRadius.md,
                    marginTop: spacing.lg,
                  },
                ]}
              >
                <Text
                  style={[
                    typography.label,
                    { color: colors.primary.dark, textAlign: 'center' },
                  ]}
                >
                  Open source PDF
                </Text>
              </Pressable>
            ) : null}
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  const { typography, colors } = useTheme();
  return (
    <View style={{ marginBottom: 10 }}>
      <Text
        style={[
          typography.caption,
          {
            color: colors.text.secondary,
            fontWeight: '700',
            textTransform: 'uppercase',
          },
        ]}
      >
        {label}
      </Text>
      <Text style={[typography.body, { marginTop: 2 }]}>{value}</Text>
    </View>
  );
}

function ActionBtn({
  label,
  onPress,
  bg,
  color,
}: {
  label: string;
  onPress: () => void;
  bg: string;
  color: string;
}) {
  const { typography, borderRadius } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: bg,
        borderRadius: borderRadius.md,
        flex: 1,
        paddingVertical: 12,
      }}
    >
      <Text
        style={[
          typography.caption,
          { color, fontWeight: '700', textAlign: 'center' },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  actions: { flexDirection: 'row' },
  card: { padding: 16 },
  excerpt: {
    borderLeftWidth: 4,
    padding: 14,
  },
  linkBtn: { paddingVertical: 14 },
  root: { flex: 1 },
});
