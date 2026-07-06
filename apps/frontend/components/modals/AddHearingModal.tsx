'use client';

import { useEffect } from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import { FormDialog } from '@/components/ui/FormDialog';
import { useCreateHearing } from '@/hooks/useHearings';
import { HearingOutcome } from '@/types';

const schema = z.object({
  hearingDate: z.string().min(1, 'Date is required'),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Use HH:mm format'),
  courtRoom: z.string().optional(),
  purpose: z.string().optional(),
  notes: z.string().optional(),
  outcome: z.nativeEnum(HearingOutcome).optional(),
});

type FormValues = z.infer<typeof schema>;

interface AddHearingModalProps {
  open: boolean;
  onClose: () => void;
  caseId: string;
}

export function AddHearingModal({ open, onClose, caseId }: AddHearingModalProps) {
  const createHearing = useCreateHearing();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { outcome: HearingOutcome.PENDING },
  });

  useEffect(() => {
    if (!open) reset({ outcome: HearingOutcome.PENDING });
  }, [open, reset]);

  const onSubmit = handleSubmit(async (values) => {
    await createHearing.mutateAsync({ caseId, ...values });
    onClose();
  });

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title="Schedule Hearing"
      submitLabel="Add Hearing"
      onSubmit={onSubmit}
      loading={createHearing.isPending}
      accent="amber"
      icon={<EventOutlinedIcon />}
    >
      <Stack spacing={2} sx={{ pt: 1 }}>
        {createHearing.isError && (
          <Alert severity="error">Failed to schedule hearing. Please try again.</Alert>
        )}
        <TextField
          label="Hearing Date"
          type="date"
          required
          fullWidth
          InputLabelProps={{ shrink: true }}
          {...register('hearingDate')}
          error={!!errors.hearingDate}
          helperText={errors.hearingDate?.message}
        />
        <TextField
          label="Time"
          placeholder="10:30"
          required
          fullWidth
          {...register('time')}
          error={!!errors.time}
          helperText={errors.time?.message ?? 'Format: HH:mm'}
        />
        <TextField label="Court Room" fullWidth {...register('courtRoom')} />
        <TextField label="Purpose" fullWidth {...register('purpose')} />
        <TextField label="Notes" fullWidth multiline rows={2} {...register('notes')} />
        <TextField select label="Outcome" fullWidth {...register('outcome')}>
          {Object.values(HearingOutcome).map((o) => (
            <MenuItem key={o} value={o}>
              {o.replace(/_/g, ' ')}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
    </FormDialog>
  );
}
