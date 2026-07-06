import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { legalNotesService } from '@/services/legal-notes.service';
import type {
  CreateLegalNotePayload,
  ListLegalNotesParams,
  UpdateLegalNotePayload,
} from '@/types';

export function useLegalNotes(params?: ListLegalNotesParams) {
  return useQuery({
    queryKey: ['legal-notes', params],
    queryFn: () => legalNotesService.list(params),
  });
}

export function useLegalNote(id: string | undefined) {
  return useQuery({
    queryKey: ['legal-notes', id],
    queryFn: () => legalNotesService.getById(id!),
    enabled: !!id,
  });
}

export function useCreateLegalNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateLegalNotePayload) => legalNotesService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['legal-notes'] });
    },
  });
}

export function useUpdateLegalNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateLegalNotePayload }) =>
      legalNotesService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['legal-notes'] });
      queryClient.invalidateQueries({ queryKey: ['case-references'] });
    },
  });
}

export function useDeleteLegalNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => legalNotesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['legal-notes'] });
      queryClient.invalidateQueries({ queryKey: ['case-references'] });
    },
  });
}
