import { api, unwrap } from './api';
import type {
  CaseScopedParams,
  CreateExpensePayload,
  Expense,
  ExpensesListResult,
  UpdateExpensePayload,
} from '@/types';

export const expenseService = {
  list: (params: CaseScopedParams) =>
    unwrap<ExpensesListResult>(api.get('/expenses', { params })),

  create: (payload: CreateExpensePayload) =>
    unwrap<Expense>(api.post('/expenses', payload)),

  update: (id: string, payload: UpdateExpensePayload) =>
    unwrap<Expense>(api.patch(`/expenses/${id}`, payload)),

  delete: (id: string) => unwrap<void>(api.delete(`/expenses/${id}`)),
};
