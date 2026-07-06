import type { Case, LegalNote } from '@/types';
import { formatDate, formatFullName } from '@/utils/format';

export interface LegalNotePrintData {
  organizationName: string;
  organizationAddress?: string | null;
  organizationPhone?: string | null;
  lawyerName: string;
  preparedDate: string;
  note: LegalNote;
  caseData?: Case | null;
}

export function getNoteSourceBookName(note: LegalNote): string {
  if (note.libraryItem?.title) return note.libraryItem.title;
  if (note.citation) return note.citation;
  if (note.tags.includes('physical-book')) return 'Physical book';
  return '—';
}

export function buildLegalNotePrintData(params: {
  note: LegalNote;
  organizationName: string;
  organizationAddress?: string | null;
  organizationPhone?: string | null;
  lawyerName: string;
  caseData?: Case | null;
}): LegalNotePrintData {
  return {
    organizationName: params.organizationName,
    organizationAddress: params.organizationAddress,
    organizationPhone: params.organizationPhone,
    lawyerName: params.lawyerName,
    preparedDate: formatDate(new Date().toISOString()),
    note: params.note,
    caseData: params.caseData,
  };
}

export const LEGAL_NOTE_PRINT_STYLES = `
  @page {
    size: A4;
    margin: 18mm 16mm;
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: "Times New Roman", Times, serif;
    color: #111827;
    background: #fff;
    font-size: 12pt;
    line-height: 1.55;
  }

  .legal-note-print-sheet {
    max-width: 780px;
    margin: 0 auto;
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

  .print-org-meta {
    font-size: 10pt;
    color: #4b5563;
    margin: 0;
  }

  .print-title-block {
    text-align: center;
    margin: 18px 0 22px;
  }

  .print-doc-title {
    font-size: 14pt;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin: 0 0 4px;
  }

  .print-doc-subtitle {
    font-size: 10pt;
    color: #4b5563;
    margin: 0;
  }

  .print-section {
    margin-bottom: 18px;
    page-break-inside: avoid;
  }

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

  .print-grid {
    display: grid;
    grid-template-columns: 150px 1fr;
    gap: 6px 12px;
  }

  .print-label {
    font-weight: 600;
    color: #374151;
  }

  .print-value {
    margin: 0;
  }

  .print-excerpt-box {
    border: 1px solid #d1d5db;
    border-left: 4px solid #1f2937;
    padding: 14px 16px;
    background: #f9fafb;
    margin-top: 8px;
  }

  .print-excerpt-text {
    margin: 0;
    font-style: italic;
    white-space: pre-wrap;
  }

  .print-remarks {
    margin: 8px 0 0;
    white-space: pre-wrap;
  }

  .print-footer {
    margin-top: 28px;
    page-break-inside: avoid;
  }

  .print-prepared {
    font-size: 10pt;
    color: #4b5563;
    margin: 0 0 28px;
  }

  .print-signature-block {
    width: 280px;
    margin-left: auto;
    text-align: center;
  }

  .print-signature-line {
    border-top: 1px solid #111827;
    margin: 42px 0 8px;
  }

  .print-signature-name {
    font-weight: 700;
    margin: 0;
  }

  .print-signature-role {
    margin: 2px 0 0;
    font-size: 10pt;
    color: #4b5563;
  }

  .print-signature-label {
    margin: 6px 0 0;
    font-size: 9pt;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #6b7280;
  }
`;

export function printLegalNoteSheet(element: HTMLElement, documentTitle: string) {
  const printWindow = window.open('', '_blank', 'noopener,noreferrer,width=900,height=700');
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(documentTitle)}</title>
        <style>${LEGAL_NOTE_PRINT_STYLES}</style>
      </head>
      <body>${element.outerHTML}</body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.onload = () => {
    printWindow.print();
    printWindow.close();
  };
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function getDefaultLawyerName(
  user: { firstName: string; lastName: string } | null | undefined,
): string {
  if (!user) return '';
  return formatFullName(user.firstName, user.lastName);
}
