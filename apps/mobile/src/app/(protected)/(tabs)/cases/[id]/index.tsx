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
import { AccordionSection } from '@/features/cases/components';
import { useCase } from '@/features/cases/hooks/useCases';
import { useCaseHearings } from '@/features/cases/hooks/useCaseHearings';
import {
  useCaseReferences,
  useDetachCaseReference,
} from '@/features/legal-research/hooks';
import { legalResearchRoutes } from '@/features/legal-research/routes';
import { useAuthContext, useTheme } from '@/providers';
import {
  formatCaseStatus,
  formatCaseType,
  formatNextHearing,
  getCaseStatusBadgeColor,
} from '@/features/cases/utils/case-format';
import { formatRelativeTime } from '@/utils/relative-time';
import { formatCurrency } from '@/utils/format-currency';
import { formatDate } from '@/utils/format-date';

export default function CaseDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { user } = useAuthContext();
  const { typography, colors, borderRadius, spacing } = useTheme();

  const caseId = id ?? '';
  const { data: caseData, isLoading, isError } = useCase(caseId);
  const { data: hearingsData } = useCaseHearings(caseId);
  const { data: references } = useCaseReferences(caseId);
  const detachReference = useDetachCaseReference();

  const upcomingHearing = hearingsData?.items
    .filter((hearing) => new Date(hearing.scheduledDate) >= new Date())
    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())[0];

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
          title={caseData ? caseData.caseNumber : 'Case'}
          showBack
          onBack={() => router.back()}
        />

        {isLoading ? <ActivityIndicator color={colors.primary.main} /> : null}
        {isError ? (
          <Text style={{ color: colors.error.main }}>Unable to load case details.</Text>
        ) : null}

        {caseData ? (
          <>
            <View style={styles.titleRow}>
              {(() => {
                const badge = getCaseStatusBadgeColor(caseData.status);
                return (
                  <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                    <Text style={[typography.caption, { color: badge.text, fontWeight: '700' }]}>
                      {formatCaseStatus(caseData.status)}
                    </Text>
                  </View>
                );
              })()}
              <Text style={[typography.caption, { color: colors.text.secondary }]}>
                Updated {formatRelativeTime(caseData.updatedAt)}
              </Text>
            </View>

            <Text style={[typography.h2, { marginTop: 8 }]}>{caseData.title}</Text>
            <Text style={[typography.bodySmall, { color: colors.text.secondary, marginTop: 4, fontStyle: 'italic' }]}>
              {formatCaseType(caseData.caseType)}
              {caseData.courtName ? ` • ${caseData.courtName}` : ''}
            </Text>

            <View style={{ marginTop: spacing.xl }}>
              <AccordionSection title="Case Summary" icon="📄">
                <Text style={typography.body}>
                  {caseData.description || 'No description added yet.'}
                </Text>
                <Text style={[typography.bodySmall, { marginTop: 8, color: colors.text.secondary }]}>
                  Opponent: {caseData.opposingParty ?? '—'}
                </Text>
              </AccordionSection>

              <AccordionSection title="Client Info" icon="👤">
                <Text style={[typography.body, { fontWeight: '700' }]}>
                  {caseData.client?.name ?? '—'}
                </Text>
                <Text style={[typography.bodySmall, { color: colors.text.secondary, marginTop: 4 }]}>
                  {caseData.client?.phone ?? ''}
                </Text>
              </AccordionSection>

              <AccordionSection title="Upcoming Hearing" icon="📅" defaultOpen>
                {upcomingHearing ? (
                  <View style={[styles.hearingBox, { backgroundColor: colors.primary.light, borderRadius: borderRadius.md }]}>
                    <Text style={[typography.label, { color: colors.primary.dark }]}>
                      {formatNextHearing(upcomingHearing.hearingDate, upcomingHearing.time)}
                    </Text>
                    <Text style={[typography.bodySmall, { marginTop: 6 }]}>
                      Purpose: {upcomingHearing.purpose ?? '—'}
                    </Text>
                    {upcomingHearing.courtRoom ? (
                      <Text style={[typography.bodySmall, { marginTop: 4 }]}>
                        Room: {upcomingHearing.courtRoom}
                      </Text>
                    ) : null}
                  </View>
                ) : (
                  <Text style={typography.bodySmall}>
                    Next: {formatNextHearing(caseData.nextHearingDate)}
                  </Text>
                )}
              </AccordionSection>

              <Pressable onPress={() => router.push(`/(protected)/(tabs)/cases/${caseId}/timeline`)}>
                <AccordionSection title="Case Timeline" icon="📈">
                  <Text style={[typography.label, { color: colors.primary.main }]}>
                    View full timeline ›
                  </Text>
                </AccordionSection>
              </Pressable>

              <AccordionSection title="Documents" icon="📁" badge={String(caseData.documentsCount)}>
                <Text style={typography.bodySmall}>
                  {caseData.documentsCount} document(s) attached to this case.
                </Text>
              </AccordionSection>

              <AccordionSection
                title="Legal References"
                icon="⚖️"
                badge={String(references?.length ?? 0)}
                defaultOpen
              >
                {(references ?? []).length === 0 ? (
                  <Text style={[typography.bodySmall, { color: colors.text.secondary }]}>
                    No research notes attached yet.
                  </Text>
                ) : (
                  (references ?? []).map((ref) => (
                    <View
                      key={ref.id}
                      style={[
                        styles.refCard,
                        {
                          backgroundColor: colors.neutral[50],
                          borderRadius: borderRadius.md,
                          marginBottom: 10,
                        },
                      ]}
                    >
                      <Pressable
                        onPress={() =>
                          router.push(legalResearchRoutes.note(ref.legalNote.id))
                        }
                      >
                        <Text style={[typography.bodySmall, { fontWeight: '700' }]}>
                          {ref.legalNote.title}
                        </Text>
                        <Text
                          style={[
                            typography.caption,
                            {
                              color: colors.text.secondary,
                              marginTop: 4,
                              fontStyle: 'italic',
                            },
                          ]}
                          numberOfLines={2}
                        >
                          “{ref.legalNote.selectedText}”
                        </Text>
                        <Text
                          style={[
                            typography.caption,
                            { color: colors.text.disabled, marginTop: 6 },
                          ]}
                        >
                          Attached {formatDate(ref.attachedAt)}
                        </Text>
                      </Pressable>
                      <View style={styles.refActions}>
                        <Pressable
                          onPress={() =>
                            router.push(legalResearchRoutes.print(ref.legalNote.id))
                          }
                        >
                          <Text
                            style={[
                              typography.caption,
                              { color: colors.primary.main, fontWeight: '700' },
                            ]}
                          >
                            Print
                          </Text>
                        </Pressable>
                        <Pressable
                          onPress={() =>
                            Alert.alert(
                              'Detach reference?',
                              'Remove this note from the case (note is kept).',
                              [
                                { text: 'Cancel', style: 'cancel' },
                                {
                                  text: 'Detach',
                                  style: 'destructive',
                                  onPress: () =>
                                    void detachReference.mutateAsync({
                                      caseId,
                                      referenceId: ref.id,
                                    }),
                                },
                              ],
                            )
                          }
                        >
                          <Text
                            style={[
                              typography.caption,
                              { color: colors.error.main, fontWeight: '700' },
                            ]}
                          >
                            Detach
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  ))
                )}
                <Pressable
                  onPress={() =>
                    router.push(legalResearchRoutes.attachToCase(caseId))
                  }
                  style={{ marginTop: 4 }}
                >
                  <Text style={[typography.label, { color: colors.primary.main }]}>
                    + Attach research note ›
                  </Text>
                </Pressable>
              </AccordionSection>

              <Pressable onPress={() => router.push(`/(protected)/(tabs)/cases/${caseId}/payments`)}>
                <AccordionSection title="Financials" icon="💳">
                  <Text style={typography.bodySmall}>
                    Paid: {formatCurrency(caseData.paymentsSummary.paid)} • Pending:{' '}
                    {formatCurrency(caseData.paymentsSummary.pending)}
                  </Text>
                  <Text style={[typography.label, { color: colors.primary.main, marginTop: 8 }]}>
                    View payments history ›
                  </Text>
                </AccordionSection>
              </Pressable>
            </View>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  hearingBox: { padding: 14 },
  refActions: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 10,
  },
  refCard: { padding: 12 },
  root: { flex: 1 },
  statusBadge: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  titleRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
});
