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
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import { FormDialog } from '@/components/ui/FormDialog';
import { useCreatePayment } from '@/hooks/usePayments';
import { PaymentMethod, PaymentStatus } from '@/types';

const schema = z.object({
  amount: z.coerce.number().min(0.01, 'Amount must be greater than 0'),
  paymentMethod: z.nativeEnum(PaymentMethod),
  status: z.nativeEnum(PaymentStatus),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface AddPaymentModalProps {
  open: boolean;
  onClose: () => void;
  caseId: string;
}

export function AddPaymentModal({ open, onClose, caseId }: AddPaymentModalProps) {
  const createPayment = useCreatePayment();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { paymentMethod: PaymentMethod.CASH, status: PaymentStatus.PAID },
  });

  useEffect(() => {
    if (!open) reset({ paymentMethod: PaymentMethod.CASH, status: PaymentStatus.PAID });
  }, [open, reset]);

  const onSubmit = handleSubmit(async (values) => {
    await createPayment.mutateAsync({ caseId, ...values });
    onClose();
  });

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title="Record Payment"
      submitLabel="Save Payment"
      onSubmit={onSubmit}
      loading={createPayment.isPending}
      accent="green"
      icon={<PaymentsOutlinedIcon />}
    >
      <Stack spacing={2} sx={{ pt: 1 }}>
        {createPayment.isError && (
          <Alert severity="error">Failed to record payment. Please try again.</Alert>
        )}
        <NumberField
          label="Amount (PKR)"
          required
          fullWidth
          {...register('amount')}
          error={!!errors.amount}
          helperText={errors.amount?.message}
        />
        <TextField select label="Payment Method" required fullWidth {...register('paymentMethod')}>
          {Object.values(PaymentMethod).map((m) => (
            <MenuItem key={m} value={m}>
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </MenuItem>
          ))}
        </TextField>
        <TextField select label="Status" required fullWidth {...register('status')}>
          {Object.values(PaymentStatus).map((s) => (
            <MenuItem key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </MenuItem>
          ))}
        </TextField>
        <TextField label="Notes" fullWidth multiline rows={2} {...register('notes')} />
      </Stack>
    </FormDialog>
  );
}
