import type { ListClientsParams } from '@/types';

export const CLIENTS_PAGE_SIZE = 20;
export const CLIENTS_REFETCH_INTERVAL_MS = 30_000;

export const clientsKeys = {
  all: ['clients'] as const,
  list: (params?: ListClientsParams) =>
    ['clients', 'list', params ?? {}] as const,
  detail: (id: string) => ['clients', 'detail', id] as const,
};
