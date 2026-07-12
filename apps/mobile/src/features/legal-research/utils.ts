import type { Case, LegalNote } from '@/types';
import { formatDate } from '@/utils/format-date';

export function parseTagsInput(value: string): string[] {
  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function suggestNoteTitle(text: string): string {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (!cleaned) return '';

  const words = cleaned.split(' ');
  const isShortHighlight = cleaned.length <= 40 && words.length <= 5;

  if (isShortHighlight) {
    return cleaned;
  }

  const MAX_WORDS = 7;
  const MAX_LEN = 48;

  let title = words.slice(0, MAX_WORDS).join(' ');
  if (title.length > MAX_LEN) {
    title = title.slice(0, MAX_LEN);
    const lastSpace = title.lastIndexOf(' ');
    if (lastSpace > 20) {
      title = title.slice(0, lastSpace);
    }
    title = title.trim();
  }

  if (title === cleaned) {
    title = words.slice(0, 4).join(' ');
  }

  return `${title.replace(/[.,;:!?]$/, '')}…`;
}

export function getNoteSourceLabel(note: LegalNote): string {
  if (note.libraryItem?.title) return note.libraryItem.title;
  if (note.citation) return note.citation;
  if (note.tags.includes('physical-book')) return 'Physical book';
  return 'Manual note';
}

export function formatCreatorName(creator: {
  firstName: string;
  lastName: string;
}): string {
  return `${creator.firstName} ${creator.lastName}`.trim();
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export interface LegalNotePrintParams {
  note: LegalNote;
  organizationName: string;
  organizationAddress?: string | null;
  organizationPhone?: string | null;
  lawyerName: string;
  caseData?: Pick<
    Case,
    'caseNumber' | 'title' | 'courtName' | 'opposingParty'
  > & {
    client?: { name: string } | null;
  } | null;
}

export function buildLegalNotePrintHtml(params: LegalNotePrintParams): string {
  const {
    note,
    organizationName,
    organizationAddress,
    organizationPhone,
    lawyerName,
    caseData,
  } = params;

  const bookName = getNoteSourceLabel(note);
  const citation = note.citation ?? note.libraryItem?.citation ?? '—';
  const court = note.court ?? '—';
  const preparedDate = formatDate(new Date().toISOString());
  const orgMeta = [organizationAddress, organizationPhone]
    .filter(Boolean)
    .join(' · ');

  const caseRows = caseData
    ? [
        ['Case Number', caseData.caseNumber],
        ['Case Title', caseData.title],
        ['Court', caseData.courtName ?? '—'],
        ['Client', caseData.client?.name ?? '—'],
        ...(caseData.opposingParty
          ? [['Opposing Party', caseData.opposingParty] as [string, string]]
          : []),
      ]
        .map(
          ([label, value]) =>
            `<tr><td class="print-label">${escapeHtml(label)}</td><td class="print-value">${escapeHtml(value)}</td></tr>`,
        )
        .join('')
    : '';

  const caseSection = caseData
    ? `
      <section class="print-section">
        <h3 class="print-section-title">Case Reference</h3>
        <table class="print-table">${caseRows}</table>
      </section>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Legal Research Memorandum</title>
  <style>
    @page { size: A4; margin: 16mm; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Georgia, "Times New Roman", Times, serif;
      color: #111827;
      background: #fff;
      font-size: 12pt;
      line-height: 1.55;
      padding: 20px;
    }
    .print-header {
      text-align: center;
      border-bottom: 2px solid #111827;
      padding-bottom: 14px;
      margin-bottom: 18px;
    }
    .print-org-name {
      font-size: 18pt;
      font-weight: 700;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      margin: 0 0 4px;
    }
    .print-org-meta { font-size: 10pt; color: #4b5563; margin: 0; }
    .print-title-block { text-align: center; margin: 18px 0 22px; }
    .print-doc-title {
      font-size: 14pt;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin: 0 0 4px;
    }
    .print-doc-subtitle { font-size: 10pt; color: #4b5563; margin: 0; }
    .print-section { margin-bottom: 18px; }
    .print-section-title {
      font-size: 10pt;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #1f2937;
      border-bottom: 1px solid #d1d5db;
      padding-bottom: 4px;
      margin: 0 0 10px;
    }
    .print-table { width: 100%; border-collapse: collapse; }
    .print-table td { vertical-align: top; padding: 4px 0; }
    .print-label { font-weight: 600; color: #374151; width: 150px; }
    .print-value { margin: 0; }
    .print-excerpt-box {
      border: 1px solid #d1d5db;
      border-left: 4px solid #111827;
      padding: 14px 16px;
      background: #f9fafb;
      margin-top: 8px;
    }
    .print-excerpt-text { margin: 0; font-style: italic; white-space: pre-wrap; }
    .print-remarks { margin: 8px 0 0; white-space: pre-wrap; }
    .print-footer { margin-top: 28px; }
    .print-prepared { font-size: 10pt; color: #4b5563; margin: 0 0 28px; }
    .print-signature-block { width: 280px; margin-left: auto; text-align: center; }
    .print-signature-line { border-top: 1px solid #111827; margin: 42px 0 8px; }
    .print-signature-name { font-weight: 700; margin: 0; }
    .print-signature-role { margin: 2px 0 0; font-size: 10pt; color: #4b5563; }
    .print-signature-label {
      margin: 6px 0 0;
      font-size: 9pt;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #6b7280;
    }
  </style>
</head>
<body>
  <article>
    <header class="print-header">
      <h1 class="print-org-name">${escapeHtml(organizationName)}</h1>
      ${orgMeta ? `<p class="print-org-meta">${escapeHtml(orgMeta)}</p>` : ''}
    </header>

    <div class="print-title-block">
      <h2 class="print-doc-title">Legal Research Memorandum</h2>
      <p class="print-doc-subtitle">For Court Submission / Case File Attachment</p>
    </div>

    ${caseSection}

    <section class="print-section">
      <h3 class="print-section-title">Source / Authority</h3>
      <table class="print-table">
        <tr><td class="print-label">Book / Document</td><td class="print-value">${escapeHtml(bookName)}</td></tr>
        <tr><td class="print-label">Citation</td><td class="print-value">${escapeHtml(citation)}</td></tr>
        <tr><td class="print-label">Court / Publisher</td><td class="print-value">${escapeHtml(court)}</td></tr>
        <tr><td class="print-label">Page Number</td><td class="print-value">${note.pageNumber}</td></tr>
      </table>
    </section>

    <section class="print-section">
      <h3 class="print-section-title">Excerpt / Research Note</h3>
      <table class="print-table">
        <tr><td class="print-label">Subject</td><td class="print-value">${escapeHtml(note.title)}</td></tr>
      </table>
      <div class="print-excerpt-box">
        <p class="print-excerpt-text">"${escapeHtml(note.selectedText)}"</p>
      </div>
      ${
        note.personalNote
          ? `<p class="print-label" style="margin-top:14px">Counsel's Remarks</p>
             <p class="print-remarks">${escapeHtml(note.personalNote)}</p>`
          : ''
      }
    </section>

    <footer class="print-footer">
      <p class="print-prepared">Prepared on ${escapeHtml(preparedDate)}</p>
      <div class="print-signature-block">
        <div class="print-signature-line"></div>
        <p class="print-signature-name">${escapeHtml(lawyerName)}</p>
        <p class="print-signature-role">Advocate, ${escapeHtml(organizationName)}</p>
        <p class="print-signature-label">Signature</p>
      </div>
    </footer>
  </article>
</body>
</html>`;
}
