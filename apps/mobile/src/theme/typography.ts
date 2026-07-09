import { TextStyle } from 'react-native';

import { colors } from '@/constants/colors';

export const fontFamily = {
  regular: 'System',
  medium: 'System',
  semibold: 'System',
  bold: 'System',
} as const;

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
} as const;

export const lineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
} as const;

export const typography = {
  h1: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize['3xl'],
    lineHeight: fontSize['3xl'] * lineHeight.tight,
    color: colors.text.primary,
    fontWeight: '700',
  } satisfies TextStyle,
  h2: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize['2xl'],
    lineHeight: fontSize['2xl'] * lineHeight.tight,
    color: colors.text.primary,
    fontWeight: '700',
  } satisfies TextStyle,
  h3: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.xl,
    lineHeight: fontSize.xl * lineHeight.tight,
    color: colors.text.primary,
    fontWeight: '600',
  } satisfies TextStyle,
  body: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.md,
    lineHeight: fontSize.md * lineHeight.normal,
    color: colors.text.primary,
    fontWeight: '400',
  } satisfies TextStyle,
  bodySmall: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * lineHeight.normal,
    color: colors.text.secondary,
    fontWeight: '400',
  } satisfies TextStyle,
  label: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * lineHeight.normal,
    color: colors.text.primary,
    fontWeight: '500',
  } satisfies TextStyle,
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
    lineHeight: fontSize.xs * lineHeight.normal,
    color: colors.text.secondary,
    fontWeight: '400',
  } satisfies TextStyle,
  button: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.md,
    lineHeight: fontSize.md * lineHeight.tight,
    color: colors.text.inverse,
    fontWeight: '600',
  } satisfies TextStyle,
} as const;

export type Typography = typeof typography;
