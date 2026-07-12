import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';

import { AppTabHeader } from '@/components/layout/AppTabHeader';
import { TagChips } from '@/features/legal-research/components';
import {
  useDeleteLibraryItem,
  useLibraryItem,
} from '@/features/legal-research/hooks';
import { resolveMediaUrl } from '@/features/legal-research/pdf';
import { legalResearchRoutes, newNoteHref } from '@/features/legal-research/routes';
import { useAuthContext, useTheme } from '@/providers';


export default function LibraryItemDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { user } = useAuthContext();
  const { typography, colors, spacing, borderRadius, shadows } = useTheme();

  const itemId = id ?? '';
  const { data: item, isLoading, isError } = useLibraryItem(itemId);
  const deleteItem = useDeleteLibraryItem();

  const handleDelete = () => {
    if (!item || item.isSystemDocument) return;
    Alert.alert('Delete document?', 'This removes it from your org library.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteItem.mutateAsync(itemId);
          router.replace(legalResearchRoutes.library);
        },
      },
    ]);
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
          title="Document"
          showBack
          onBack={() => router.back()}
        />

        {isLoading ? (
          <Text style={{ color: colors.text.secondary }}>Loading…</Text>
        ) : null}
        {isError || (!isLoading && !item) ? (
          <Text style={{ color: colors.error.main }}>Unable to load document.</Text>
        ) : null}

        {item ? (
          <>
            {item.category ? (
              <Text
                style={[
                  typography.caption,
                  { color: colors.primary.main, fontWeight: '700' },
                ]}
              >
                {item.category.toUpperCase()}
                {item.isSystemDocument ? ' · SYSTEM' : ''}
              </Text>
            ) : null}
            <Text style={[typography.h2, { marginTop: 8 }]}>{item.title}</Text>
            {item.citation ? (
              <Text
                style={[
                  typography.body,
                  { color: colors.primary.dark, marginTop: 6, fontWeight: '600' },
                ]}
              >
                {item.citation}
              </Text>
            ) : null}

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
              <Meta label="Court" value={item.court ?? '—'} />
              <Meta label="Jurisdiction" value={item.jurisdiction ?? '—'} />
              <Meta label="Year" value={item.year ? String(item.year) : '—'} />
              <Meta label="Author" value={item.author ?? '—'} />
              <Meta label="Pages" value={String(item.totalPages || '—')} />
              {item.description ? (
                <View style={{ marginTop: 8 }}>
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
                    Description
                  </Text>
                  <Text style={[typography.body, { marginTop: 4 }]}>
                    {item.description}
                  </Text>
                </View>
              ) : null}
              {item.tags.length ? (
                <View style={{ marginTop: 12 }}>
                  <TagChips tags={item.tags} max={8} />
                </View>
              ) : null}
            </View>

            <View style={[styles.actions, { gap: spacing.sm, marginTop: spacing.lg }]}>
              <Pressable
                onPress={() =>
                  router.push(legalResearchRoutes.libraryReader(item.id))
                }
                style={[
                  styles.btn,
                  {
                    backgroundColor: colors.primary.main,
                    borderRadius: borderRadius.md,
                    flex: 1,
                  },
                ]}
              >
                <Text style={[typography.button, { color: '#fff', textAlign: 'center' }]}>
                  Read & Note
                </Text>
              </Pressable>
              <Pressable
                onPress={() =>
                  void WebBrowser.openBrowserAsync(resolveMediaUrl(item.pdfUrl))
                }
                style={[
                  styles.btn,
                  {
                    backgroundColor: colors.primary.light,
                    borderRadius: borderRadius.md,
                    flex: 1,
                  },
                ]}
              >
                <Text
                  style={[
                    typography.button,
                    { color: colors.primary.dark, textAlign: 'center' },
                  ]}
                >
                  Open Tab
                </Text>
              </Pressable>
            </View>

            <Pressable
              onPress={() =>
                router.push(
                  newNoteHref({
                    libraryItemId: item.id,
                    citation: item.citation ?? '',
                    court: item.court ?? '',
                  }),
                )
              }
              style={[
                styles.btn,
                {
                  backgroundColor: colors.secondary.light,
                  borderRadius: borderRadius.md,
                  marginTop: spacing.sm,
                },
              ]}
            >
              <Text
                style={[
                  typography.button,
                  { color: colors.secondary.dark, textAlign: 'center' },
                ]}
              >
                Create Note from Document
              </Text>
            </Pressable>

            {!item.isSystemDocument ? (
              <Pressable
                onPress={handleDelete}
                style={[
                  styles.btn,
                  {
                    backgroundColor: colors.error.light,
                    borderRadius: borderRadius.md,
                    marginTop: spacing.sm,
                  },
                ]}
              >
                <Text
                  style={[
                    typography.button,
                    { color: colors.error.dark, textAlign: 'center' },
                  ]}
                >
                  Delete Document
                </Text>
              </Pressable>
            ) : null}
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
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

const styles = StyleSheet.create({
  actions: { flexDirection: 'row' },
  btn: { paddingVertical: 14 },
  card: { padding: 16 },
  root: { flex: 1 },
});
