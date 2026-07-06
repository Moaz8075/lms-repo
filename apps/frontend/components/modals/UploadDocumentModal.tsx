'use client';

import { useEffect } from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import { FormDialog } from '@/components/ui/FormDialog';
import { useUploadDocument } from '@/hooks/useDocuments';
import { DocumentFileType } from '@/types';

const schema = z.object({
  fileName: z.string().min(1, 'File name is required'),
  fileUrl: z.string().url('Enter a valid URL'),
  fileType: z.nativeEnum(DocumentFileType),
  category: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface UploadDocumentModalProps {
  open: boolean;
  onClose: () => void;
  caseId: string;
}

export function UploadDocumentModal({ open, onClose, caseId }: UploadDocumentModalProps) {
  const uploadDocument = useUploadDocument();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { fileType: DocumentFileType.PDF },
  });

  useEffect(() => {
    if (!open) reset({ fileType: DocumentFileType.PDF });
  }, [open, reset]);

  const onSubmit = handleSubmit(async (values) => {
    await uploadDocument.mutateAsync({ caseId, ...values });
    onClose();
  });

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title="Upload Document"
      submitLabel="Upload"
      onSubmit={onSubmit}
      loading={uploadDocument.isPending}
      accent="cyan"
      icon={<UploadFileOutlinedIcon />}
    >
      <Stack spacing={2} sx={{ pt: 1 }}>
        {uploadDocument.isError && (
          <Alert severity="error">Failed to upload document. Please try again.</Alert>
        )}
        <TextField
          label="File Name"
          required
          fullWidth
          {...register('fileName')}
          error={!!errors.fileName}
          helperText={errors.fileName?.message}
        />
        <TextField
          label="File URL"
          required
          fullWidth
          placeholder="https://..."
          {...register('fileUrl')}
          error={!!errors.fileUrl}
          helperText={errors.fileUrl?.message}
        />
        <TextField select label="File Type" required fullWidth {...register('fileType')}>
          {Object.values(DocumentFileType).map((t) => (
            <MenuItem key={t} value={t}>
              {t}
            </MenuItem>
          ))}
        </TextField>
        <TextField label="Category" fullWidth placeholder="Petition, Order, etc." {...register('category')} />
      </Stack>
    </FormDialog>
  );
}
