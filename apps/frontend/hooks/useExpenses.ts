import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { expenseService } from '@/services/expense.service';
import type { CaseScopedParams, CreateExpensePayload, UpdateExpensePayload } from '@/types';

export function useExpenses(params: CaseScopedParams | undefined) {
  return useQuery({
    queryKey: ['expenses', params],
    queryFn: () => expenseService.list(params!),
    enabled: !!params?.caseId,
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateExpensePayload) => expenseService.create(payload),
    onSuccess: (_, { caseId }) => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['cases', caseId] });
    },
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateExpensePayload }) =>
      expenseService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['cases'] });
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => expenseService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['cases'] });
    },
  });
}
