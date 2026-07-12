import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppTabHeader } from '@/components/layout/AppTabHeader';
import {
  EmptyState,
  NoteCard,
  SearchBar,
} from '@/features/legal-research/components';
import { useLegalNotes } from '@/features/legal-research/hooks';
import { legalResearchRoutes } from '@/features/legal-research/routes';
import { useAuthContext, useTheme } from '@/providers';

export default function LegalResearchNotesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuthContext();
  const { typography, colors, spacing, borderRadius } = useTheme();

  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);

  const queryParams = useMemo(
    () => ({
      page,
      limit: 20,
      keyword: keyword.trim() || undefined,
    }),
    [keyword, page],
  );

  const { data, isLoading, isError, refetch, isRefetching } =
    useLegalNotes(queryParams);

  if (!user) return null;

  return (
    <View style={[styles.root, { backgroundColor: colors.background.default }]}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + spacing.md,
          paddingHorizontal: spacing.lg,
          paddingBottom: insets.bottom + 120,
        }}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => void refetch()}
          />
        }
      >
        <AppTabHeader
          firstName={user.firstName}
          lastName={user.lastName}
          title="Legal Research"
        />

        <View style={styles.hero}>
          <Text style={typography.h2}>Research Notes</Text>
          <Text
            style={[
              typography.bodySmall,
              { color: colors.text.secondary, marginTop: 4 },
            ]}
          >
            Capture authorities, highlights & counsel remarks
          </Text>
        </View>

        <View style={[styles.quickRow, { gap: spacing.sm, marginBottom: spacing.lg }]}>
          <QuickAction
            icon="📚"
            label="Library"
            onPress={() => router.push(legalResearchRoutes.library)}
            bg={colors.primary.light}
            color={colors.primary.dark}
          />
          <QuickAction
            icon="📷"
            label="Scan Book"
            onPress={() => router.push(legalResearchRoutes.scan)}
            bg={colors.warning.light}
            color={colors.warning.dark}
          />
          <QuickAction
            icon="➕"
            label="New Note"
            onPress={() => router.push(legalResearchRoutes.new)}
            bg={colors.secondary.light}
            color={colors.secondary.dark}
          />
        </View>

        <SearchBar
          value={keyword}
          onChangeText={(value) => {
            setKeyword(value);
            setPage(1);
          }}
          placeholder="Search notes, citations, courts…"
        />

        <View style={[styles.countRow, { marginTop: spacing.md, marginBottom: spacing.sm }]}>
          <Text style={[typography.caption, { color: colors.text.secondary }]}>
            {data ? `${data.total} note${data.total === 1 ? '' : 's'}` : ' '}
          </Text>
          {data && data.totalPages > 1 ? (
            <Text style={[typography.caption, { color: colors.text.secondary }]}>
              Page {data.page} of {data.totalPages}
            </Text>
          ) : null}
        </View>

        {isLoading ? (
          <ActivityIndicator
            color={colors.primary.main}
            style={{ marginTop: 32 }}
          />
        ) : null}

        {isError ? (
          <Text style={{ color: colors.error.main, marginTop: 16 }}>
            Unable to load research notes.
          </Text>
        ) : null}

        {!isLoading && data?.items.length === 0 ? (
          <EmptyState
            icon="📝"
            title="No research notes yet"
            subtitle="Create a note, scan a physical book, or highlight text from the library."
          />
        ) : null}

        {data?.items.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onPress={() => router.push(legalResearchRoutes.note(note.id))}
          />
        ))}

        {data && data.totalPages > 1 ? (
          <View style={[styles.pager, { gap: spacing.sm, marginTop: spacing.md }]}>
            <Pressable
              disabled={page <= 1}
              onPress={() => setPage((p) => Math.max(1, p - 1))}
              style={[
                styles.pageBtn,
                {
                  backgroundColor: colors.background.paper,
                  borderColor: colors.border.default,
                  borderRadius: borderRadius.md,
                  opacity: page <= 1 ? 0.4 : 1,
                },
              ]}
            >
              <Text style={[typography.caption, { fontWeight: '700' }]}>Previous</Text>
            </Pressable>
            <Pressable
              disabled={page >= data.totalPages}
              onPress={() => setPage((p) => p + 1)}
              style={[
                styles.pageBtn,
                {
                  backgroundColor: colors.primary.light,
                  borderColor: colors.primary.light,
                  borderRadius: borderRadius.md,
                  opacity: page >= data.totalPages ? 0.4 : 1,
                },
              ]}
            >
              <Text
                style={[
                  typography.caption,
                  { fontWeight: '700', color: colors.primary.dark },
                ]}
              >
                Next
              </Text>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>

      <Pressable
        onPress={() => router.push(legalResearchRoutes.new)}
        style={[
          styles.fab,
          {
            backgroundColor: colors.primary.main,
            bottom: insets.bottom + 24,
            borderRadius: borderRadius.full,
          },
        ]}
      >
        <Text style={{ color: '#fff', fontSize: 28, lineHeight: 30 }}>＋</Text>
      </Pressable>
    </View>
  );
}

function QuickAction({
  icon,
  label,
  onPress,
  bg,
  color,
}: {
  icon: string;
  label: string;
  onPress: () => void;
  bg: string;
  color: string;
}) {
  const { typography, borderRadius } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.quickBtn,
        { backgroundColor: bg, borderRadius: borderRadius.lg, flex: 1 },
      ]}
    >
      <Text style={{ fontSize: 18 }}>{icon}</Text>
      <Text
        style={[
          typography.caption,
          { color, fontWeight: '700', marginTop: 4, textAlign: 'center' },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  countRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fab: {
    alignItems: 'center',
    elevation: 4,
    height: 56,
    justifyContent: 'center',
    position: 'absolute',
    right: 20,
    shadowColor: '#1A73E8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    width: 56,
  },
  hero: { marginBottom: 16 },
  pageBtn: {
    borderWidth: 1,
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  pager: { flexDirection: 'row' },
  quickBtn: {
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 14,
  },
  quickRow: { flexDirection: 'row' },
  root: { flex: 1 },
});
