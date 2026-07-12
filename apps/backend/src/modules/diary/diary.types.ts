export type TimelineItemType = 'HEARING' | 'TASK';

export interface TimelineItem {
  id: string;
  type: TimelineItemType;
  title: string;
  caseId: string | null;
  caseTitle: string | null;
  courtName: string | null;
  time: string | null;
  description: string | null;
  status: string;
  taskType?: string | null;
  lastHearingDate?: string | null;
}

export interface DiaryCaseRow {
  hearingId: string;
  caseId: string;
  caseNumber: string;
  caseTitle: string;
  clientName: string;
  courtName: string | null;
  courtRoom: string | null;
  hearingTime: string | null;
  todayPurpose: string | null;
  nextHearingDate: string | null;
  nextHearingPurpose: string | null;
}

export interface DailyDiaryResponse {
  date: string;
  hearings: TimelineItem[];
  tasks: TimelineItem[];
  combinedTimeline: TimelineItem[];
  caseRows: DiaryCaseRow[];
  totalCases: number;
}

export interface UpcomingDateGroup {
  date: string;
  label: string;
  items: TimelineItem[];
}

export interface UpcomingDiaryResponse {
  groups: UpcomingDateGroup[];
}

export interface CalendarDaySummary {
  date: string;
  hearingCount: number;
  taskCount: number;
  hasUrgent: boolean;
}

export interface DiaryCalendarResponse {
  month: string;
  days: CalendarDaySummary[];
}

export interface DiaryEntryDetailResponse {
  hearing: {
    id: string;
    hearingDate: string;
    time: string;
    courtRoom: string | null;
    purpose: string | null;
    notes: string | null;
    nextHearingDate: string | null;
    createdAt: string;
    updatedAt: string;
  };
  case: {
    id: string;
    caseNumber: string;
    title: string;
    caseType: string;
    status: string;
    courtName: string | null;
    judgeName: string | null;
    description: string | null;
    clientName: string;
    clientPhone: string | null;
    documentsCount: number;
    paymentsSummary: {
      total: number;
      paid: number;
      pending: number;
      count: number;
    };
  };
}
