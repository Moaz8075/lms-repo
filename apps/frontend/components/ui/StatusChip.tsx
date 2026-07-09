import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { CaseStatus, PaymentStatus } from '@/types';
import { STATUS_CHIP_STYLES } from '@/utils/design-tokens';

type ChipStyle = { bg: string; color: string; border: string; dot: string };

function formatLabel(value: string): string {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function ColorChip({ label, style }: { label: string; style: ChipStyle }) {
  return (
    <Chip
      label={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Box
            sx={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              bgcolor: style.dot,
              flexShrink: 0,
            }}
          />
          {label}
        </Box>
      }
      size="small"
      sx={{
        bgcolor: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        fontWeight: 600,
        fontSize: 12,
        height: 26,
        '& .MuiChip-label': { px: 1.25 },
      }}
    />
  );
}

function StatusChip({
  status,
  styles,
}: {
  status: string;
  styles: Record<string, ChipStyle>;
}) {
  const fallback: ChipStyle = {
    bg: '#F1F3F4',
    color: '#5F6368',
    border: '#DADCE0',
    dot: '#80868B',
  };
  const style = styles[status] ?? fallback;
  return <ColorChip label={formatLabel(status)} style={style} />;
}

const CASE_STATUS_STYLES: Record<string, ChipStyle> = {
  [CaseStatus.OPEN]: STATUS_CHIP_STYLES.open,
  [CaseStatus.IN_PROGRESS]: STATUS_CHIP_STYLES.inProgress,
  [CaseStatus.CLOSED]: STATUS_CHIP_STYLES.closed,
  [CaseStatus.ARCHIVED]: STATUS_CHIP_STYLES.archived,
};

const PAYMENT_STATUS_STYLES: Record<string, ChipStyle> = {
  [PaymentStatus.PENDING]: STATUS_CHIP_STYLES.pending,
  [PaymentStatus.PARTIAL]: STATUS_CHIP_STYLES.partial,
  [PaymentStatus.PAID]: STATUS_CHIP_STYLES.paid,
  OVERDUE: STATUS_CHIP_STYLES.overdue,
  CANCELLED: STATUS_CHIP_STYLES.cancelled,
  REFUNDED: STATUS_CHIP_STYLES.archived,
};

export function CaseStatusChip({ status }: { status: CaseStatus | string }) {
  return <StatusChip status={status} styles={CASE_STATUS_STYLES} />;
}

export function PaymentStatusChip({ status }: { status: PaymentStatus | string }) {
  return <StatusChip status={status} styles={PAYMENT_STATUS_STYLES} />;
}

export function ActiveStatusChip({ active }: { active: boolean }) {
  const style = active ? STATUS_CHIP_STYLES.active : STATUS_CHIP_STYLES.inactive;
  return <ColorChip label={active ? 'Active' : 'Inactive'} style={style} />;
}

export function CaseTypeChip({ caseType }: { caseType: string }) {
  const typeColors: Record<string, ChipStyle> = {
    CIVIL: { bg: '#E8F0FE', color: '#1A73E8', border: '#C2D9F7', dot: '#1A73E8' },
    CRIMINAL: { bg: '#FCE8E6', color: '#B91C1C', border: '#F5C6C2', dot: '#DC2626' },
    FAMILY: { bg: '#F3E8FD', color: '#7E22CE', border: '#E9D5FF', dot: '#9333EA' },
    CORPORATE: { bg: '#E8EAFD', color: '#3730A3', border: '#C5CAFC', dot: '#4F46E5' },
    CONSTITUTIONAL: { bg: '#E0F2F1', color: '#0F766E', border: '#B2DFDB', dot: '#0D9488' },
    REVENUE: { bg: '#FEF7E0', color: '#B45309', border: '#F9E6A8', dot: '#F59E0B' },
    OTHER: STATUS_CHIP_STYLES.archived,
  };
  const style = typeColors[caseType] ?? STATUS_CHIP_STYLES.archived;
  return <ColorChip label={formatLabel(caseType)} style={style} />;
}

export function TagChip({ label }: { label: string }) {
  return (
    <Chip
      label={label}
      size="small"
      sx={{
        bgcolor: '#E8EAFD',
        color: '#4F46E5',
        border: '1px solid #C5CAFC',
        fontWeight: 600,
        fontSize: 11,
        height: 24,
        mr: 0.5,
      }}
    />
  );
}

export function PaymentMethodChip({ method }: { method: string }) {
  const methodColors: Record<string, ChipStyle> = {
    cash: { bg: '#E6F4EA', color: '#15803D', border: '#B7DFC0', dot: '#16A34A' },
    bank: { bg: '#E8F0FE', color: '#1557B0', border: '#C2D9F7', dot: '#1A73E8' },
    jazzcash: { bg: '#FCE8E6', color: '#B91C1C', border: '#F5C6C2', dot: '#DC2626' },
    easypaisa: { bg: '#E6F4EA', color: '#15803D', border: '#B7DFC0', dot: '#16A34A' },
    CASH: { bg: '#E6F4EA', color: '#15803D', border: '#B7DFC0', dot: '#16A34A' },
    BANK_TRANSFER: { bg: '#E8F0FE', color: '#1557B0', border: '#C2D9F7', dot: '#1A73E8' },
    JAZZCASH: { bg: '#FCE8E6', color: '#B91C1C', border: '#F5C6C2', dot: '#DC2626' },
    EASYPAISA: { bg: '#E6F4EA', color: '#15803D', border: '#B7DFC0', dot: '#16A34A' },
  };
  const key = method.toLowerCase();
  const style = methodColors[key] ?? methodColors[method] ?? STATUS_CHIP_STYLES.archived;
  return <ColorChip label={formatLabel(method)} style={style} />;
}
