'use client';

import { useEffect } from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import { NumberField } from '@/components/ui/NumberField';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined';
import { FormDialog } from '@/components/ui/FormDialog';
import { useCreateLegalNote } from '@/hooks/useLegalNotes';
import { useLegalLibrary } from '@/hooks/useLegalLibrary';
import { parseTagsInput } from '@/components/legal-research/TagChips';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  pageNumber: z.coerce.number().min(1, 'Page number is required'),
  selectedText: z.string().min(1, 'Highlighted text is required'),
  personalNote: z.string().optional(),
  libraryItemId: z.string().optional(),
  citation: z.string().optional(),
  court: z.string().optional(),
  tagsInput: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface CreateLegalNoteModalProps {
  open: boolean;
  onClose: () => void;
  libraryItemId?: string;
  defaultCitation?: string;
  defaultCourt?: string;
  defaultPageNumber?: number;
  defaultSelectedText?: string;
  defaultTitle?: string;
}

export function CreateLegalNoteModal({
  open,
  onClose,
  libraryItemId,
  defaultCitation,
  defaultCourt,
  defaultPageNumber,
  defaultSelectedText,
  defaultTitle,
}: CreateLegalNoteModalProps) {
  const createNote = useCreateLegalNote();
  const { data: libraryData } = useLegalLibrary({ page: 1, limit: 100 });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (open) {
      reset({
        libraryItemId: libraryItemId ?? '',
        citation: defaultCitation ?? '',
        court: defaultCourt ?? '',
        pageNumber: defaultPageNumber ?? 1,
        selectedText: defaultSelectedText ?? '',
        personalNote: '',
        title: defaultTitle ?? '',
        tagsInput: '',
      });
    }
  }, [
    open,
    reset,
    libraryItemId,
    defaultCitation,
    defaultCourt,
    defaultPageNumber,
    defaultSelectedText,
    defaultTitle,
  ]);

  const onSubmit = handleSubmit(async (values) => {
    await createNote.mutateAsync({
      title: values.title,
      pageNumber: Number(values.pageNumber),
      selectedText: values.selectedText,
      personalNote: values.personalNote,
      libraryItemId: values.libraryItemId || undefined,
      citation: values.citation,
      court: values.court,
      tags: values.tagsInput ? parseTagsInput(values.tagsInput) : [],
    });
    onClose();
  });

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title="Create Legal Note"
      submitLabel="Save Note"
      onSubmit={onSubmit}
      loading={createNote.isPending}
      accent="violet"
      icon={<StickyNote2OutlinedIcon />}
      maxWidth="md"
    >
      <Stack spacing={2} sx={{ pt: 1 }}>
        {createNote.isError && (
          <Alert severity="error">Failed to save note. Please try again.</Alert>
        )}
        <TextField
          label="Note Title"
          required
          fullWidth
          placeholder="Right to fair trial — key paragraph"
          {...register('title')}
          error={!!errors.title}
          helperText={errors.title?.message}
        />
        <TextField select label="Source Document" fullWidth {...register('libraryItemId')}>
          <MenuItem value="">None (physical book / standalone)</MenuItem>
          {(libraryData?.items ?? []).map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.title}
            </MenuItem>
          ))}
        </TextField>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <NumberField
            label="Page Number"
            required
            fullWidth
            {...register('pageNumber')}
            error={!!errors.pageNumber}
            helperText={errors.pageNumber?.message}
          />
          <TextField label="Citation" fullWidth {...register('citation')} />
        </Stack>
        <TextField label="Court" fullWidth {...register('court')} />
        <TextField
          label="Highlighted Text"
          required
          fullWidth
          multiline
          minRows={4}
          placeholder="Paste the paragraph you highlighted from the document…"
          {...register('selectedText')}
          error={!!errors.selectedText}
          helperText={errors.selectedText?.message ?? 'This text cannot be edited after saving'}
        />
        <TextField
          label="Personal Note"
          fullWidth
          multiline
          minRows={2}
          placeholder="Your commentary or how to use this in arguments…"
          {...register('personalNote')}
        />
        <TextField
          label="Tags"
          fullWidth
          placeholder="bail, constitutional (comma-separated)"
          {...register('tagsInput')}
        />
      </Stack>
    </FormDialog>
  );
}
