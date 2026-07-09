import { useMemo } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppTabHeader } from '@/components/layout/AppTabHeader';
import { useCase } from '@/features/cases/hooks/useCases';
import { useCaseHearings } from '@/features/cases/hooks/useCaseHearings';
import { useAuthContext, useTheme } from '@/providers';
import { formatDate, formatTime } from '@/utils/format-date';

export default function CaseTimelineScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { user } = useAuthContext();
  const { typography, colors, borderRadius, spacing } = useTheme();

  const caseId = id ?? '';
  const { data: caseData } = useCase(caseId);
  const { data: hearingsData, isLoading } = useCaseHearings(caseId);

  const { upcoming, past } = useMemo(() => {
    const now = new Date();
    const items = hearingsData?.items ?? [];
    return {
      upcoming: items
        .filter((item) => new Date(item.scheduledDate) >= now)
        .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()),
      past: items
        .filter((item) => new Date(item.scheduledDate) < now)
        .sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime()),
    };
  }, [hearingsData?.items]);

  if (!user) return null;

  return (
    <View style={[styles.root, { backgroundColor: colors.background.default }]}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + spacing.md,
          paddingHorizontal: spacing.lg,
          paddingBottom: insets.bottom + 96,
        }}
      >
        <AppTabHeader
          firstName={user.firstName}
          lastName={user.lastName}
          title="Case Timeline"
          showBack
          onBack={() => router.back()}
        />

        <Text style={[typography.caption, { color: colors.text.secondary, letterSpacing: 0.6 }]}>
          CASE REFERENCE
        </Text>
        <Text style={[typography.h2, { marginTop: 4 }]}>{caseData?.title ?? '—'}</Text>

        {isLoading ? <ActivityIndicator color={colors.primary.main} style={{ marginTop: 24 }} /> : null}

        <Text style={[typography.h3, { color: colors.primary.main, marginTop: 24, marginBottom: 12 }]}>
          Upcoming Hearing
        </Text>
        {upcoming.length === 0 ? (
          <Text style={[typography.bodySmall, { color: colors.text.secondary }]}>No upcoming hearings.</Text>
        ) : (
          upcoming.map((hearing) => (
            <View
              key={hearing.id}
              style={[
                styles.card,
                {
                  backgroundColor: colors.background.paper,
                  borderColor: colors.primary.main,
                  borderRadius: borderRadius.lg,
                },
              ]}
            >
              <Text style={[typography.label, { color: colors.primary.main }]}>
                {formatDate(hearing.hearingDate, { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
              </Text>
              <Text style={[typography.bodySmall, { fontStyle: 'italic', marginTop: 4 }]}>
                {formatTime(hearing.time)}
              </Text>
              <Text style={[typography.body, { fontWeight: '700', marginTop: 8 }]}>
                {hearing.purpose ?? 'Hearing'}
              </Text>
              {hearing.courtRoom ? (
                <Text style={[typography.bodySmall, { marginTop: 4 }]}>Room: {hearing.courtRoom}</Text>
              ) : null}
              {hearing.notes ? (
                <Text style={[typography.bodySmall, { marginTop: 8, fontStyle: 'italic' }]}>
                  Strategy: {hearing.notes}
                </Text>
              ) : null}
            </View>
          ))
        )}

        <Text style={[typography.h3, { marginTop: 28, marginBottom: 12 }]}>Past Proceedings</Text>
        {past.map((hearing) => (
          <View
            key={hearing.id}
            style={[
              styles.card,
              {
                backgroundColor: colors.background.paper,
                borderColor: colors.border.default,
                borderRadius: borderRadius.lg,
              },
            ]}
          >
            <Text style={[typography.caption, { color: colors.text.secondary }]}>
              {formatDate(hearing.hearingDate, { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
            </Text>
            <Text style={[typography.body, { fontWeight: '700', marginTop: 6 }]}>
              {hearing.purpose ?? 'Proceeding'}
            </Text>
            {hearing.notes ? (
              <View style={[styles.quote, { borderLeftColor: colors.primary.main, marginTop: 10 }]}>
                <Text style={[typography.bodySmall, { fontStyle: 'italic' }]}>{hearing.notes}</Text>
              </View>
            ) : null}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    marginBottom: 12,
    padding: 16,
  },
  quote: {
    borderLeftWidth: 3,
    paddingLeft: 12,
  },
  root: { flex: 1 },
});
