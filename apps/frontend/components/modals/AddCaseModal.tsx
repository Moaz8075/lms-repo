'use client';

import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormDialog } from '@/components/ui/FormDialog';
import { useCreateCase } from '@/hooks/useCases';
import { useClients, useCreateClient } from '@/hooks/useClients';
import { CaseType } from '@/types';
import { getApiErrorMessage } from '@/utils/api-error';

const clientModeSchema = z.enum(['existing', 'new']);

const schema = z
  .object({
    clientMode: clientModeSchema,
    clientId: z.string().optional(),
    clientName: z.string().optional(),
    clientPhone: z.string().optional(),
    clientCnic: z.string().optional(),
    clientFatherName: z.string().optional(),
    clientWhatsapp: z.string().optional(),
    clientAddress: z.string().optional(),
    caseType: z.nativeEnum(CaseType).optional(),
    courtName: z.string().optional(),
    opponentParty: z.string().min(2, 'Opposing party name is required'),
    opponentLawyer: z.string().optional(),
    filingDate: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.clientMode === 'existing') {
      if (!data.clientId || !z.string().uuid().safeParse(data.clientId).success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Select a client',
          path: ['clientId'],
        });
      }
    } else {
      if (!data.clientName || data.clientName.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Client name is required',
          path: ['clientName'],
        });
      }
      if (!data.clientPhone || data.clientPhone.trim().length < 7) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Client phone is required',
          path: ['clientPhone'],
        });
      }
    }
  });

type FormValues = z.infer<typeof schema>;

function buildCaseTitle(clientName: string, opponent: string): string {
  return `${clientName.trim()} vs ${opponent.trim()}`;
}

const defaultValues: FormValues = {
  clientMode: 'existing',
  clientId: '',
  clientName: '',
  clientPhone: '',
  clientCnic: '',
  clientFatherName: '',
  clientWhatsapp: '',
  clientAddress: '',
  caseType: CaseType.CIVIL,
  courtName: '',
  opponentParty: '',
  opponentLawyer: '',
  filingDate: '',
};

interface AddCaseModalProps {
  open: boolean;
  onClose: () => void;
  defaultClientId?: string;
}

