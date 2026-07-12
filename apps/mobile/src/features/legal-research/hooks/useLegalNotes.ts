import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { legalNotesApi } from '@/api/legal-notes.api';
import {
  LEGAL_RESEARCH_PAGE_SIZE,
  legalResearchKeys,
} from '@/features/legal-research/constants';
import type {
  CreateLegalNotePayload,
  ListLegalNotesParams,
  UpdateLegalNotePayload,
} from '@/types';

export function useLegalNotes(params?: ListLegalNotesParams) {
  const queryParams = {
    page: 1,
    limit: LEGAL_RESEARCH_PAGE_SIZE,
    ...params,
  };

  return useQuery({
    queryKey: legalResearchKeys.notes.list(queryParams),
    queryFn: () => legalNotesApi.list(queryParams),
  });
}

export function useLegalNote(id: string) {
  return useQuery({
    queryKey: legalResearchKeys.notes.detail(id),
    queryFn: () => legalNotesApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateLegalNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateLegalNotePayload) =>
      legalNotesApi.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: legalResearchKeys.notes.all,
      });
    },
  });
}

export function useUpdateLegalNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateLegalNotePayload;
    }) => legalNotesApi.update(id, payload),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: legalResearchKeys.notes.all,
      });
      void queryClient.invalidateQueries({
        queryKey: legalResearchKeys.notes.detail(variables.id),
      });
    },
  });
}

export function useDeleteLegalNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => legalNotesApi.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: legalResearchKeys.notes.all,
      });
    },
  });
}
