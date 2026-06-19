import Chip from '@mui/material/Chip';
import { CaseStatus, PaymentStatus } from '@/types';

const CASE_STATUS_COLORS: Record<CaseStatus, 'default' | 'primary' | 'success' | 'warning' | 'error'> = {
  [CaseStatus.OPEN]: 'primary',
  [CaseStatus.IN_PROGRESS]: 'warning',
  [CaseStatus.CLOSED]: 'success',
  [CaseStatus.ARCHIVED]: 'default',
};

const PAYMENT_STATUS_COLORS: Record<PaymentStatus, 'default' | 'primary' | 'success' | 'warning' | 'error'> = {
  [PaymentStatus.PENDING]: 'warning',
  [PaymentStatus.PARTIAL]: 'primary',
  [PaymentStatus.PAID]: 'success',
  [PaymentStatus.OVERDUE]: 'error',
  [PaymentStatus.CANCELLED]: 'default',
  [PaymentStatus.REFUNDED]: 'default',
};

function formatLabel(value: string): string {
  return value.replace(/_/g, ' ');
}

export function CaseStatusChip({ status }: { status: CaseStatus }) {
  return (
    <Chip
      label={formatLabel(status)}
      color={CASE_STATUS_COLORS[status]}
      size="small"
      variant="outlined"
    />
  );
}

export function PaymentStatusChip({ status }: { status: PaymentStatus }) {
  return (
    <Chip
      label={formatLabel(status)}
      color={PAYMENT_STATUS_COLORS[status]}
      size="small"
      variant="outlined"
    />
  );
}
