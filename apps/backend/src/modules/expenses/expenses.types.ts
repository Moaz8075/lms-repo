import { Expense, User } from '@prisma/client';
import { DB_EXPENSE_CATEGORY_TO_API } from '../../common/enums';

export interface RecorderSummary {
  id: string;
  name: string;
  email: string;
}

export interface ExpenseResponse {
  id: string;
  organizationId: string;
  caseId: string;
  amount: number;
  currency: string;
  category: string;
  description: string | null;
  expenseDate: Date;
  createdAt: Date;
  updatedAt: Date;
  recordedBy?: RecorderSummary;
}

export interface CaseExpenseSummary {
  total: number;
  count: number;
}

export interface ListExpensesResponse {
  items: ExpenseResponse[];
  summary: CaseExpenseSummary;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

type ExpenseWithRecorder = Expense & { recordedBy?: User | null };

export function decimalToNumber(value: { toNumber(): number } | number | null): number {
  if (value == null) return 0;
  return typeof value === 'number' ? value : value.toNumber();
}

export function toRecorderSummary(user: User): RecorderSummary {
  return {
    id: user.id,
    name: `${user.firstName} ${user.lastName}`.trim(),
    email: user.email,
  };
}

export function toExpenseResponse(expense: ExpenseWithRecorder): ExpenseResponse {
  return {
    id: expense.id,
    organizationId: expense.organizationId,
    caseId: expense.caseId,
    amount: decimalToNumber(expense.amount),
    currency: expense.currency,
    category: DB_EXPENSE_CATEGORY_TO_API[expense.category] ?? expense.category,
    description: expense.description,
    expenseDate: expense.expenseDate,
    createdAt: expense.createdAt,
    updatedAt: expense.updatedAt,
    ...(expense.recordedBy && {
      recordedBy: toRecorderSummary(expense.recordedBy),
    }),
  };
}
