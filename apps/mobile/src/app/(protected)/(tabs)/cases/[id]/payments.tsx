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
import { useCasePayments } from '@/features/cases/hooks/useCasePayments';
import { useAuthContext, useTheme } from '@/providers';
import { formatCurrency } from '@/utils/format-currency';
import { formatDate } from '@/utils/format-date';

export default function CasePaymentsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { user } = useAuthContext();
  const { typography, colors, borderRadius, spacing } = useTheme();

  const caseId = id ?? '';
  const { data: caseData } = useCase(caseId);
  const { data: paymentsData, isLoading } = useCasePayments(caseId);

  const summary = paymentsData?.summary;
  const received = summary?.totalPaid ?? caseData?.paymentsSummary.paid ?? 0;
  const remaining = summary?.remainingBalance ?? caseData?.paymentsSummary.pending ?? 0;
  const agreedAmount =
    summary?.agreedAmount ??
    (received + remaining > 0 ? received + remaining : undefined);
  const totalFee =
    agreedAmount ?? paymentsData?.items.reduce((sum, item) => sum + item.amount, 0) ?? 0;

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
          title={caseData?.caseNumber ?? 'Payments'}
          showBack
          onBack={() => router.back()}
        />

        <Text style={[typography.bodySmall, { color: colors.text.secondary }]}>Payments History</Text>

        <View style={[styles.totalCard, { backgroundColor: colors.primary.main, borderRadius: borderRadius.lg }]}>
          <Text style={[typography.caption, { color: '#DBEAFE', fontWeight: '700' }]}>TOTAL FEE</Text>
          <Text style={[typography.h2, { color: '#FFFFFF', marginTop: 4 }]}>
            {formatCurrency(totalFee)}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { borderColor: colors.border.default, borderRadius: borderRadius.lg }]}>
            <Text style={[typography.caption, { fontWeight: '700' }]}>RECEIVED</Text>
            <Text style={[typography.h3, { marginTop: 4 }]}>{formatCurrency(received)}</Text>
          </View>
          <View style={[styles.summaryCard, { borderColor: colors.border.default, borderRadius: borderRadius.lg }]}>
            <Text style={[typography.caption, { fontWeight: '700', color: colors.error.main }]}>REMAINING</Text>
            <Text style={[typography.h3, { color: colors.error.main, marginTop: 4 }]}>
              {formatCurrency(remaining)}
            </Text>
          </View>
        </View>

        <Text style={[typography.h3, { marginTop: 24, marginBottom: 12 }]}>Transaction History</Text>

        {isLoading ? <ActivityIndicator color={colors.primary.main} /> : null}

        {(paymentsData?.items ?? []).map((payment) => (
          <View
            key={payment.id}
            style={[
              styles.txCard,
              {
                backgroundColor: colors.background.paper,
                borderColor: colors.border.default,
                borderRadius: borderRadius.lg,
              },
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text style={[typography.body, { fontWeight: '700' }]}>
                {payment.notes || `${payment.paymentMethod} payment`}
              </Text>
              <Text style={[typography.caption, { color: colors.text.secondary, marginTop: 2 }]}>
                {formatDate(payment.paidDate ?? payment.createdAt)}
                {payment.paymentMethod ? ` • ${payment.paymentMethod}` : ''}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[typography.body, { fontWeight: '800' }]}>
                {formatCurrency(payment.amount, payment.currency)}
              </Text>
              <Text
                style={[
                  typography.caption,
                  {
                    color: payment.status === 'paid' ? colors.primary.main : colors.error.main,
                    fontWeight: '700',
                    marginTop: 2,
                  },
                ]}
              >
                {payment.status.toUpperCase()}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    flex: 1,
    padding: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  totalCard: {
    marginTop: 16,
    padding: 18,
  },
  txCard: {
    alignItems: 'center',
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
    padding: 14,
  },
});
