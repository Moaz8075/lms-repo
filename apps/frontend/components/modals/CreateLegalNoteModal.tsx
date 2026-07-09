'use client';

import { useEffect, useState } from 'react';
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
import { CaseAttachSelect } from '@/components/legal-research/CaseAttachSelect';
import { useCreateLegalNote } from '@/hooks/useLegalNotes';
import { useAttachNoteToCase } from '@/hooks/useCaseReferences';
import { useLegalLibrary } from '@/hooks/useLegalLibrary';
import { usePermissions } from '@/hooks/usePermissions';
import { PermissionResource } from '@/types/permissions';
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
  caseId: z.string().optional(),
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
  const { canView } = usePermissions();
  const createNote = useCreateLegalNote();
  const attachNoteToCase = useAttachNoteToCase();
  const [attachError, setAttachError] = useState<string | null>(null);
  const { data: libraryData } = useLegalLibrary({ page: 1, limit: 100 });
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const selectedCaseId = watch('caseId') ?? '';

  useEffect(() => {
    if (open) {
      setAttachError(null);
      reset({
        libraryItemId: libraryItemId ?? '',
        citation: defaultCitation ?? '',
        court: defaultCourt ?? '',
        pageNumber: defaultPageNumber ?? 1,
        selectedText: defaultSelectedText ?? '',
        personalNote: '',
        title: defaultTitle ?? '',
        tagsInput: '',
        caseId: '',
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
    setAttachError(null);
    const note = await createNote.mutateAsync({
      title: values.title,
      pageNumber: Number(values.pageNumber),
      selectedText: values.selectedText,
      personalNote: values.personalNote,
      libraryItemId: values.libraryItemId || undefined,
      citation: values.citation,
      court: values.court,
      tags: values.tagsInput ? parseTagsInput(values.tagsInput) : [],
    });

    if (values.caseId) {
      try {
        await attachNoteToCase.mutateAsync({
          caseId: values.caseId,
          legalNoteId: note.id,
        });
      } catch {
        setAttachError(
          'Note saved, but it could not be linked to the case. Attach it manually from the case References tab.',
        );
        return;
      }
    }

    onClose();
  });

  const isSaving = createNote.isPending || attachNoteToCase.isPending;

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title="Create Legal Note"
      submitLabel="Save Note"
      onSubmit={onSubmit}
      loading={isSaving}
      accent="violet"
      icon={<StickyNote2OutlinedIcon />}
      maxWidth="md"
    >
      <Stack spacing={2} sx={{ pt: 1 }}>
        {createNote.isError && (
          <Alert severity="error">Failed to save note. Please try again.</Alert>
        )}
        {attachError && <Alert severity="warning">{attachError}</Alert>}
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
        {canView(PermissionResource.CASES) && (
          <CaseAttachSelect
            value={selectedCaseId}
            onChange={(caseId) => setValue('caseId', caseId)}
          />
        )}
      </Stack>
    </FormDialog>
  );
}
