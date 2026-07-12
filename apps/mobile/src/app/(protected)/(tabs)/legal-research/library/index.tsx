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
  CategoryChips,
  EmptyState,
  LibraryItemCard,
  SearchBar,
} from '@/features/legal-research/components';
import { useLegalLibrary } from '@/features/legal-research/hooks';
import { legalResearchRoutes, newNoteHref } from '@/features/legal-research/routes';
import { useAuthContext, useTheme } from '@/providers';
import { LIBRARY_CATEGORIES } from '@/types';

export default function LegalLibraryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuthContext();
  const { typography, colors, spacing, borderRadius } = useTheme();

  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState<string>('All');
  const [page, setPage] = useState(1);

  const queryParams = useMemo(
    () => ({
      page,
      limit: 20,
      keyword: keyword.trim() || undefined,
      category: category === 'All' ? undefined : category,
    }),
    [keyword, category, page],
  );

  const { data, isLoading, isError, refetch, isRefetching } =
    useLegalLibrary(queryParams);

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
          title="Library"
          showBack
          onBack={() => router.back()}
        />

        <View style={styles.titleRow}>
          <View style={{ flex: 1 }}>
            <Text style={typography.h2}>Reference Library</Text>
            <Text
              style={[
                typography.bodySmall,
                { color: colors.text.secondary, marginTop: 4 },
              ]}
            >
              Judgments, books, statutes & articles
            </Text>
          </View>
          <Pressable
            onPress={() => router.push(legalResearchRoutes.libraryAdd)}
            style={[
              styles.addBtn,
              {
                backgroundColor: colors.primary.main,
                borderRadius: borderRadius.full,
              },
            ]}
          >
            <Text style={{ color: '#fff', fontWeight: '700' }}>+ Add</Text>
          </Pressable>
        </View>

        <SearchBar
          value={keyword}
          onChangeText={(value) => {
            setKeyword(value);
            setPage(1);
          }}
          placeholder="Search title, citation, description…"
        />

        <View style={{ marginTop: spacing.md, marginBottom: spacing.md }}>
          <CategoryChips
            categories={LIBRARY_CATEGORIES}
            selected={category}
            onSelect={(value) => {
              setCategory(value);
              setPage(1);
            }}
          />
        </View>

        <Text
          style={[
            typography.caption,
            { color: colors.text.secondary, marginBottom: spacing.sm },
          ]}
        >
          {data ? `${data.total} document${data.total === 1 ? '' : 's'}` : ' '}
        </Text>

        {isLoading ? (
          <ActivityIndicator color={colors.primary.main} style={{ marginTop: 24 }} />
        ) : null}
        {isError ? (
          <Text style={{ color: colors.error.main }}>Unable to load library.</Text>
        ) : null}

        {!isLoading && data?.items.length === 0 ? (
          <EmptyState
            icon="📕"
            title="No documents found"
            subtitle="Add a PDF by URL, or adjust your search filters."
          />
        ) : null}

        {data?.items.map((item) => (
          <LibraryItemCard
            key={item.id}
            item={item}
            onPress={() =>
              router.push(legalResearchRoutes.libraryReader(item.id))
            }
            onCreateNote={() =>
              router.push(
                newNoteHref({
                  libraryItemId: item.id,
                  citation: item.citation ?? '',
                  court: item.court ?? '',
                }),
              )
            }
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
    </View>
  );
}

const styles = StyleSheet.create({
  addBtn: { paddingHorizontal: 14, paddingVertical: 10 },
  pageBtn: {
    alignItems: 'center',
    borderWidth: 1,
    flex: 1,
    paddingVertical: 12,
  },
  pager: { flexDirection: 'row' },
  root: { flex: 1 },
  titleRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
});
