import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { legalLibraryService } from '@/services/legal-library.service';
import type { CreateLibraryItemPayload, ListLibraryItemsParams } from '@/types';

export function useLegalLibrary(params?: ListLibraryItemsParams) {
  return useQuery({
    queryKey: ['legal-library', params],
    queryFn: () => legalLibraryService.list(params),
  });
}

export function useLegalLibraryItem(id: string | undefined) {
  return useQuery({
    queryKey: ['legal-library', id],
    queryFn: () => legalLibraryService.getById(id!),
    enabled: !!id,
  });
}

export function useCreateLibraryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateLibraryItemPayload) => legalLibraryService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['legal-library'] });
    },
  });
}

export function useDeleteLibraryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => legalLibraryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['legal-library'] });
    },
  });
}
