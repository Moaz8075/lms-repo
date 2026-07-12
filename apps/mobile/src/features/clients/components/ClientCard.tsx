import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/providers';
import type { Client } from '@/types';
import { getInitials } from '@/utils/string';

interface ClientCardProps {
  client: Client;
  onPress?: (clientId: string) => void;
}

export function ClientCard({ client, onPress }: ClientCardProps) {
  const { typography, colors, borderRadius, spacing, shadows } = useTheme();

  return (
    <Pressable
      onPress={() => onPress?.(client.id)}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.background.paper,
          borderRadius: borderRadius.lg,
          opacity: pressed ? 0.94 : 1,
          ...shadows.sm,
        },
      ]}
    >
      <View
        style={[styles.accent, { backgroundColor: colors.primary.main }]}
      />
      <View style={[styles.body, { padding: spacing.md }]}>
        <View style={styles.topRow}>
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
                typography.caption,
                { color: colors.primary.dark, fontWeight: '800' },
              ]}
            >
              {getInitials(client.firstName, client.lastName) ||
                client.name.slice(0, 2).toUpperCase()}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[typography.h3, { fontSize: 16 }]} numberOfLines={1}>
              {client.name}
            </Text>
            {client.fatherName ? (
              <Text
                style={[
                  typography.caption,
                  { color: colors.text.secondary, marginTop: 2 },
                ]}
                numberOfLines={1}
              >
                S/O {client.fatherName}
              </Text>
            ) : null}
          </View>
          <View
            style={[
              styles.status,
              {
                backgroundColor: client.isActive
                  ? colors.success.light
                  : colors.neutral[100],
                borderRadius: borderRadius.full,
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
                  fontSize: 10,
                },
              ]}
            >
              {client.isActive ? 'ACTIVE' : 'INACTIVE'}
            </Text>
          </View>
        </View>

        <View style={[styles.metaRow, { marginTop: spacing.md }]}>
          <Meta label="PHONE" value={client.phone} />
          <Meta label="CNIC" value={client.cnic ?? '—'} />
        </View>

        {(client.city || client.whatsapp) && (
          <View style={[styles.metaRow, { marginTop: spacing.sm }]}>
            {client.city ? <Meta label="CITY" value={client.city} /> : null}
            {client.whatsapp ? (
              <Meta label="WHATSAPP" value={client.whatsapp} />
            ) : null}
          </View>
        )}

        <Text
          style={[
            typography.label,
            { color: colors.primary.main, marginTop: spacing.md },
          ]}
        >
          View profile ›
        </Text>
      </View>
    </Pressable>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  const { typography, colors } = useTheme();
  return (
    <View style={{ flex: 1 }}>
      <Text
        style={[
          typography.caption,
          {
            color: colors.text.disabled,
            fontWeight: '700',
            letterSpacing: 0.4,
            marginBottom: 2,
          },
        ]}
      >
        {label}
      </Text>
      <Text style={[typography.bodySmall, { fontWeight: '600' }]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  accent: {
    borderBottomLeftRadius: 12,
    borderTopLeftRadius: 12,
    width: 4,
  },
  avatar: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    marginRight: 12,
    width: 40,
  },
  body: { flex: 1 },
  card: {
    flexDirection: 'row',
    marginBottom: 12,
    overflow: 'hidden',
  },
  metaRow: { flexDirection: 'row', gap: 12 },
  status: { marginLeft: 8, paddingHorizontal: 8, paddingVertical: 3 },
  topRow: { alignItems: 'center', flexDirection: 'row' },
});
