export interface DashboardStats {
  hearingsToday: number;
  tasksRemaining: number;
  pendingPaymentsCount: number;
  totalCases: number;
}

export interface DashboardHearingCard {
  hearingId: string;
  caseId: string;
  caseNumber: string;
  caseTitle: string;
  clientName: string;
  courtName: string | null;
  courtRoom: string | null;
  hearingTime: string | null;
  todayPurpose: string | null;
}

export interface DashboardTaskItem {
  id: string;
  title: string;
  caseId: string | null;
  caseTitle: string | null;
  status: string;
  time: string | null;
}

export interface DashboardPendingPayment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  dueDate: string | null;
  caseId: string;
  caseNumber: string;
  caseTitle: string;
  clientName: string | null;
}

export interface DashboardRecentCase {
  id: string;
  caseNumber: string;
  title: string;
  updatedAt: string;
  clientName: string | null;
}

export interface DashboardData {
  date: string;
  stats: DashboardStats;
  todaysHearings: DashboardHearingCard[];
  todaysTasks: DashboardTaskItem[];
  pendingPayments: DashboardPendingPayment[];
  recentCases: DashboardRecentCase[];
}

export interface TaskResponse {
  id: string;
  title: string;
  caseId: string | null;
  caseTitle: string | null;
  status: string;
  time: string | null;
  date: string;
}

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
