'use client';

import { useEffect } from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import { NumberField } from '@/components/ui/NumberField';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import { FormDialog } from '@/components/ui/FormDialog';
import { useCreateLibraryItem } from '@/hooks/useLegalLibrary';
import { parseTagsInput } from '@/components/legal-research/TagChips';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  pdfUrl: z.string().url('Enter a valid PDF URL'),
  citation: z.string().optional(),
  court: z.string().optional(),
  jurisdiction: z.string().optional(),
  year: z.coerce.number().min(1800).max(2100).optional().or(z.literal('')),
  category: z.string().optional(),
  author: z.string().optional(),
  totalPages: z.coerce.number().min(0).optional().or(z.literal('')),
  description: z.string().optional(),
  tagsInput: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface AddLibraryItemModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddLibraryItemModal({ open, onClose }: AddLibraryItemModalProps) {
  const createItem = useCreateLibraryItem();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { category: 'Judgment' },
  });

  useEffect(() => {
    if (!open) reset({ category: 'Judgment' });
  }, [open, reset]);

  const onSubmit = handleSubmit(async (values) => {
    await createItem.mutateAsync({
      title: values.title,
      pdfUrl: values.pdfUrl,
      citation: values.citation,
      court: values.court,
      jurisdiction: values.jurisdiction,
      year: values.year === '' ? undefined : Number(values.year),
      category: values.category,
      author: values.author,
      totalPages: values.totalPages === '' ? undefined : Number(values.totalPages),
      description: values.description,
      tags: values.tagsInput ? parseTagsInput(values.tagsInput) : [],
    });
    onClose();
  });

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title="Add to Library"
      submitLabel="Save Document"
      onSubmit={onSubmit}
      loading={createItem.isPending}
      accent="indigo"
      icon={<MenuBookOutlinedIcon />}
      maxWidth="md"
    >
      <Stack spacing={2} sx={{ pt: 1 }}>
        {createItem.isError && (
          <Alert severity="error">Failed to add document. Please try again.</Alert>
        )}
        <TextField
          label="Title"
          required
          fullWidth
          placeholder="Muhammad Aslam v. State"
          {...register('title')}
          error={!!errors.title}
          helperText={errors.title?.message}
        />
        <TextField
          label="PDF URL"
          required
          fullWidth
          placeholder="https://..."
          {...register('pdfUrl')}
          error={!!errors.pdfUrl}
          helperText={errors.pdfUrl?.message}
        />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField label="Citation" fullWidth placeholder="PLD 2020 SC 123" {...register('citation')} />
          <TextField label="Court" fullWidth placeholder="Supreme Court" {...register('court')} />
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField label="Category" fullWidth placeholder="Judgment, Book, Statute" {...register('category')} />
          <TextField label="Jurisdiction" fullWidth placeholder="Pakistan" {...register('jurisdiction')} />
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <NumberField label="Year" fullWidth {...register('year')} />
          <NumberField label="Total Pages" fullWidth {...register('totalPages')} />
        </Stack>
        <TextField label="Author" fullWidth {...register('author')} />
        <TextField
          label="Description"
          fullWidth
          multiline
          minRows={2}
          {...register('description')}
        />
        <TextField
          label="Tags"
          fullWidth
          placeholder="constitutional, criminal (comma-separated)"
          {...register('tagsInput')}
        />
      </Stack>
    </FormDialog>
  );
}
