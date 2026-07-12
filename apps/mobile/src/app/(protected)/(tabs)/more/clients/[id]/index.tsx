import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppTabHeader } from '@/components/layout/AppTabHeader';
import {
  useClient,
  useDeactivateClient,
} from '@/features/clients/hooks';
import { clientsRoutes } from '@/features/clients/routes';
import {
  formatCaseStatus,
  getCaseStatusBadgeColor,
} from '@/features/cases/utils/case-format';
import { useAuthContext, useTheme } from '@/providers';
import { formatDate } from '@/utils/format-date';
import { getInitials } from '@/utils/string';

export default function ClientDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { user } = useAuthContext();
  const { typography, colors, spacing, borderRadius, shadows } = useTheme();

  const clientId = id ?? '';
  const { data: client, isLoading, isError } = useClient(clientId);
  const deactivate = useDeactivateClient();

  const handleDeactivate = () => {
    Alert.alert(
      'Deactivate client?',
      'This soft-deletes the client. They will no longer appear in the active list.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Deactivate',
          style: 'destructive',
          onPress: async () => {
            await deactivate.mutateAsync(clientId);
            router.replace(clientsRoutes.index);
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
          title="Client"
          showBack
          onBack={() => router.back()}
        />

        {isLoading ? (
          <ActivityIndicator color={colors.primary.main} />
        ) : null}
        {isError || (!isLoading && !client) ? (
          <Text style={{ color: colors.error.main }}>
            Unable to load client.
          </Text>
        ) : null}

        {client ? (
          <>
            <View style={styles.heroRow}>
              <View
                style={[
                  styles.avatar,
                  {
                    backgroundColor: colors.primary.light,
                    borderRadius: borderRadius.full,
                  },
                ]}
              >
                <Text
                  style={[
                    typography.h3,
                    { color: colors.primary.dark, fontWeight: '800' },
                  ]}
                >
                  {getInitials(client.firstName, client.lastName) ||
                    client.name.slice(0, 2).toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={typography.h2}>{client.name}</Text>
                {client.fatherName ? (
                  <Text
                    style={[
                      typography.bodySmall,
                      { color: colors.text.secondary, marginTop: 4 },
                    ]}
                  >
                    S/O {client.fatherName}
                  </Text>
                ) : null}
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor: client.isActive
                        ? colors.success.light
                        : colors.neutral[100],
                      borderRadius: borderRadius.full,
                      marginTop: 8,
                      alignSelf: 'flex-start',
                    },
                  ]}
                >
                  <Text
                    style={[
                      typography.caption,
                      {
                        color: client.isActive
                          ? colors.success.dark
                          : colors.text.secondary,
                        fontWeight: '700',
                      },
                    ]}
                  >
                    {client.isActive ? 'Active' : 'Inactive'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={[styles.actions, { gap: spacing.sm, marginTop: spacing.lg }]}>
              <Pressable
                onPress={() => router.push(clientsRoutes.edit(client.id))}
                style={[
                  styles.actionBtn,
                  {
                    backgroundColor: colors.primary.light,
                    borderRadius: borderRadius.md,
                    flex: 1,
                  },
                ]}
              >
                <Text
                  style={[
                    typography.caption,
                    {
                      color: colors.primary.dark,
                      fontWeight: '700',
                      textAlign: 'center',
                    },
                  ]}
                >
                  Edit
                </Text>
              </Pressable>
              {client.isActive ? (
                <Pressable
                  onPress={handleDeactivate}
                  style={[
                    styles.actionBtn,
                    {
                      backgroundColor: colors.error.light,
                      borderRadius: borderRadius.md,
                      flex: 1,
                    },
                  ]}
                >
                  <Text
                    style={[
                      typography.caption,
                      {
                        color: colors.error.dark,
                        fontWeight: '700',
                        textAlign: 'center',
                      },
                    ]}
                  >
                    Deactivate
                  </Text>
                </Pressable>
              ) : null}
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
              <Text style={[typography.h3, { fontSize: 15, marginBottom: 12 }]}>
                Contact & ID
              </Text>
              <InfoRow label="Phone" value={client.phone} />
              <InfoRow label="WhatsApp" value={client.whatsapp ?? '—'} />
              <InfoRow label="CNIC" value={client.cnic ?? '—'} />
              <InfoRow label="Email" value={client.email ?? '—'} />
              <InfoRow label="City" value={client.city ?? '—'} />
              <InfoRow label="Address" value={client.address ?? '—'} />
              <InfoRow
                label="Added"
                value={formatDate(client.createdAt)}
              />
            </View>

            {client.notes ? (
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
                <Text style={[typography.h3, { fontSize: 15, marginBottom: 8 }]}>
                  Notes
                </Text>
                <Text style={typography.body}>{client.notes}</Text>
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
              <View style={styles.sectionHeader}>
                <Text style={[typography.h3, { fontSize: 15 }]}>
                  Cases ({client.totalCases})
                </Text>
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: '/(protected)/(tabs)/cases/new',
                      params: { clientId: client.id },
                    } as never)
                  }
                >
                  <Text
                    style={[
                      typography.caption,
                      { color: colors.primary.main, fontWeight: '700' },
                    ]}
                  >
                    + New case
                  </Text>
                </Pressable>
              </View>

              {client.recentCases.length === 0 ? (
                <Text
                  style={[typography.bodySmall, { color: colors.text.secondary }]}
                >
                  No cases linked yet.
                </Text>
              ) : (
                client.recentCases.map((caseItem) => {
                  const badge = getCaseStatusBadgeColor(caseItem.status);
                  return (
                    <Pressable
                      key={caseItem.id}
                      onPress={() =>
                        router.push(
                          `/(protected)/(tabs)/cases/${caseItem.id}` as never,
                        )
                      }
                      style={[
                        styles.caseRow,
                        {
                          backgroundColor: colors.neutral[50],
                          borderRadius: borderRadius.md,
                          marginTop: 10,
                        },
                      ]}
                    >
                      <View style={styles.caseTop}>
                        <Text
                          style={[
                            typography.caption,
                            { color: colors.primary.main, fontWeight: '700' },
                          ]}
                        >
                          #{caseItem.caseNumber}
                        </Text>
                        <View
                          style={[
                            styles.badge,
                            { backgroundColor: badge.bg, borderRadius: 999 },
                          ]}
                        >
                          <Text
                            style={[
                              typography.caption,
                              { color: badge.text, fontWeight: '700', fontSize: 10 },
                            ]}
                          >
                            {formatCaseStatus(caseItem.status)}
                          </Text>
                        </View>
                      </View>
                      <Text
                        style={[typography.bodySmall, { fontWeight: '700', marginTop: 4 }]}
                        numberOfLines={2}
                      >
                        {caseItem.title}
                      </Text>
                      {caseItem.courtName ? (
                        <Text
                          style={[
                            typography.caption,
                            { color: colors.text.secondary, marginTop: 4 },
                          ]}
                        >
                          {caseItem.courtName}
                        </Text>
                      ) : null}
                    </Pressable>
                  );
                })
              )}
            </View>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  const { typography, colors } = useTheme();
  return (
    <View style={{ marginBottom: 12 }}>
      <Text
        style={[
          typography.caption,
          {
            color: colors.text.disabled,
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: 0.4,
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
  actionBtn: { paddingVertical: 12 },
  actions: { flexDirection: 'row' },
  avatar: {
    alignItems: 'center',
    height: 64,
    justifyContent: 'center',
    marginRight: 14,
    width: 64,
  },
  badge: { paddingHorizontal: 10, paddingVertical: 4 },
  card: { padding: 16 },
  caseRow: { padding: 12 },
  caseTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heroRow: { alignItems: 'center', flexDirection: 'row' },
  root: { flex: 1 },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
});
