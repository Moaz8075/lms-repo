import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import type { ReactNode } from 'react';
import type { AccentColor } from '@/utils/design-tokens';
import { ACCENT_COLORS } from '@/utils/design-tokens';
import {
  getRowAccent,
  getTableContainerSx,
  getTableHeadCellSx,
  getTableRowSx,
} from './tableStyles';

export interface Column<T> {
  id: string;
  label: string;
  render: (row: T, index: number) => ReactNode;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  loading?: boolean;
  emptyMessage?: string;
  getRowId: (row: T) => string;
  accentColor?: AccentColor;
  showRowNumbers?: boolean;
  rowNumberOffset?: number;
  title?: string;
  totalCount?: number;
}

export function DataTable<T>({
  columns,
  rows,
  loading = false,
  emptyMessage = 'No records found',
  getRowId,
  accentColor = 'blue',
  showRowNumbers = false,
  rowNumberOffset = 0,
  title,
  totalCount,
}: DataTableProps<T>) {
  const c = ACCENT_COLORS[accentColor];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={36} sx={{ color: c.main }} />
      </Box>
    );
  }

  if (rows.length === 0) {
    return (
      <Paper
        sx={{
          p: 5,
          textAlign: 'center',
          bgcolor: c.light,
          border: `1px dashed ${c.border}`,
          borderRadius: 3,
        }}
      >
        <Typography color="text.secondary" fontWeight={500}>
          {emptyMessage}
        </Typography>
      </Paper>
    );
  }

  const allColumns: Column<T>[] = showRowNumbers
    ? [
        {
          id: '__rowNum',
          label: '#',
          width: 52,
          align: 'center',
          render: (_row, index) => (
            <Typography variant="body2" fontWeight={700} sx={{ color: c.dark }}>
              {rowNumberOffset + index + 1}
            </Typography>
          ),
        },
        ...columns,
      ]
    : columns;

  return (
    <Box>
      {title && (
        <Box
          sx={{
            mb: 2,
            px: 2.5,
            py: 1.5,
            borderRadius: 2.5,
            bgcolor: c.bg,
            border: `1px solid ${c.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <Chip
            label={totalCount ?? rows.length}
            size="small"
            sx={{ bgcolor: c.main, color: '#fff', fontWeight: 800, minWidth: 32 }}
          />
          <Typography variant="subtitle2" fontWeight={700} sx={{ color: c.dark }}>
            {title}
            {totalCount !== undefined && rows.length < totalCount && (
              <Typography component="span" variant="caption" sx={{ ml: 1, color: 'text.secondary', fontWeight: 500 }}>
                (showing {rows.length} on this page)
              </Typography>
            )}
          </Typography>
        </Box>
      )}

      <TableContainer component={Paper} elevation={0} sx={getTableContainerSx(accentColor)}>
        <Table sx={{ minWidth: 640 }}>
          <TableHead>
            <TableRow>
              {allColumns.map((col) => (
                <TableCell
                  key={col.id}
                  width={col.width}
                  align={col.align ?? 'left'}
                  sx={getTableHeadCellSx(accentColor)}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => {
              const accent = getRowAccent(index);
              return (
                <TableRow key={getRowId(row)} hover sx={getTableRowSx(index)}>
                  {allColumns.map((col) => (
                    <TableCell
                      key={col.id}
                      align={col.align ?? 'left'}
                      sx={{
                        py: 2,
                        borderBottom: `1px solid ${accent.border}44`,
                        verticalAlign: 'middle',
                      }}
                    >
                      {col.render(row, index)}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
