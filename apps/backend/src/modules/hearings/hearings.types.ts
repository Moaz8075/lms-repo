import { Hearing } from '@prisma/client';

export interface HearingResponse {
  id: string;
  organizationId: string;
  caseId: string;
  hearingDate: string;
  time: string;
  scheduledDate: Date;
  courtRoom: string | null;
  purpose: string | null;
  notes: string | null;
  nextHearingDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export function combineDateAndTime(date: string, time: string): Date {
  const normalizedTime = time.length === 5 ? `${time}:00` : time;
  return new Date(`${date}T${normalizedTime}`);
}

export function extractDateAndTime(scheduledDate: Date): {
  hearingDate: string;
  time: string;
} {
  const iso = scheduledDate.toISOString();
  return {
    hearingDate: iso.slice(0, 10),
    time: iso.slice(11, 16),
  };
}

export function toHearingResponse(hearing: Hearing): HearingResponse {
  const { hearingDate, time } = extractDateAndTime(hearing.scheduledDate);

  return {
    id: hearing.id,
    organizationId: hearing.organizationId,
    caseId: hearing.caseId,
    hearingDate,
    time,
    scheduledDate: hearing.scheduledDate,
    courtRoom: hearing.courtRoom,
    purpose: hearing.purpose,
    notes: hearing.notes,
    nextHearingDate: hearing.nextHearingDate,
    createdAt: hearing.createdAt,
    updatedAt: hearing.updatedAt,
  };
}
