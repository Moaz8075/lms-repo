import { ExpenseCategory } from '@prisma/client';

export enum ApiExpenseCategory {
  COURT_FEES = 'court_fees',
  FILING_FEE = 'filing_fee',
  TRAVEL = 'travel',
  STATIONERY = 'stationery',
  WITNESS_FEE = 'witness_fee',
  CONSULTATION = 'consultation',
  PHOTOCOPY = 'photocopy',
  NOTARY = 'notary',
  OTHER = 'other',
}

export const API_EXPENSE_CATEGORY_TO_DB: Record<ApiExpenseCategory, ExpenseCategory> = {
  [ApiExpenseCategory.COURT_FEES]: ExpenseCategory.COURT_FEES,
  [ApiExpenseCategory.FILING_FEE]: ExpenseCategory.FILING_FEE,
  [ApiExpenseCategory.TRAVEL]: ExpenseCategory.TRAVEL,
  [ApiExpenseCategory.STATIONERY]: ExpenseCategory.STATIONERY,
  [ApiExpenseCategory.WITNESS_FEE]: ExpenseCategory.WITNESS_FEE,
  [ApiExpenseCategory.CONSULTATION]: ExpenseCategory.CONSULTATION,
  [ApiExpenseCategory.PHOTOCOPY]: ExpenseCategory.PHOTOCOPY,
  [ApiExpenseCategory.NOTARY]: ExpenseCategory.NOTARY,
  [ApiExpenseCategory.OTHER]: ExpenseCategory.OTHER,
};

export const DB_EXPENSE_CATEGORY_TO_API: Record<string, ApiExpenseCategory | string> = {
  [ExpenseCategory.COURT_FEES]: ApiExpenseCategory.COURT_FEES,
  [ExpenseCategory.FILING_FEE]: ApiExpenseCategory.FILING_FEE,
  [ExpenseCategory.TRAVEL]: ApiExpenseCategory.TRAVEL,
  [ExpenseCategory.STATIONERY]: ApiExpenseCategory.STATIONERY,
  [ExpenseCategory.WITNESS_FEE]: ApiExpenseCategory.WITNESS_FEE,
  [ExpenseCategory.CONSULTATION]: ApiExpenseCategory.CONSULTATION,
  [ExpenseCategory.PHOTOCOPY]: ApiExpenseCategory.PHOTOCOPY,
  [ExpenseCategory.NOTARY]: ApiExpenseCategory.NOTARY,
  [ExpenseCategory.OTHER]: ApiExpenseCategory.OTHER,
};
