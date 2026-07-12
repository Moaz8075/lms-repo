import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppTabHeader } from '@/components/layout/AppTabHeader';
import { AuthButton, useLogout } from '@/features/auth';
import { clientsRoutes } from '@/features/clients/routes';
import { useAuthContext, useTheme } from '@/providers';

const MODULES = [
  {
    id: 'clients',
    title: 'Clients',
    subtitle: 'Directory, profiles & linked cases',
    icon: '👥',
    accent: '#1A73E8',
    accentBg: '#E8F0FE',
    href: clientsRoutes.index,
  },
] as const;

export default function MoreHubScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const logoutMutation = useLogout();
  const { user } = useAuthContext();
  const { typography, colors, spacing, borderRadius, shadows } = useTheme();

  if (!user) return null;

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: colors.background.default,
          paddingTop: insets.top + spacing.md,
          paddingHorizontal: spacing.lg,
          paddingBottom: insets.bottom + spacing['2xl'],
        },
      ]}
    >
      <AppTabHeader firstName={user.firstName} lastName={user.lastName} />

      <Text style={typography.h2}>More</Text>
      <Text
        style={[
          typography.bodySmall,
          { color: colors.text.secondary, marginTop: 4, marginBottom: spacing.xl },
        ]}
      >
        Tools and settings for your practice
      </Text>

      {MODULES.map((module) => (
        <Pressable
          key={module.id}
          onPress={() => router.push(module.href)}
          style={({ pressed }) => [
            styles.moduleCard,
            {
              backgroundColor: colors.background.paper,
              borderRadius: borderRadius.lg,
              opacity: pressed ? 0.94 : 1,
              ...shadows.sm,
            },
          ]}
        >
          <View
            style={[
              styles.moduleIcon,
              {
                backgroundColor: module.accentBg,
                borderRadius: borderRadius.md,
              },
            ]}
          >
            <Text style={{ fontSize: 24 }}>{module.icon}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[typography.h3, { fontSize: 16 }]}>{module.title}</Text>
            <Text
              style={[
                typography.bodySmall,
                { color: colors.text.secondary, marginTop: 2 },
              ]}
            >
              {module.subtitle}
            </Text>
          </View>
          <Text style={{ color: module.accent, fontSize: 20 }}>›</Text>
        </Pressable>
      ))}

      <View style={{ flex: 1 }} />

      <AuthButton
        label="Sign out"
        variant="secondary"
        loading={logoutMutation.isPending}
        onPress={() => logoutMutation.mutate()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  moduleCard: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
    marginBottom: 12,
    padding: 16,
  },
  moduleIcon: {
    alignItems: 'center',
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  root: { flex: 1 },
});
