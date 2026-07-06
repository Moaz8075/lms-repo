'use client';

import type { LegalNotePrintData } from '@/utils/legal-note-print';
import { getNoteSourceBookName } from '@/utils/legal-note-print';
import { formatFullName } from '@/utils/format';

interface LegalNotePrintSheetProps {
  data: LegalNotePrintData;
}

export function LegalNotePrintSheet({ data }: LegalNotePrintSheetProps) {
  const { note, caseData, organizationName, organizationAddress, organizationPhone, lawyerName, preparedDate } =
    data;
  const bookName = getNoteSourceBookName(note);
  const citation = note.citation ?? note.libraryItem?.citation ?? '—';
  const court = note.court ?? '—';

  return (
    <article className="legal-note-print-sheet">
      <header className="print-header">
        <h1 className="print-org-name">{organizationName}</h1>
        {(organizationAddress || organizationPhone) && (
          <p className="print-org-meta">
            {[organizationAddress, organizationPhone].filter(Boolean).join(' · ')}
          </p>
        )}
      </header>

      <div className="print-title-block">
        <h2 className="print-doc-title">Legal Research Memorandum</h2>
        <p className="print-doc-subtitle">For Court Submission / Case File Attachment</p>
      </div>

      {caseData && (
        <section className="print-section">
          <h3 className="print-section-title">Case Reference</h3>
          <div className="print-grid">
            <span className="print-label">Case Number</span>
            <p className="print-value">{caseData.caseNumber}</p>
            <span className="print-label">Case Title</span>
            <p className="print-value">{caseData.title}</p>
            <span className="print-label">Court</span>
            <p className="print-value">{caseData.courtName ?? '—'}</p>
            <span className="print-label">Client</span>
            <p className="print-value">{caseData.client?.name ?? '—'}</p>
            {caseData.opposingParty && (
              <>
                <span className="print-label">Opposing Party</span>
                <p className="print-value">{caseData.opposingParty}</p>
              </>
            )}
          </div>
        </section>
      )}

      <section className="print-section">
        <h3 className="print-section-title">Source / Authority</h3>
        <div className="print-grid">
          <span className="print-label">Book / Document</span>
          <p className="print-value">{bookName}</p>
          <span className="print-label">Citation</span>
          <p className="print-value">{citation}</p>
          <span className="print-label">Court / Publisher</span>
          <p className="print-value">{court}</p>
          <span className="print-label">Page Number</span>
          <p className="print-value">{note.pageNumber}</p>
        </div>
      </section>

      <section className="print-section">
        <h3 className="print-section-title">Excerpt / Research Note</h3>
        <div className="print-grid">
          <span className="print-label">Subject</span>
          <p className="print-value">{note.title}</p>
        </div>
        <div className="print-excerpt-box">
          <p className="print-excerpt-text">&ldquo;{note.selectedText}&rdquo;</p>
        </div>
        {note.personalNote && (
          <>
            <p className="print-label" style={{ marginTop: 14 }}>
              Counsel&apos;s Remarks
            </p>
            <p className="print-remarks">{note.personalNote}</p>
          </>
        )}
      </section>

      <footer className="print-footer">
        <div className="print-signature-block">
          <div className="print-signature-line" />
          <p className="print-signature-name">{lawyerName}</p>
          <p className="print-signature-role">Advocate, {organizationName}</p>
          <p className="print-signature-label">Signature</p>
        </div>
      </footer>
    </article>
  );
}
