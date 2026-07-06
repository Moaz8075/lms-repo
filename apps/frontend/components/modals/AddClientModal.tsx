'use client';

import { useEffect } from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import { FormDialog } from '@/components/ui/FormDialog';
import { useCreateClient } from '@/hooks/useClients';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(7, 'Phone is required'),
  cnic: z.string().optional(),
  fatherName: z.string().optional(),
  whatsapp: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface AddClientModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddClientModal({ open, onClose }: AddClientModalProps) {
  const createClient = useCreateClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const onSubmit = handleSubmit(async (values) => {
    await createClient.mutateAsync(values);
    onClose();
  });

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title="Add New Client"
      submitLabel="Save Client"
      onSubmit={onSubmit}
      loading={createClient.isPending}
      accent="blue"
      icon={<PersonAddOutlinedIcon />}
    >
      <Stack spacing={2} sx={{ pt: 1 }}>
        {createClient.isError && (
          <Alert severity="error">Failed to create client. Please try again.</Alert>
        )}
        <TextField
          label="Full Name"
          required
          fullWidth
          {...register('name')}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
        <TextField
          label="Phone"
          required
          fullWidth
          {...register('phone')}
          error={!!errors.phone}
          helperText={errors.phone?.message}
        />
        <TextField label="CNIC" fullWidth {...register('cnic')} />
        <TextField label="Father Name" fullWidth {...register('fatherName')} />
        <TextField label="WhatsApp" fullWidth {...register('whatsapp')} />
        <TextField label="Address" fullWidth multiline rows={2} {...register('address')} />
        <TextField label="Notes" fullWidth multiline rows={2} {...register('notes')} />
      </Stack>
    </FormDialog>
  );
}
