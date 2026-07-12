export type DiaryItemType = 'HEARING' | 'TASK';

export interface DiaryTimelineItem {
  id: string;
  type: DiaryItemType;
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

export interface DailyDiary {
  date: string;
  hearings: DiaryTimelineItem[];
  tasks: DiaryTimelineItem[];
  combinedTimeline: DiaryTimelineItem[];
  caseRows: DiaryCaseRow[];
  totalCases: number;
}

export interface UpcomingDiaryGroup {
  date: string;
  label: string;
  items: DiaryTimelineItem[];
}

export interface UpcomingDiary {
  groups: UpcomingDiaryGroup[];
}

export interface CalendarDaySummary {
  date: string;
  hearingCount: number;
  taskCount: number;
  hasUrgent: boolean;
}

export interface DiaryCalendar {
  month: string;
  days: CalendarDaySummary[];
}

export interface DiaryEntryDetail {
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

export interface CreateHearingPayload {
  caseId: string;
  hearingDate: string;
  time: string;
  courtRoom?: string;
  purpose?: string;
  notes?: string;
  nextHearingDate?: string;
}

export interface UpdateHearingPayload {
  hearingDate?: string;
  time?: string;
  courtRoom?: string;
  purpose?: string;
  notes?: string;
  nextHearingDate?: string;
}

export const HEARING_PURPOSE_OPTIONS = [
  'Final Arguments',
  'Cross Examination',
  'Evidence',
  'Interim Relief Hearing',
  'Stay Order Review',
  'Pre-Trial Conference',
  'Bail Application',
  'Arguments on Interim Relief',
  'Other',
] as const;
