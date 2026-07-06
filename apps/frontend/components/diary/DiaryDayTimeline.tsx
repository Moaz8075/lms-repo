'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import LinkIcon from '@mui/icons-material/Link';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import NotesOutlinedIcon from '@mui/icons-material/NotesOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import NextLink from 'next/link';
import { formatDate, formatTime12h } from '@/utils/format';
import type { TimelineItem } from '@/types';

const NAVY = '#0B1D3A';

const TAG_STYLES: Record<string, { bg: string; color: string }> = {
  HEARING: { bg: '#EDE9FE', color: '#5B21B6' },
  TASK: { bg: '#DBEAFE', color: '#1D4ED8' },
  CLIENT_MEETING: { bg: '#F3E8FF', color: '#7C3AED' },
  DOCUMENT_PREPARATION: { bg: '#DBEAFE', color: '#1D4ED8' },
  COURT_WORK: { bg: '#E0F2FE', color: '#0369A1' },
  PERSONAL: { bg: '#F1F5F9', color: '#475569' },
};

function getTagLabel(item: TimelineItem): string {
  if (item.type === 'HEARING') return 'HEARING';
  if (item.taskType === 'CLIENT_MEETING') return 'CLIENT MEETING';
  if (item.taskType) return item.taskType.replace(/_/g, ' ');
  return 'TASK';
}

function getTagStyle(item: TimelineItem) {
  if (item.type === 'HEARING') return TAG_STYLES.HEARING;
  if (item.taskType && TAG_STYLES[item.taskType]) return TAG_STYLES[item.taskType];
  return TAG_STYLES.TASK;
}

function getDisplayTitle(item: TimelineItem): string {
  if (item.type === 'HEARING') return item.caseTitle ?? item.title;
  return item.title;
}

interface DiaryDayTimelineProps {
  items: TimelineItem[];
  loading?: boolean;
  selectedDate: string;
}

export function DiaryDayTimeline({ items, loading, selectedDate }: DiaryDayTimelineProps) {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress size={36} sx={{ color: NAVY }} />
      </Box>
    );
  }

  if (items.length === 0) {
    return (
      <Box
        sx={{
          py: 8,
          px: 3,
          textAlign: 'center',
          border: '1px dashed #CBD5E1',
          borderRadius: 3,
          bgcolor: '#F8FAFC',
        }}
      >
        <Typography fontWeight={600} color="text.secondary">
          Nothing scheduled for {formatDate(selectedDate)}
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Use the arrows above to browse other dates.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {items.map((item, index) => {
        const tag = getTagStyle(item);
        const tagLabel = getTagLabel(item);
        const isHearing = item.type === 'HEARING';
        const isPending = item.status === 'PENDING' || item.status === 'IN_PROGRESS';

        return (
          <Box key={`${item.type}-${item.id}`} sx={{ display: 'flex', gap: 2, mb: index < items.length - 1 ? 0 : 0 }}>
            {/* Time column + spine */}
            <Box sx={{ width: 88, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box
                sx={{
                  px: 1.25,
                  py: 0.5,
                  borderRadius: 2,
                  bgcolor: '#F1F5F9',
                  border: '1px solid #E2E8F0',
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#475569',
                  whiteSpace: 'nowrap',
                }}
              >
                {formatTime12h(item.time)}
              </Box>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  bgcolor: NAVY,
                  border: '2px solid #fff',
                  boxShadow: '0 0 0 2px #E2E8F0',
                  mt: 1,
                  zIndex: 1,
                }}
              />
              {index < items.length - 1 && (
                <Box sx={{ width: 2, flex: 1, bgcolor: '#E2E8F0', minHeight: 24, mt: -1 }} />
              )}
            </Box>

            {/* Event card */}
            <Box
              sx={{
                flex: 1,
                mb: 3,
                p: 2.5,
                borderRadius: 2.5,
                bgcolor: '#fff',
                border: '1px solid #E2E8F0',
                boxShadow: '0 1px 3px rgba(15,23,42,0.06)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 2,
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box
                  component="span"
                  sx={{
                    display: 'inline-block',
                    px: 1.25,
                    py: 0.35,
                    borderRadius: 1,
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    bgcolor: tag.bg,
                    color: tag.color,
                    mb: 1,
                  }}
                >
                  {tagLabel}
                </Box>

                <Typography variant="h6" fontWeight={800} sx={{ color: NAVY, fontSize: 18, mb: 1.25, lineHeight: 1.3 }}>
                  {getDisplayTitle(item)}
                </Typography>

                {isHearing && item.courtName && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
                    <LocationOnOutlinedIcon sx={{ fontSize: 16, color: '#64748B' }} />
                    <Typography variant="body2" color="text.secondary">
                      {item.courtName}
                    </Typography>
                  </Box>
                )}

                {item.description && (
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75, mb: 0.75 }}>
                    <NotesOutlinedIcon sx={{ fontSize: 16, color: '#64748B', mt: 0.2 }} />
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  </Box>
                )}

                {isHearing && item.lastHearingDate && (
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.75,
                      mt: 0.5,
                      px: 1.5,
                      py: 0.75,
                      borderRadius: 2,
                      bgcolor: '#FEF3C7',
                      border: '1px solid #FCD34D',
                    }}
                  >
                    <HistoryOutlinedIcon sx={{ fontSize: 16, color: '#D97706' }} />
                    <Typography variant="body2" fontWeight={700} sx={{ color: '#B45309' }}>
                      Last Hearing:{' '}
                      <Box component="span" sx={{ color: '#92400E' }}>
                        {formatDate(item.lastHearingDate)}
                      </Box>
                    </Typography>
                  </Box>
                )}

                {!isHearing && item.caseTitle && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
                    <LinkIcon sx={{ fontSize: 16, color: '#64748B' }} />
                    <Typography variant="body2" color="text.secondary">
                      Linked: {item.caseTitle}
                    </Typography>
                  </Box>
                )}

                {!isHearing && !item.caseTitle && item.taskType === 'CLIENT_MEETING' && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
                    <PersonOutlineIcon sx={{ fontSize: 16, color: '#64748B' }} />
                    <Typography variant="body2" color="text.secondary">
                      Client meeting
                    </Typography>
                  </Box>
                )}

                {!isHearing && isPending && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.5 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#F59E0B' }} />
                    <Typography variant="caption" fontWeight={600} sx={{ color: '#B45309' }}>
                      {item.status.replace(/_/g, ' ')}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Box sx={{ flexShrink: 0 }}>
                {isHearing && item.caseId ? (
                  <Button
                    component={NextLink}
                    href={`/cases/${item.caseId}`}
                    variant="outlined"
                    size="small"
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      borderColor: '#CBD5E1',
                      color: NAVY,
                      borderRadius: 2,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Open Case
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    size="small"
                    disabled
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      borderColor: '#CBD5E1',
                      color: NAVY,
                      borderRadius: 2,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Mark Complete
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        );
      })}

      <Box
        sx={{
          mt: 1,
          p: 2.5,
          borderRadius: 2.5,
          border: '1px solid #E2E8F0',
          bgcolor: '#F8FAFC',
        }}
      >
        <Typography variant="body2" fontStyle="italic" color="text.secondary" textAlign="center">
          &ldquo;The law is a profession of words; be precise in your schedule.&rdquo; — LegalEase
          Efficiency Pro
        </Typography>
      </Box>
    </Box>
  );
}
