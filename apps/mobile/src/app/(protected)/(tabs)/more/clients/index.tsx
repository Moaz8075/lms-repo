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
import { ClientCard } from '@/features/clients/components';
import { useClients } from '@/features/clients/hooks';
import { clientsRoutes } from '@/features/clients/routes';
import { useAuthContext, useTheme } from '@/providers';

export default function ClientsListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuthContext();
  const { typography, colors, borderRadius, spacing } = useTheme();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const queryParams = useMemo(
    () => ({
      page,
      limit: 20,
      search: search.trim() || undefined,
    }),
    [search, page],
  );

  const { data, isLoading, isError, refetch, isRefetching } =
    useClients(queryParams);

  if (!user) return null;

  return (
    <View style={[styles.root, { backgroundColor: colors.background.default }]}>
      <FlatList
        data={data?.items ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingTop: insets.top + spacing.md,
          paddingHorizontal: spacing.lg,
          paddingBottom: insets.bottom + 110,
        }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => void refetch()}
          />
        }
        ListHeaderComponent={
          <>
            <AppTabHeader
              firstName={user.firstName}
              lastName={user.lastName}
              title="Clients"
              showBack
              onBack={() => router.back()}
            />

            <View
              style={[
                styles.searchRow,
                {
                  borderColor: colors.border.default,
                  borderRadius: borderRadius.lg,
                  backgroundColor: colors.background.paper,
                },
              ]}
            >
              <Text style={{ marginRight: 8 }}>🔍</Text>
              <TextInput
                value={search}
                onChangeText={(value) => {
                  setSearch(value);
                  setPage(1);
                }}
                placeholder="Search by name…"
                placeholderTextColor={colors.text.disabled}
                style={[styles.searchInput, { color: colors.text.primary }]}
              />
            </View>

            <Text
              style={[
                typography.caption,
                {
                  color: colors.text.secondary,
                  marginTop: spacing.md,
                  marginBottom: spacing.sm,
                },
              ]}
            >
              {data
                ? `${data.total} client${data.total === 1 ? '' : 's'}`
                : ' '}
            </Text>

            {isLoading ? (
              <ActivityIndicator
                color={colors.primary.main}
                style={{ marginVertical: 24 }}
              />
            ) : null}
            {isError ? (
              <Text style={{ color: colors.error.main, marginBottom: 12 }}>
                Unable to load clients.
              </Text>
            ) : null}
            {!isLoading && data?.items.length === 0 ? (
              <View
                style={[
                  styles.empty,
                  {
                    borderColor: colors.border.default,
                    borderRadius: borderRadius.lg,
                    backgroundColor: colors.background.paper,
                  },
                ]}
              >
                <Text style={{ fontSize: 36, textAlign: 'center' }}>👥</Text>
                <Text
                  style={[
                    typography.h3,
                    { textAlign: 'center', marginTop: 12, fontSize: 16 },
                  ]}
                >
                  No clients yet
                </Text>
                <Text
                  style={[
                    typography.bodySmall,
                    {
                      color: colors.text.secondary,
                      textAlign: 'center',
                      marginTop: 6,
                    },
                  ]}
                >
                  Add your first client to start linking cases.
                </Text>
              </View>
            ) : null}
          </>
        }
        renderItem={({ item }) => (
          <ClientCard
            client={item}
            onPress={(id) => router.push(clientsRoutes.detail(id))}
          />
        )}
        ListFooterComponent={
          data && data.totalPages > 1 ? (
            <View style={[styles.pager, { gap: spacing.sm, marginTop: spacing.sm }]}>
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
                <Text style={[typography.caption, { fontWeight: '700' }]}>
                  Previous
                </Text>
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
          ) : null
        }
      />

      <Pressable
        onPress={() => router.push(clientsRoutes.new)}
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

const styles = StyleSheet.create({
  empty: {
    borderStyle: 'dashed',
    borderWidth: 1,
    marginTop: 8,
    padding: 28,
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
  pageBtn: {
    alignItems: 'center',
    borderWidth: 1,
    flex: 1,
    paddingVertical: 12,
  },
  pager: { flexDirection: 'row' },
  root: { flex: 1 },
  searchInput: { flex: 1, fontSize: 15, paddingVertical: 12 },
  searchRow: {
    alignItems: 'center',
    borderWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 12,
  },
  titleRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
});
