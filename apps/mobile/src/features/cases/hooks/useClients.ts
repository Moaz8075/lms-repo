import { useClients } from '@/features/clients/hooks';

/** Case-picker helper — lists clients for create-case forms. */
export function useClientsForPicker(search?: string) {
  return useClients({
    page: 1,
    limit: 50,
    search: search?.trim() || undefined,
  });
}
