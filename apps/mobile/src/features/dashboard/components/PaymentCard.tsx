import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/providers';
import { formatCurrency } from '@/utils/format-currency';
import { formatDate } from '@/utils/format-date';
import type { DashboardPendingPayment } from '@/types/dashboard';

interface PaymentCardProps {
  payment: DashboardPendingPayment;
}

export function PaymentCard({ payment }: PaymentCardProps) {
  const { typography, colors, borderRadius, spacing, shadows } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.background.paper,
          borderRadius: borderRadius.lg,
          padding: spacing.lg,
          ...shadows.sm,
        },
      ]}
    >
      <View style={[styles.icon, { backgroundColor: colors.error.light }]}>
        <Text style={{ fontSize: 18 }}>💳</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={[typography.body, { fontWeight: '700', color: colors.text.primary }]}>
          {payment.clientName ?? payment.caseTitle}
        </Text>
        <Text style={[typography.caption, { color: colors.text.secondary, marginTop: 2 }]}>
          {payment.caseNumber}
          {payment.dueDate ? ` • DUE ${formatDate(payment.dueDate, { month: 'short', day: 'numeric' }).toUpperCase()}` : ''}
        </Text>
      </View>

      <View style={{ alignItems: 'flex-end' }}>
        <Text style={[typography.body, { fontWeight: '800', color: colors.error.main }]}>
          {formatCurrency(payment.amount, payment.currency)}
        </Text>
        <Text style={[typography.caption, { color: colors.error.main, fontWeight: '700', marginTop: 2 }]}>
          {payment.status.toUpperCase()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  icon: {
    alignItems: 'center',
    borderRadius: 12,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
});