export function AddCaseModal({ open, onClose, defaultClientId }: AddCaseModalProps) {
  const createCase = useCreateCase();
  const createClient = useCreateClient();
  const { data: clientsData } = useClients({ limit: 100 });
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...defaultValues,
      clientMode: defaultClientId ? 'existing' : 'existing',
      clientId: defaultClientId ?? '',
    },
  });

  const clientMode = useWatch({ control, name: 'clientMode' });
  const clientId = useWatch({ control, name: 'clientId' });
  const clientName = useWatch({ control, name: 'clientName' });
  const opponentParty = useWatch({ control, name: 'opponentParty' });

  useEffect(() => {
    if (open) {
      setSubmitError(null);
      reset({
        ...defaultValues,
        clientMode: 'existing',
        clientId: defaultClientId ?? '',
      });
    }
  }, [open, reset, defaultClientId]);

  const resolvedClientName = useMemo(() => {
    if (clientMode === 'new') return clientName?.trim() ?? '';
    const client = clientsData?.items.find((c) => c.id === clientId);
    return client?.name ?? '';
  }, [clientMode, clientId, clientName, clientsData?.items]);

  const previewTitle = useMemo(() => {
    if (!resolvedClientName || !opponentParty?.trim()) return null;
    return buildCaseTitle(resolvedClientName, opponentParty);
  }, [resolvedClientName, opponentParty]);

  const isSubmitting = createCase.isPending || createClient.isPending;

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      let clientIdToUse = values.clientId!;

      if (values.clientMode === 'new') {
        const newClient = await createClient.mutateAsync({
          name: values.clientName!.trim(),
          phone: values.clientPhone!.trim(),
          cnic: values.clientCnic?.trim() || undefined,
          fatherName: values.clientFatherName?.trim() || undefined,
          whatsapp: values.clientWhatsapp?.trim() || undefined,
          address: values.clientAddress?.trim() || undefined,
        });
        clientIdToUse = newClient.id;
      }

      await createCase.mutateAsync({
        clientId: clientIdToUse,
        caseType: values.caseType,
        courtName: values.courtName?.trim() || undefined,
        opponentParty: values.opponentParty.trim(),
        opponentLawyer: values.opponentLawyer?.trim() || undefined,
        filingDate: values.filingDate?.trim() || undefined,
      });

      onClose();
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, 'Failed to create case. Please try again.'));
    }
  });

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title="New Case"
      submitLabel="Create Case"
      onSubmit={onSubmit}
      loading={isSubmitting}
      maxWidth="md"
      accent="indigo"
      icon={<GavelOutlinedIcon />}
    >
      <Stack spacing={2.5} sx={{ pt: 1 }}>
        {submitError && <Alert severity="error">{submitError}</Alert>}

        {!defaultClientId && (
          <Box>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5, color: '#3730A3' }}>
              Who is this case for?
            </Typography>
            <Controller
              name="clientMode"
              control={control}
              render={({ field }) => (
                <ToggleButtonGroup
                  exclusive
                  fullWidth
                  value={field.value}
                  onChange={(_, value) => {
                    if (value) field.onChange(value);
                  }}
                  sx={{
                    '& .MuiToggleButton-root': {
                      py: 1.5,
                      textTransform: 'none',
                      fontWeight: 600,
                      borderColor: '#C5CAFC',
                      '&.Mui-selected': {
                        bgcolor: '#EEF2FF',
                        color: '#3730A3',
                        borderColor: '#818CF8',
                      },
                    },
                  }}
                >
                  <ToggleButton value="existing">
                    <PersonOutlineIcon sx={{ mr: 1, fontSize: 20 }} />
                    Existing Client
                  </ToggleButton>
                  <ToggleButton value="new">
                    <PersonAddOutlinedIcon sx={{ mr: 1, fontSize: 20 }} />
                    New Client
                  </ToggleButton>
                </ToggleButtonGroup>
              )}
            />
          </Box>
        )}

        {clientMode === 'existing' ? (
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: '#F8FAFF',
              border: '1px solid #C5CAFC',
            }}
          >
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5, color: '#3730A3' }}>
              Select Client
            </Typography>
            <Controller
              name="clientId"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  label="Client"
                  required
                  fullWidth
                  {...field}
                  disabled={!!defaultClientId}
                  error={!!errors.clientId}
                  helperText={errors.clientId?.message}
                >
                  {(clientsData?.items ?? []).map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.name}
                      {c.phone ? ` · ${c.phone}` : ''}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Box>
        ) : (
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: '#F0F9FF',
              border: '1px solid #BAE6FD',
            }}
          >
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5, color: '#0369A1' }}>
              New Client Information
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Full Name"
                required
                fullWidth
                {...register('clientName')}
                error={!!errors.clientName}
                helperText={errors.clientName?.message}
              />
              <TextField
                label="Phone"
                required
                fullWidth
                {...register('clientPhone')}
                error={!!errors.clientPhone}
                helperText={errors.clientPhone?.message}
              />
              <TextField label="CNIC" fullWidth placeholder="42101-1234567-1" helperText="Optional — leave blank if unknown" {...register('clientCnic')} />
              <TextField label="Father Name" fullWidth {...register('clientFatherName')} />
              <TextField label="WhatsApp" fullWidth {...register('clientWhatsapp')} />
              <TextField label="Address" fullWidth multiline rows={2} {...register('clientAddress')} />
            </Stack>
          </Box>
        )}

        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: '#FAFAFA',
            border: '1px solid #E5E7EB',
          }}
        >
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
            Case Details
          </Typography>
          <Stack spacing={2}>
            <TextField
              select
              label="Case Type"
              fullWidth
              defaultValue={CaseType.CIVIL}
              {...register('caseType')}
            >
              {Object.values(CaseType).map((t) => (
                <MenuItem key={t} value={t}>
                  {t.replace(/_/g, ' ')}
                </MenuItem>
              ))}
            </TextField>
            <TextField label="Court Name" fullWidth {...register('courtName')} />
            <TextField
              label="Opposing Party"
              required
              fullWidth
              placeholder="e.g. Metro Corp Ltd."
              {...register('opponentParty')}
              error={!!errors.opponentParty}
              helperText={errors.opponentParty?.message ?? 'Used to build the case title'}
            />
            <TextField label="Opposing Lawyer" fullWidth {...register('opponentLawyer')} />
            <TextField
              label="Filing Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              {...register('filingDate')}
            />
          </Stack>
        </Box>

        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: '#F8FAFC',
            border: '1px dashed #CBD5E1',
          }}
        >
          <Typography variant="caption" fontWeight={700} color="text.secondary" display="block" mb={0.5}>
            CASE NUMBER (AUTO-GENERATED)
          </Typography>
          <Typography variant="body2" fontWeight={600} sx={{ color: '#475569', mb: 1.5 }}>
            Assigned on save — format: CASE-{new Date().getFullYear()}-###
          </Typography>
          <Typography variant="caption" fontWeight={700} color="text.secondary" display="block" mb={0.5}>
            CASE TITLE (AUTO-GENERATED)
          </Typography>
          <Typography variant="body1" fontWeight={700} sx={{ color: previewTitle ? '#3730A3' : 'text.secondary' }}>
            {previewTitle ?? 'Enter client and opposing party to preview title'}
          </Typography>
        </Box>
      </Stack>
    </FormDialog>
  );
}
