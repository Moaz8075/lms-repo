'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import '@/lib/pdfjs';
import type { LibraryItem } from '@/types';
import { suggestNoteTitle } from '@/utils/legal-research';

export interface PdfNoteSelection {
  selectedText: string;
  pageNumber: number;
}

interface LibraryPdfViewerDrawerProps {
  open: boolean;
  item: LibraryItem | null;
  onClose: () => void;
  onAddNote?: (selection: PdfNoteSelection) => void;
  canAddNote?: boolean;
}

interface TextSelectionState extends PdfNoteSelection {
  top: number;
  left: number;
}

export function LibraryPdfViewerDrawer({
  open,
  item,
  onClose,
  onAddNote,
  canAddNote = true,
}: LibraryPdfViewerDrawerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageWidth, setPageWidth] = useState(640);
  const [selection, setSelection] = useState<TextSelectionState | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setNumPages(0);
      setPageNumber(1);
      setSelection(null);
      setLoadError(null);
      return;
    }

    const updateWidth = () => {
      const width = containerRef.current?.clientWidth ?? 640;
      setPageWidth(Math.min(Math.max(width - 32, 320), 900));
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [open]);

  const resolvePageNumber = useCallback((anchorNode: Node | null): number => {
    if (!anchorNode) return pageNumber;
    const element =
      anchorNode instanceof Element ? anchorNode : anchorNode.parentElement;
    const pageEl = element?.closest('[data-pdf-page]');
    if (pageEl) {
      const value = Number(pageEl.getAttribute('data-pdf-page'));
      if (!Number.isNaN(value) && value > 0) return value;
    }
    return pageNumber;
  }, [pageNumber]);

  const handleTextSelection = useCallback(() => {
    const sel = window.getSelection();
    const text = sel?.toString().replace(/\s+/g, ' ').trim() ?? '';
    if (!text || !containerRef.current?.contains(sel?.anchorNode ?? null)) {
      setSelection(null);
      return;
    }

    const range = sel?.rangeCount ? sel.getRangeAt(0) : null;
    const rect = range?.getBoundingClientRect();
    if (!rect || (rect.width === 0 && rect.height === 0)) {
      setSelection(null);
      return;
    }

    setSelection({
      selectedText: text,
      pageNumber: resolvePageNumber(sel?.anchorNode ?? null),
      top: rect.bottom + 8,
      left: Math.min(rect.left, window.innerWidth - 200),
    });
  }, [resolvePageNumber]);

  useEffect(() => {
    if (!open) return;
    document.addEventListener('mouseup', handleTextSelection);
    return () => document.removeEventListener('mouseup', handleTextSelection);
  }, [open, handleTextSelection]);

  const handleAddNote = () => {
    if (!selection || !onAddNote) return;
    onAddNote({
      selectedText: selection.selectedText,
      pageNumber: selection.pageNumber,
    });
    window.getSelection()?.removeAllRanges();
    setSelection(null);
  };

  if (!item) return null;

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: { xs: '100%', md: 'min(720px, 55vw)' },
            bgcolor: '#F4F6F9',
          },
        }}
      >
        <Toolbar
          sx={{
            px: 2,
            gap: 1,
            bgcolor: '#fff',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle1" fontWeight={700} noWrap>
              {item.title}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {item.citation ?? 'Reference document'}
              {numPages > 0 ? ` · Page ${pageNumber} of ${numPages}` : ''}
            </Typography>
          </Box>
          <IconButton
            size="small"
            href={item.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            component="a"
            aria-label="Open in new tab"
          >
            <OpenInNewIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={onClose} aria-label="Close viewer">
            <CloseIcon />
          </IconButton>
        </Toolbar>

        <Box
          sx={{
            px: 2,
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            bgcolor: '#E8EAFD',
            borderBottom: '1px solid #C5CAFC',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Select text in the PDF, then click <strong>Add note</strong>
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton
              size="small"
              disabled={pageNumber <= 1}
              onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
            >
              <ChevronLeftIcon />
            </IconButton>
            <Typography variant="body2" fontWeight={600} sx={{ minWidth: 72, textAlign: 'center' }}>
              {numPages > 0 ? `${pageNumber} / ${numPages}` : '—'}
            </Typography>
            <IconButton
              size="small"
              disabled={numPages === 0 || pageNumber >= numPages}
              onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
            >
              <ChevronRightIcon />
            </IconButton>
          </Box>
        </Box>

        <Box
          ref={containerRef}
          sx={{
            flex: 1,
            overflow: 'auto',
            p: 2,
            display: 'flex',
            justifyContent: 'center',
            minHeight: 'calc(100vh - 140px)',
          }}
        >
          <Document
            file={item.pdfUrl}
            onLoadSuccess={({ numPages: total }) => {
              setNumPages(total);
              setLoadError(null);
            }}
            onLoadError={() =>
              setLoadError('Unable to load PDF. Try opening in a new tab.')
            }
            loading={
              <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
              </Box>
            }
            error={
              <Typography color="error" sx={{ py: 4 }}>
                {loadError ?? 'Failed to load PDF.'}
              </Typography>
            }
          >
            <Box
              data-pdf-page={pageNumber}
              sx={{
                bgcolor: '#fff',
                boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
                borderRadius: 1,
                overflow: 'hidden',
                '& .react-pdf__Page__textContent': { userSelect: 'text' },
              }}
            >
              <Page
                pageNumber={pageNumber}
                width={pageWidth}
                renderTextLayer
                renderAnnotationLayer
              />
            </Box>
          </Document>
        </Box>
      </Drawer>

      {selection && canAddNote && onAddNote && (
        <Box
          sx={{
            position: 'fixed',
            top: selection.top,
            left: selection.left,
            zIndex: (theme) => theme.zIndex.drawer + 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
            maxWidth: 320,
          }}
        >
          <Button
            variant="contained"
            size="small"
            startIcon={<StickyNote2OutlinedIcon />}
            onClick={handleAddNote}
            sx={{
              bgcolor: '#7C3AED',
              fontWeight: 700,
              boxShadow: '0 4px 14px rgba(124,58,237,0.45)',
              '&:hover': { bgcolor: '#5B21B6' },
            }}
          >
            Add note
          </Button>
          <Typography
            variant="caption"
            sx={{
              bgcolor: 'rgba(255,255,255,0.95)',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              border: '1px solid #E5E7EB',
              color: 'text.secondary',
            }}
          >
            Page {selection.pageNumber} · {suggestNoteTitle(selection.selectedText)}
          </Typography>
        </Box>
      )}
    </>
  );
}
