export const colors = {
  primary: {
    main: '#1A73E8',
    light: '#E8F0FE',
    dark: '#1557B0',
    contrast: '#FFFFFF',
  },
  secondary: {
    main: '#4F46E5',
    light: '#E8EAFD',
    dark: '#3730A3',
    contrast: '#FFFFFF',
  },
  success: {
    main: '#16A34A',
    light: '#E6F4EA',
    dark: '#15803D',
  },
  warning: {
    main: '#F59E0B',
    light: '#FEF7E0',
    dark: '#B45309',
  },
  error: {
    main: '#DC2626',
    light: '#FCE8E6',
    dark: '#B91C1C',
  },
  neutral: {
    white: '#FFFFFF',
    black: '#000000',
    50: '#FAFCFF',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  background: {
    default: '#FAFCFF',
    paper: '#FFFFFF',
    elevated: '#FFFFFF',
  },
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    disabled: '#9CA3AF',
    inverse: '#FFFFFF',
  },
  border: {
    default: '#E5E7EB',
    focus: '#1A73E8',
  },
} as const;

export type Colors = typeof colors;
