import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppTabHeader } from '@/components/layout/AppTabHeader';
import { useDiaryEntry } from '@/features/diary/hooks/useDiary';
import { formatCaseStatus, formatCaseType } from '@/features/cases/utils/case-format';
import { formatHearingClock } from '@/features/diary/utils/diary-format';
import { useAuthContext, useTheme } from '@/providers';
import { formatCurrency } from '@/utils/format-currency';
import { formatDate } from '@/utils/format-date';

export default function DiaryEntryDetailScreen() {
  const router = useRouter();
  const { hearingId } = useLocalSearchParams<{ hearingId: string }>();
  const insets = useSafeAreaInsets();
  const { user } = useAuthContext();
  const { typography, colors, borderRadius, spacing } = useTheme();

  const id = hearingId ?? '';
  const { data, isLoading, isError, refetch, isRefetching } = useDiaryEntry(id);

  if (!user) return null;

  const paid = data?.case.paymentsSummary.paid ?? 0;
  const total = data?.case.paymentsSummary.total || paid + (data?.case.paymentsSummary.pending ?? 0);
  const remaining = Math.max(total - paid, 0);
  const progress = total > 0 ? Math.min(paid / total, 1) : 0;

  return (
    <View style={[styles.root, { backgroundColor: colors.background.default }]}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + spacing.md,
          paddingHorizontal: spacing.lg,
          paddingBottom: insets.bottom + 40,
        }}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={() => void refetch()} />
        }
      >
        <AppTabHeader
          firstName={user.firstName}
          lastName={user.lastName}
          title="Diary Entry"
          showBack
          onBack={() => router.back()}
        />

        <Text style={[typography.caption, { color: colors.text.secondary }]}>
          Diary › Entry
        </Text>

        {isLoading ? <ActivityIndicator color={colors.primary.main} style={{ marginTop: 24 }} /> : null}
        {isError ? (
          <Text style={{ color: colors.error.main, marginTop: 16 }}>Unable to load diary entry.</Text>
        ) : null}

        {data ? (
          <>
            <Text style={[typography.h2, { marginTop: 8 }]}>{data.case.title}</Text>
            <Text style={[typography.bodySmall, { color: colors.text.secondary, marginTop: 4 }]}>
              {formatCaseType(data.case.caseType)} • {data.hearing.purpose ?? 'Hearing'}
            </Text>

            <View
              style={[
                styles.nextBanner,
                { backgroundColor: colors.primary.main, borderRadius: borderRadius.lg },
              ]}
            >
              <Text style={[typography.caption, { color: '#DBEAFE', fontWeight: '700' }]}>
                NEXT HEARING DATE
              </Text>
              <Text style={[typography.h3, { color: '#fff', marginTop: 4 }]}>
                {data.hearing.nextHearingDate
                  ? formatDate(data.hearing.nextHearingDate, {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'Not scheduled'}
              </Text>
            </View>

            <View style={[styles.card, { backgroundColor: colors.background.paper, borderRadius: borderRadius.lg }]}>
              <View style={styles.cardHeader}>
                <Text style={[typography.body, { fontWeight: '700' }]}>📄 Case Overview</Text>
                <View style={[styles.status, { backgroundColor: colors.primary.light }]}>
                  <Text style={[typography.caption, { color: colors.primary.dark, fontWeight: '700' }]}>
                    {formatCaseStatus(data.case.status)}
                  </Text>
                </View>
              </View>
              <Field label="CASE NUMBER" value={data.case.caseNumber} />
              <Field label="CLIENT NAME" value={data.case.clientName} />
              <Field label="CONTACT" value={data.case.clientPhone ?? '—'} />
              <Field label="COURT" value={data.case.courtName ?? '—'} />
              <Field label="PRESIDING JUDGE" value={data.case.judgeName ?? '—'} />
              <Field
                label="LAST ACTION TAKEN"
                value={data.hearing.purpose ?? '—'}
                valueColor={colors.primary.main}
              />
              <Field
                label="HEARING TIME"
                value={`${formatDate(data.hearing.hearingDate)} • ${formatHearingClock(data.hearing.time)}`}
              />
              {data.hearing.courtRoom ? (
                <Field label="COURT ROOM" value={data.hearing.courtRoom} />
              ) : null}
            </View>

            <View style={[styles.card, { backgroundColor: colors.background.paper, borderRadius: borderRadius.lg }]}>
              <Text style={[typography.body, { fontWeight: '700', marginBottom: 10 }]}>
                ⚖️ Judge Remarks & Proceedings
              </Text>
              <View
                style={[
                  styles.quote,
                  { backgroundColor: colors.primary.light, borderLeftColor: colors.primary.main },
                ]}
              >
                <Text style={[typography.bodySmall, { fontStyle: 'italic' }]}>
                  {data.hearing.notes || 'No remarks logged for this hearing yet.'}
                </Text>
              </View>
              <Text style={[typography.caption, styles.subLabel]}>HEARING ACTION</Text>
              <Text style={typography.bodySmall}>{data.hearing.purpose ?? '—'}</Text>
            </View>

            <Pressable
              onPress={() =>
                router.push(
                  `/(protected)/(tabs)/cases/${data.case.id}/payments` as Href,
                )
              }
            >
              <View
                style={[
                  styles.card,
                  { backgroundColor: colors.background.paper, borderRadius: borderRadius.lg },
                ]}
              >
                <Text style={[typography.body, { fontWeight: '700', marginBottom: 10 }]}>
                  💳 Billing
                </Text>
                <Field label="Professional Fee" value={formatCurrency(total)} />
                <Field label="Paid Amount" value={formatCurrency(paid)} valueColor={colors.primary.main} />
                <View style={[styles.progressTrack, { backgroundColor: colors.neutral[200] }]}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        backgroundColor: colors.primary.main,
                        width: `${progress * 100}%`,
                      },
                    ]}
                  />
                </View>
                <Field
                  label="Outstanding Balance"
                  value={formatCurrency(remaining)}
                  valueColor={colors.error.main}
                />
              </View>
            </Pressable>

            <Pressable
              onPress={() =>
                router.push(`/(protected)/(tabs)/cases/${data.case.id}` as Href)
              }
            >              <View
                style={[
                  styles.card,
                  { backgroundColor: colors.background.paper, borderRadius: borderRadius.lg },
                ]}
              >
                <Text style={[typography.body, { fontWeight: '700' }]}>
                  📁 Documents ({data.case.documentsCount})
                </Text>
                <Text style={[typography.label, { color: colors.primary.main, marginTop: 8 }]}>
                  Open case for documents ›
                </Text>
              </View>
            </Pressable>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}

function Field({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  const { typography, colors } = useTheme();
  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={[typography.caption, { color: '#9CA3AF', fontWeight: '700' }]}>{label}</Text>
      <Text style={[typography.bodySmall, { color: valueColor ?? colors.text.primary, marginTop: 2 }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 14,
    padding: 16,
  },
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  nextBanner: {
    marginTop: 16,
    padding: 16,
  },
  progressFill: {
    borderRadius: 4,
    height: 8,
  },
  progressTrack: {
    borderRadius: 4,
    height: 8,
    marginBottom: 10,
    marginTop: 4,
    overflow: 'hidden',
  },
  quote: {
    borderLeftWidth: 3,
    marginBottom: 12,
    padding: 12,
  },
  root: { flex: 1 },
  status: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  subLabel: {
    color: '#9CA3AF',
    fontWeight: '700',
    marginBottom: 4,
    marginTop: 4,
  },
});
