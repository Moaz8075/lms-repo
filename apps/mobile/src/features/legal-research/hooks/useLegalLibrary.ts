import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { legalLibraryApi } from '@/api/legal-library.api';
import {
  LEGAL_RESEARCH_PAGE_SIZE,
  legalResearchKeys,
} from '@/features/legal-research/constants';
import type {
  CreateLibraryItemPayload,
  ListLibraryItemsParams,
} from '@/types';

export function useLegalLibrary(params?: ListLibraryItemsParams) {
  const queryParams = {
    page: 1,
    limit: LEGAL_RESEARCH_PAGE_SIZE,
    ...params,
  };

  return useQuery({
    queryKey: legalResearchKeys.library.list(queryParams),
    queryFn: () => legalLibraryApi.list(queryParams),
  });
}

export function useLibraryItem(id: string) {
  return useQuery({
    queryKey: legalResearchKeys.library.detail(id),
    queryFn: () => legalLibraryApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateLibraryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateLibraryItemPayload) =>
      legalLibraryApi.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: legalResearchKeys.library.all,
      });
    },
  });
}

export function useDeleteLibraryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => legalLibraryApi.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: legalResearchKeys.library.all,
      });
    },
  });
}
