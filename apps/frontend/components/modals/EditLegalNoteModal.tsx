'use client';

import { useEffect } from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import { FormDialog } from '@/components/ui/FormDialog';
import { useUpdateLegalNote } from '@/hooks/useLegalNotes';
import { parseTagsInput } from '@/components/legal-research/TagChips';
import type { LegalNote } from '@/types';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  personalNote: z.string().optional(),
  tagsInput: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface EditLegalNoteModalProps {
  open: boolean;
  onClose: () => void;
  note: LegalNote | null;
}

export function EditLegalNoteModal({ open, onClose, note }: EditLegalNoteModalProps) {
  const updateNote = useUpdateLegalNote();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (open && note) {
      reset({
        title: note.title,
        personalNote: note.personalNote ?? '',
        tagsInput: note.tags.join(', '),
      });
    }
  }, [open, note, reset]);

  const onSubmit = handleSubmit(async (values) => {
    if (!note) return;
    await updateNote.mutateAsync({
      id: note.id,
      payload: {
        title: values.title,
        personalNote: values.personalNote,
        tags: values.tagsInput ? parseTagsInput(values.tagsInput) : [],
      },
    });
    onClose();
  });

  if (!note) return null;

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title="Edit Legal Note"
      submitLabel="Save Changes"
      onSubmit={onSubmit}
      loading={updateNote.isPending}
      accent="violet"
      icon={<EditNoteOutlinedIcon />}
      maxWidth="md"
    >
      <Stack spacing={2} sx={{ pt: 1 }}>
        {updateNote.isError && (
          <Alert severity="error">Failed to update note. Please try again.</Alert>
        )}
        <TextField
          label="Note Title"
          required
          fullWidth
          {...register('title')}
          error={!!errors.title}
          helperText={errors.title?.message}
        />
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: '#F7F3FC',
            border: '1px solid #D1C4E9',
            borderLeft: '4px solid #7C3AED',
          }}
        >
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            Highlighted text (read-only)
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5, fontStyle: 'italic', lineHeight: 1.6 }}>
            {note.selectedText}
          </Typography>
        </Box>
        <TextField
          label="Personal Note"
          fullWidth
          multiline
          minRows={3}
          {...register('personalNote')}
        />
        <TextField label="Tags" fullWidth {...register('tagsInput')} />
      </Stack>
    </FormDialog>
  );
}
