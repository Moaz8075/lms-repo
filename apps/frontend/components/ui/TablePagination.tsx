'use client';

import TablePagination from '@mui/material/TablePagination';

interface TablePaginationBarProps {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  rowsPerPageOptions?: number[];
}

export function TablePaginationBar({
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
  rowsPerPageOptions = [10, 20, 50],
}: TablePaginationBarProps) {
  if (total === 0) return null;

  return (
    <TablePagination
      component="div"
      count={total}
      page={page - 1}
      onPageChange={(_, newPage) => onPageChange(newPage + 1)}
      rowsPerPage={limit}
      onRowsPerPageChange={(e) => {
        const next = parseInt(e.target.value, 10);
        onLimitChange?.(next);
        onPageChange(1);
      }}
      rowsPerPageOptions={onLimitChange ? rowsPerPageOptions : []}
      sx={{
        borderTop: '1px solid',
        borderColor: 'divider',
        '& .MuiTablePagination-toolbar': { minHeight: 52 },
      }}
    />
  );
}
