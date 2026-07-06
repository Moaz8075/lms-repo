'use client';

import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import DocumentScannerOutlinedIcon from '@mui/icons-material/DocumentScannerOutlined';
import { NumberField } from '@/components/ui/NumberField';
import { FormDialog } from '@/components/ui/FormDialog';
import { useCreateLegalNote } from '@/hooks/useLegalNotes';
import { extractTextFromImage } from '@/utils/ocr';
import { suggestNoteTitle } from '@/utils/legal-research';
import { parseTagsInput } from '@/components/legal-research/TagChips';

interface PhysicalBookScanModalProps {
  open: boolean;
  onClose: () => void;
}

export function PhysicalBookScanModal({ open, onClose }: PhysicalBookScanModalProps) {
  const createNote = useCreateLegalNote();
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [bookTitle, setBookTitle] = useState('');
  const [citation, setCitation] = useState('');
  const [court, setCourt] = useState('');
  const [pageNumber, setPageNumber] = useState('1');
  const [extractedText, setExtractedText] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [personalNote, setPersonalNote] = useState('');
  const [tagsInput, setTagsInput] = useState('physical-book');
  const [ocrProgress, setOcrProgress] = useState<number | null>(null);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);

  const stopCamera = () => {
    cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
    cameraStreamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraOpen(false);
  };

  useEffect(() => {
    if (!open) {
      stopCamera();
      setImageFile(null);
      setImagePreview(null);
      setBookTitle('');
      setCitation('');
      setCourt('');
      setPageNumber('1');
      setExtractedText('');
      setNoteTitle('');
      setPersonalNote('');
      setTagsInput('physical-book');
      setOcrProgress(null);
      setOcrError(null);
      setIsExtracting(false);
    }
  }, [open]);

  useEffect(() => {
    return () => {
      stopCamera();
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const applyImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setOcrError('Please choose a photo (JPEG or PNG).');
      return;
    }

    setOcrError(null);
    setExtractedText('');
    setNoteTitle('');
    setImageFile(file);
    setImagePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  };

  const handleUploadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    applyImageFile(file);
  };

  const startCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setOcrError('Camera is not supported in this browser. Upload an image instead.');
      return;
    }

    setOcrError(null);

    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      cameraStreamRef.current = stream;
      setCameraOpen(true);

      requestAnimationFrame(() => {
        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        void video.play();
      });
    } catch {
      setOcrError('Could not access the camera. Allow permission or upload an image instead.');
      stopCamera();
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) {
      setOcrError('Camera is not ready yet. Wait a moment and try again.');
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (!context) {
      setOcrError('Could not capture photo. Try uploading an image instead.');
      return;
    }

    context.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setOcrError('Could not capture photo. Try again.');
          return;
        }

        const file = new File([blob], `book-page-${Date.now()}.jpg`, { type: 'image/jpeg' });
        applyImageFile(file);
        stopCamera();
      },
      'image/jpeg',
      0.92,
    );
  };

  const handleExtractText = async () => {
    if (!imageFile) {
      setOcrError('Take or upload a photo of the book page first.');
      return;
    }

    setIsExtracting(true);
    setOcrError(null);
    setOcrProgress(0);

    try {
      const text = await extractTextFromImage(imageFile, setOcrProgress);
      if (!text) {
        setOcrError(
          'No text detected. Try better lighting, a flatter photo, or type the paragraph manually below.',
        );
        setExtractedText('');
        return;
      }
      setExtractedText(text);
      setNoteTitle(suggestNoteTitle(text.split('\n')[0] ?? text));
    } catch {
      setOcrError('OCR failed. You can still type the paragraph manually.');
    } finally {
      setIsExtracting(false);
      setOcrProgress(null);
    }
  };

  const handleSubmit = async () => {
    const page = Number(pageNumber);
    const text = extractedText.trim();

    if (!bookTitle.trim()) {
      setOcrError('Book title is required.');
      return;
    }
    if (!text) {
      setOcrError('Extracted text is required. Run OCR or type the paragraph.');
      return;
    }
    if (!noteTitle.trim()) {
      setOcrError('Note title is required.');
      return;
    }
    if (!page || page < 1) {
      setOcrError('Enter a valid page number.');
      return;
    }

    await createNote.mutateAsync({
      title: noteTitle.trim(),
      pageNumber: page,
      selectedText: text,
      personalNote: personalNote.trim() || undefined,
      citation: citation.trim() || bookTitle.trim() || undefined,
      court: court.trim() || undefined,
      tags: tagsInput ? parseTagsInput(tagsInput) : ['physical-book'],
    });
    onClose();
  };

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title="Scan Physical Book Page"
      submitLabel="Save Note"
      onSubmit={() => {
        void handleSubmit();
      }}
      loading={createNote.isPending}
      accent="teal"
      icon={<DocumentScannerOutlinedIcon />}
      maxWidth={cameraOpen ? 'lg' : 'md'}
    >
      <Stack spacing={2} sx={{ pt: 1 }}>
        {(createNote.isError || ocrError) && (
          <Alert severity="error">{ocrError ?? 'Failed to save note. Please try again.'}</Alert>
        )}

        {!cameraOpen && (
          <Alert severity="info" sx={{ py: 0.5 }}>
            Photograph a page from a hard-copy book. OCR works best with clear English text and good
            lighting.
          </Alert>
        )}

        <input
          ref={uploadInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
          hidden
          onChange={handleUploadChange}
        />

        {cameraOpen ? (
          <Box
            sx={{
              mx: -3,
              width: 'calc(100% + 48px)',
            }}
          >
            <Box
              component="video"
              ref={videoRef}
              autoPlay
              playsInline
              muted
              sx={{
                display: 'block',
                width: '100%',
                minHeight: { xs: 280, sm: 360 },
                height: { xs: '52vh', sm: '58vh' },
                maxHeight: 640,
                borderRadius: 0,
                borderTop: '1px solid',
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: '#000',
                objectFit: 'contain',
              }}
            />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.5, px: 3 }}>
              <Button
                variant="contained"
                startIcon={<PhotoCameraOutlinedIcon />}
                onClick={capturePhoto}
                sx={{ bgcolor: '#0D9488', '&:hover': { bgcolor: '#0F766E' } }}
              >
                Capture photo
              </Button>
              <Button variant="outlined" onClick={stopCamera}>
                Cancel
              </Button>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<PhotoCameraOutlinedIcon />}
              onClick={() => {
                void startCamera();
              }}
            >
              Take photo
            </Button>
            <Button
              variant="outlined"
              startIcon={<UploadFileOutlinedIcon />}
              onClick={() => uploadInputRef.current?.click()}
            >
              Upload image
            </Button>
            <Button
              variant="contained"
              disabled={!imageFile || isExtracting}
              onClick={handleExtractText}
              sx={{ bgcolor: '#0D9488', '&:hover': { bgcolor: '#0F766E' } }}
            >
              {isExtracting ? 'Extracting…' : 'Extract text'}
            </Button>
          </Box>
        )}

        {isExtracting && ocrProgress !== null && (
          <Box>
            <LinearProgress variant="determinate" value={ocrProgress * 100} />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
              Reading text from photo… {Math.round(ocrProgress * 100)}%
            </Typography>
          </Box>
        )}

        {imagePreview && (
          <Box
            component="img"
            src={imagePreview}
            alt="Book page preview"
            sx={{
              width: '100%',
              maxHeight: 200,
              objectFit: 'contain',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: '#fff',
            }}
          />
        )}

        <TextField
          label="Book title"
          required
          fullWidth
          placeholder="Principles of Constitutional Law"
          value={bookTitle}
          onChange={(e) => setBookTitle(e.target.value)}
        />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <NumberField
            label="Page number"
            required
            fullWidth
            value={pageNumber}
            onChange={(e) => setPageNumber(e.target.value)}
          />
          <TextField
            label="Citation"
            fullWidth
            placeholder="PLD 2020 SC 123"
            value={citation}
            onChange={(e) => setCitation(e.target.value)}
          />
        </Stack>

        <TextField
          label="Court / publisher"
          fullWidth
          value={court}
          onChange={(e) => setCourt(e.target.value)}
        />

        <TextField
          label="Extracted text"
          required
          fullWidth
          multiline
          minRows={5}
          placeholder="OCR text appears here — edit before saving"
          value={extractedText}
          onChange={(e) => {
            setExtractedText(e.target.value);
            if (!noteTitle.trim() && e.target.value.trim()) {
              setNoteTitle(suggestNoteTitle(e.target.value.split('\n')[0] ?? e.target.value));
            }
          }}
          helperText="Review and correct OCR mistakes before saving"
        />

        <TextField
          label="Note title"
          required
          fullWidth
          value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)}
        />

        <TextField
          label="Personal note"
          fullWidth
          multiline
          minRows={2}
          value={personalNote}
          onChange={(e) => setPersonalNote(e.target.value)}
        />

        <TextField
          label="Tags"
          fullWidth
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
        />
      </Stack>
    </FormDialog>
  );
}
