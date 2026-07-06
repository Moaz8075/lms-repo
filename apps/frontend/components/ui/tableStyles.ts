import { ACCENT_COLORS, type AccentColor } from '@/utils/design-tokens';

export const TABLE_ROW_ACCENTS = [
  ACCENT_COLORS.blue,
  ACCENT_COLORS.indigo,
  ACCENT_COLORS.teal,
  ACCENT_COLORS.violet,
  ACCENT_COLORS.amber,
  ACCENT_COLORS.cyan,
] as const;

export function getTableContainerSx(accent: AccentColor = 'blue') {
  const c = ACCENT_COLORS[accent];
  return {
    border: `1px solid ${c.border}`,
    borderRadius: 3,
    boxShadow: `0 4px 24px ${c.main}14`,
    overflow: 'hidden',
    bgcolor: '#fff',
    position: 'relative' as const,
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 3,
      background: `linear-gradient(90deg, ${c.main}, ${ACCENT_COLORS.indigo.main})`,
    },
  };
}

export function getTableHeadCellSx(accent: AccentColor = 'blue') {
  const c = ACCENT_COLORS[accent];
  return {
    bgcolor: c.bg,
    color: c.dark,
    fontWeight: 700,
    fontSize: 11,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.06em',
    borderBottom: `2px solid ${c.border}`,
    py: 1.75,
    whiteSpace: 'nowrap' as const,
  };
}

export function getTableRowSx(index: number) {
  const accent = TABLE_ROW_ACCENTS[index % TABLE_ROW_ACCENTS.length];
  return {
    bgcolor: index % 2 === 0 ? '#fff' : accent.light,
    transition: 'background-color 0.15s ease',
    '&:hover': { bgcolor: `${accent.bg}55` },
    '& td:first-of-type': {
      borderLeft: `4px solid ${accent.main}`,
    },
  };
}

export function getRowAccent(index: number) {
  return TABLE_ROW_ACCENTS[index % TABLE_ROW_ACCENTS.length];
}
