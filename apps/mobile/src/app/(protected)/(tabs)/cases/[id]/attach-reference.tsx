import { useMemo, useState } from 'react';
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
import { SearchBar } from '@/features/legal-research/components';
import {
  useAttachNoteToCase,
  useLegalNotes,
} from '@/features/legal-research/hooks';
import { legalResearchRoutes } from '@/features/legal-research/routes';
import { getNoteSourceLabel } from '@/features/legal-research/utils';
import { useAuthContext, useTheme } from '@/providers';

export default function AttachReferenceScreen() {
  const router = useRouter();
  const { id: caseId } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { user } = useAuthContext();
  const { typography, colors, spacing, borderRadius } = useTheme();

  const [keyword, setKeyword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const queryParams = useMemo(
    () => ({
      page: 1,
      limit: 40,
      keyword: keyword.trim() || undefined,
    }),
    [keyword],
  );

  const { data, isLoading } = useLegalNotes(queryParams);
  const attach = useAttachNoteToCase();

  const handleAttach = async (legalNoteId: string) => {
    if (!caseId) return;
    setError(null);
    try {
      await attach.mutateAsync({
        caseId,
        payload: { legalNoteId },
      });
      router.back();
    } catch {
      setError('Could not attach note. It may already be linked to this case.');
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
          title="Attach Note"
          showBack
          onBack={() => router.back()}
        />

        <Text style={typography.h2}>Attach Legal Note</Text>
        <Text
          style={[
            typography.bodySmall,
            { color: colors.text.secondary, marginTop: 4, marginBottom: spacing.lg },
          ]}
        >
          Search your research notes and link one to this case
        </Text>

        <SearchBar
          value={keyword}
          onChangeText={setKeyword}
          placeholder="Search notes…"
        />

        {error ? (
          <Text style={{ color: colors.error.main, marginTop: 12 }}>{error}</Text>
        ) : null}

        {isLoading ? (
          <ActivityIndicator
            color={colors.primary.main}
            style={{ marginTop: 24 }}
          />
        ) : null}

        <View style={{ marginTop: spacing.md, gap: 10 }}>
          {(data?.items ?? []).map((note) => (
            <Pressable
              key={note.id}
              onPress={() => void handleAttach(note.id)}
              disabled={attach.isPending}
              style={[
                styles.row,
                {
                  backgroundColor: colors.background.paper,
                  borderColor: colors.border.default,
                  borderRadius: borderRadius.lg,
                },
              ]}
            >
              <Text style={[typography.bodySmall, { fontWeight: '700' }]}>
                {note.title}
              </Text>
              <Text
                style={[typography.caption, { color: colors.text.secondary, marginTop: 4 }]}
                numberOfLines={2}
              >
                {getNoteSourceLabel(note)} · “{note.selectedText}”
              </Text>
              <Text
                style={[
                  typography.caption,
                  { color: colors.primary.main, fontWeight: '700', marginTop: 8 },
                ]}
              >
                Tap to attach
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={() => router.push(legalResearchRoutes.new)}
          style={{ marginTop: spacing.xl }}
        >
          <Text style={[typography.label, { color: colors.primary.main }]}>
            Create a new research note ›
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  row: { borderWidth: 1, padding: 14 },
});
