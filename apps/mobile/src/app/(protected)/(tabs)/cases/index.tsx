import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppTabHeader } from '@/components/layout/AppTabHeader';
import { CaseCard, CaseFilterSheet } from '@/features/cases/components';
import { useCases } from '@/features/cases/hooks/useCases';
import { useAuthContext, useTheme } from '@/providers';
import type { CaseFilters } from '@/types';

type QuickFilter = 'all' | 'ongoing' | 'hearingToday';

const EMPTY_FILTERS: CaseFilters = {};

export default function CasesListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuthContext();
  const { typography, colors, borderRadius, spacing } = useTheme();

  const [search, setSearch] = useState('');
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('all');
  const [filters, setFilters] = useState<CaseFilters>(EMPTY_FILTERS);
  const [draftFilters, setDraftFilters] = useState<CaseFilters>(EMPTY_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);

  const queryParams = useMemo(
    () => ({
      page: 1,
      limit: 50,
      search: search.trim() || filters.clientSearch?.trim() || undefined,
      status: filters.status,
      caseType: filters.caseType,
      courtName: filters.courtName,
      ongoing: quickFilter === 'ongoing' ? true : undefined,
      hearingToday: quickFilter === 'hearingToday' ? true : undefined,
    }),
    [search, filters, quickFilter],
  );

  const { data, isLoading, isError, refetch, isRefetching } = useCases(queryParams);

  const courtOptions = useMemo(() => {
    const courts = new Set<string>();
    for (const item of data?.items ?? []) {
      if (item.courtName) courts.add(item.courtName);
    }
    return Array.from(courts).sort();
  }, [data?.items]);

  if (!user) return null;

  return (
    <View style={[styles.root, { backgroundColor: colors.background.default }]}>
      <FlatList
        data={data?.items ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingTop: insets.top + spacing.md,
          paddingHorizontal: spacing.lg,
          paddingBottom: insets.bottom + 96,
        }}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => void refetch()} />}
        ListHeaderComponent={
          <>
            <AppTabHeader firstName={user.firstName} lastName={user.lastName} />

            <View style={[styles.searchRow, { borderColor: colors.border.default, borderRadius: borderRadius.lg }]}>
              <Text style={{ marginRight: 8 }}>🔍</Text>
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search cases…"
                placeholderTextColor={colors.text.disabled}
                style={[styles.searchInput, { color: colors.text.primary }]}
              />
              <Pressable onPress={() => setFilterOpen(true)} hitSlop={8}>
                <Text style={{ fontSize: 18 }}>⚙️</Text>
              </Pressable>
            </View>

            <View style={styles.chips}>
              {(
                [
                  ['all', 'All Cases'],
                  ['ongoing', 'Ongoing'],
                  ['hearingToday', 'Hearing Today'],
                ] as const
              ).map(([id, label]) => (
                <Pressable
                  key={id}
                  onPress={() => setQuickFilter(id)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: quickFilter === id ? colors.primary.main : colors.background.paper,
                      borderColor: quickFilter === id ? colors.primary.main : colors.border.default,
                    },
                  ]}
                >
                  <Text
                    style={[
                      typography.caption,
                      {
                        color: quickFilter === id ? colors.primary.contrast : colors.text.primary,
                        fontWeight: '700',
                      },
                    ]}
                  >
                    {label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {isLoading ? (
              <ActivityIndicator color={colors.primary.main} style={{ marginVertical: 24 }} />
            ) : null}
            {isError ? (
              <Text style={[typography.bodySmall, { color: colors.error.main, marginBottom: 12 }]}>
                Unable to load cases. Pull to refresh.
              </Text>
            ) : null}
          </>
        }
        renderItem={({ item }) => (
          <CaseCard caseItem={item} onPress={(id) => router.push(`/(protected)/(tabs)/cases/${id}`)} />
        )}
        ListEmptyComponent={
          !isLoading ? (
            <Text style={[typography.body, { color: colors.text.secondary, textAlign: 'center', marginTop: 24 }]}>
              No cases found.
            </Text>
          ) : null
        }
      />

      <Pressable
        onPress={() => router.push('/(protected)/(tabs)/cases/new')}
        style={[
          styles.fab,
          {
            backgroundColor: colors.primary.main,
            bottom: insets.bottom + 76,
          },
        ]}
      >
        <Text style={{ color: colors.primary.contrast, fontSize: 28, lineHeight: 30 }}>+</Text>
      </Pressable>

      <CaseFilterSheet
        visible={filterOpen}
        filters={draftFilters}
        courtOptions={courtOptions}
        onChange={setDraftFilters}
        onClose={() => setFilterOpen(false)}
        onReset={() => {
          setDraftFilters(EMPTY_FILTERS);
          setFilters(EMPTY_FILTERS);
          setFilterOpen(false);
        }}
        onApply={() => {
          setFilters(draftFilters);
          setFilterOpen(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
    marginTop: 12,
  },
  fab: {
    alignItems: 'center',
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    position: 'absolute',
    right: 20,
    width: 56,
  },
  root: { flex: 1 },
  searchInput: { flex: 1, fontSize: 15, paddingVertical: 12 },
  searchRow: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 4,
    paddingHorizontal: 14,
  },
});
