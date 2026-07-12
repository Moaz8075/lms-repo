import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { clientsApi } from '@/api/clients.api';
import {
  CLIENTS_PAGE_SIZE,
  CLIENTS_REFETCH_INTERVAL_MS,
  clientsKeys,
} from '@/features/clients/constants';
import type {
  CreateClientPayload,
  ListClientsParams,
  UpdateClientPayload,
} from '@/types';

export function useClients(params?: ListClientsParams) {
  const queryParams = {
    page: 1,
    limit: CLIENTS_PAGE_SIZE,
    ...params,
  };

  return useQuery({
    queryKey: clientsKeys.list(queryParams),
    queryFn: () => clientsApi.list(queryParams),
    refetchInterval: CLIENTS_REFETCH_INTERVAL_MS,
  });
}

export function useClient(id: string) {
  return useQuery({
    queryKey: clientsKeys.detail(id),
    queryFn: () => clientsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateClientPayload) => clientsApi.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: clientsKeys.all });
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateClientPayload;
    }) => clientsApi.update(id, payload),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: clientsKeys.all });
      void queryClient.invalidateQueries({
        queryKey: clientsKeys.detail(variables.id),
      });
    },
  });
}

export function useDeactivateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => clientsApi.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: clientsKeys.all });
    },
  });
}
