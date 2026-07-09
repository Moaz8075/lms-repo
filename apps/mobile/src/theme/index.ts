import { colors, type Colors } from '@/constants/colors';

import { borderRadius, type BorderRadius } from './borderRadius';
import { shadows, type Shadows } from './shadows';
import { spacing, type Spacing } from './spacing';
import { typography, type Typography } from './typography';

export interface Theme {
  colors: Colors;
  typography: Typography;
  spacing: Spacing;
  borderRadius: BorderRadius;
  shadows: Shadows;
}

export const theme: Theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
};

export { colors, typography, spacing, borderRadius, shadows };
export type { Colors, Typography, Spacing, BorderRadius, Shadows };
