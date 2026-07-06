'use client';

import { useEffect } from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { NumberField } from '@/components/ui/NumberField';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import { FormDialog } from '@/components/ui/FormDialog';
import { useCreateExpense } from '@/hooks/useExpenses';
import { ExpenseCategory } from '@/types';
import { formatExpenseCategory, toDateInputValue } from '@/utils/format';

const schema = z.object({
  description: z.string().optional(),
  amount: z.coerce.number().min(0.01, 'Amount must be greater than 0'),
  category: z.nativeEnum(ExpenseCategory),
  expenseDate: z.string().min(1, 'Date is required'),
});

type FormValues = z.infer<typeof schema>;

interface AddExpenseModalProps {
  open: boolean;
  onClose: () => void;
  caseId: string;
}

export function AddExpenseModal({ open, onClose, caseId }: AddExpenseModalProps) {
  const createExpense = useCreateExpense();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      category: ExpenseCategory.OTHER,
      expenseDate: toDateInputValue(),
    },
  });

  useEffect(() => {
    if (!open) {
      reset({
        category: ExpenseCategory.OTHER,
        expenseDate: toDateInputValue(),
      });
    }
  }, [open, reset]);

  const onSubmit = handleSubmit(async (values) => {
    await createExpense.mutateAsync({ caseId, ...values });
    onClose();
  });

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title="Add Expense"
      submitLabel="Save Expense"
      onSubmit={onSubmit}
      loading={createExpense.isPending}
      accent="rose"
      icon={<ReceiptLongOutlinedIcon />}
    >
      <Stack spacing={2} sx={{ pt: 1 }}>
        {createExpense.isError && (
          <Alert severity="error">Failed to save expense. Please try again.</Alert>
        )}
        <TextField
          label="Description"
          fullWidth
          {...register('description')}
          error={!!errors.description}
          helperText={errors.description?.message}
        />
        <NumberField
          label="Amount (PKR)"
          required
          fullWidth
          {...register('amount')}
          error={!!errors.amount}
          helperText={errors.amount?.message}
        />
        <TextField select label="Category" required fullWidth {...register('category')}>
          {Object.values(ExpenseCategory).map((category) => (
            <MenuItem key={category} value={category}>
              {formatExpenseCategory(category)}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Expense Date"
          type="date"
          required
          fullWidth
          InputLabelProps={{ shrink: true }}
          {...register('expenseDate')}
          error={!!errors.expenseDate}
          helperText={errors.expenseDate?.message}
        />
      </Stack>
    </FormDialog>
  );
}
