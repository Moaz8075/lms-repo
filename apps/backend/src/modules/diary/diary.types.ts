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
