export const ACCENT_COLORS = {
  blue: {
    bg: '#E8F0FE',
    light: '#F4F8FF',
    border: '#C2D9F7',
    main: '#1A73E8',
    dark: '#1557B0',
  },
  indigo: {
    bg: '#E8EAFD',
    light: '#F3F4FF',
    border: '#C5CAFC',
    main: '#4F46E5',
    dark: '#3730A3',
  },
  violet: {
    bg: '#EDE7F6',
    light: '#F7F3FC',
    border: '#D1C4E9',
    main: '#7C3AED',
    dark: '#5B21B6',
  },
  amber: {
    bg: '#FEF7E0',
    light: '#FFFBF0',
    border: '#F9E6A8',
    main: '#F59E0B',
    dark: '#B45309',
  },
  teal: {
    bg: '#E0F2F1',
    light: '#F0FAF9',
    border: '#B2DFDB',
    main: '#0D9488',
    dark: '#0F766E',
  },
  cyan: {
    bg: '#E0F7FA',
    light: '#F0FDFF',
    border: '#B2EBF2',
    main: '#0891B2',
    dark: '#0E7490',
  },
  green: {
    bg: '#E6F4EA',
    light: '#F0FAF3',
    border: '#B7DFC0',
    main: '#16A34A',
    dark: '#15803D',
  },
  rose: {
    bg: '#FCE8E6',
    light: '#FFF5F5',
    border: '#F5C6C2',
    main: '#DC2626',
    dark: '#B91C1C',
  },
  purple: {
    bg: '#F3E8FD',
    light: '#FAF5FF',
    border: '#E9D5FF',
    main: '#9333EA',
    dark: '#7E22CE',
  },
} as const;

export type AccentColor = keyof typeof ACCENT_COLORS;

export const STATUS_CHIP_STYLES = {
  open: { bg: '#E8F0FE', color: '#1A73E8', border: '#C2D9F7', dot: '#1A73E8' },
  inProgress: { bg: '#FEF7E0', color: '#B45309', border: '#F9E6A8', dot: '#F59E0B' },
  closed: { bg: '#E6F4EA', color: '#15803D', border: '#B7DFC0', dot: '#16A34A' },
  archived: { bg: '#F1F3F4', color: '#5F6368', border: '#DADCE0', dot: '#80868B' },
  pending: { bg: '#FEF7E0', color: '#B45309', border: '#F9E6A8', dot: '#F59E0B' },
  partial: { bg: '#E8EAFD', color: '#4F46E5', border: '#C5CAFC', dot: '#4F46E5' },
  paid: { bg: '#E6F4EA', color: '#15803D', border: '#B7DFC0', dot: '#16A34A' },
  overdue: { bg: '#FCE8E6', color: '#B91C1C', border: '#F5C6C2', dot: '#DC2626' },
  cancelled: { bg: '#F1F3F4', color: '#5F6368', border: '#DADCE0', dot: '#80868B' },
  active: { bg: '#E6F4EA', color: '#15803D', border: '#B7DFC0', dot: '#16A34A' },
  inactive: { bg: '#FCE8E6', color: '#B91C1C', border: '#F5C6C2', dot: '#DC2626' },
} as const;
