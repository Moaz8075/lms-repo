import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  DashboardHeader,
  HearingCard,
  PaymentCard,
  QuickActions,
  RecentCaseItem,
  SectionHeader,
  StatsCards,
  TaskListItem,
} from '@/features/dashboard/components';
import { useDashboard } from '@/features/dashboard/hooks/useDashboard';
import { useUpdateTaskStatus } from '@/features/dashboard/hooks/useUpdateTaskStatus';
import { useAuthContext, useTheme } from '@/providers';
import { formatHeaderDate, getGreeting } from '@/utils/greeting';
import type { TaskStatus } from '@/types/dashboard';

const QUICK_ACTIONS = [
  { id: 'case', label: 'New Case', icon: '➕' },
  { id: 'client', label: 'New Client', icon: '👤' },
  { id: 'schedule', label: 'Schedule', icon: '📅' },
  { id: 'payments', label: 'Payments', icon: '💳' },
];

export default function DashboardScreen() {
  const router = useRouter();
  const { user, organization } = useAuthContext();
  const { colors, typography, spacing, borderRadius, shadows } = useTheme();
  const insets = useSafeAreaInsets();
  const { data, isLoading, isError, refetch, isRefetching } = useDashboard();
  const updateTask = useUpdateTaskStatus();
  const [pendingTaskId, setPendingTaskId] = useState<string | null>(null);

  const handleTaskToggle = async (taskId: string, completed: boolean) => {
    setPendingTaskId(taskId);
    try {
      await updateTask.mutateAsync({
        taskId,
        status: (completed ? 'COMPLETED' : 'PENDING') as TaskStatus,
      });
    } finally {
      setPendingTaskId(null);
    }
  };

  if (!user) {
    return null;
  }

  const locationLabel = organization?.address?.split(',')[0]?.trim() ?? organization?.name;

  return (
    <View style={[styles.root, { backgroundColor: colors.background.default }]}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + spacing.md,
          paddingHorizontal: spacing.lg,
          paddingBottom: insets.bottom + 96,
        }}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={() => void refetch()} />
        }
        showsVerticalScrollIndicator={false}
      >
        <DashboardHeader
          appName="LegalEase"
          greeting={getGreeting(user.firstName)}
          dateLabel={formatHeaderDate()}
          locationLabel={locationLabel}
          firstName={user.firstName}
          lastName={user.lastName}
        />

        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.primary.main} />
          </View>
        ) : isError ? (
          <View style={[styles.errorBox, { backgroundColor: colors.error.light, borderRadius: borderRadius.lg }]}>
            <Text style={[typography.body, { color: colors.error.dark }]}>
              Unable to load dashboard. Pull to refresh or check your connection.
            </Text>
            <Pressable onPress={() => void refetch()} style={{ marginTop: spacing.sm }}>
              <Text style={[typography.label, { color: colors.primary.main }]}>Retry</Text>
            </Pressable>
          </View>
        ) : data ? (
          <>
            <StatsCards stats={data.stats} />

            <View style={{ marginTop: spacing.xl }}>
              <QuickActions
                actions={QUICK_ACTIONS}
                onPress={(id) => {
                  if (id === 'case') router.push('/(protected)/(tabs)/cases/new');
                  if (id === 'client') router.push('/(protected)/(tabs)/more/clients' as never);
                  if (id === 'schedule') router.push('/(protected)/(tabs)/diary' as never);
                  if (id === 'payments') router.push('/(protected)/(tabs)/cases');
                }}
              />
            </View>

            <View style={{ marginTop: spacing['2xl'] }}>
              <SectionHeader title="Today's Hearings" actionLabel="View All" />
              {data.todaysHearings.length === 0 ? (
                <Text style={[typography.bodySmall, { color: colors.text.secondary }]}>
                  No hearings scheduled for today.
                </Text>
              ) : (
                <View style={{ gap: 12 }}>
                  {data.todaysHearings.map((hearing) => (
                    <HearingCard key={hearing.hearingId} hearing={hearing} />
                  ))}
                </View>
              )}
            </View>

            <View style={{ marginTop: spacing['2xl'] }}>
              <SectionHeader title="Today's Tasks" />
              <View
                style={[
                  styles.panel,
                  {
                    backgroundColor: colors.background.paper,
                    borderRadius: borderRadius.lg,
                    ...shadows.sm,
                  },
                ]}
              >
                {data.todaysTasks.length === 0 ? (
                  <Text style={[typography.bodySmall, { color: colors.text.secondary, padding: 16 }]}>
                    No tasks for today.
                  </Text>
                ) : (
                  data.todaysTasks.map((task) => (
                    <TaskListItem
                      key={task.id}
                      task={task}
                      loading={pendingTaskId === task.id && updateTask.isPending}
                      onToggle={handleTaskToggle}
                    />
                  ))
                )}
              </View>
            </View>

            <View style={{ marginTop: spacing['2xl'] }}>
              <SectionHeader title="Pending Payments" actionLabel="View All" />
              {data.pendingPayments.length === 0 ? (
                <Text style={[typography.bodySmall, { color: colors.text.secondary }]}>
                  No pending payments.
                </Text>
              ) : (
                <View style={{ gap: 12 }}>
                  {data.pendingPayments.map((payment) => (
                    <PaymentCard key={payment.id} payment={payment} />
                  ))}
                </View>
              )}
            </View>

            <View style={{ marginTop: spacing['2xl'] }}>
              <SectionHeader title="Recent Cases" />
              <View style={{ gap: 10 }}>
                {data.recentCases.length === 0 ? (
                  <Text style={[typography.bodySmall, { color: colors.text.secondary }]}>
                    No cases yet.
                  </Text>
                ) : (
                  data.recentCases.map((caseItem) => (
                    <RecentCaseItem key={caseItem.id} caseItem={caseItem} />
                  ))
                )}
              </View>
            </View>
          </>
        ) : null}
      </ScrollView>

      <Pressable
        style={[
          styles.fab,
          {
            backgroundColor: colors.primary.main,
            bottom: insets.bottom + 76,
            ...shadows.lg,
          },
        ]}
      >
        <Text style={{ color: colors.primary.contrast, fontSize: 28, lineHeight: 30 }}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  errorBox: {
    padding: 16,
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
  panel: {
    overflow: 'hidden',
  },
  root: {
    flex: 1,
  },
});
