export function formatCurrency(
  amount: string | number | null | undefined,
  currency = 'PKR',
): string {
  if (amount === null || amount === undefined || amount === '') return '—';

  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (Number.isNaN(value)) return '—';

  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function parseCurrency(value: string): number | null {
  const normalized = value.replace(/[^\d.-]/g, '');
  if (!normalized) return null;

  const parsed = parseFloat(normalized);
  return Number.isNaN(parsed) ? null : parsed;
}
