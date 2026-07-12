import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import * as Sharing from 'expo-sharing';
import * as WebBrowser from 'expo-web-browser';

import { useLibraryItem } from '@/features/legal-research/hooks';
import {
  buildPdfViewerShellHtml,
  downloadPdfToCache,
  resolveMediaUrl,
} from '@/features/legal-research/pdf';
import { newNoteHref } from '@/features/legal-research/routes';
import { suggestNoteTitle } from '@/features/legal-research/utils';
import { useTheme } from '@/providers';

export default function LibraryPdfReaderScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { typography, colors, spacing, borderRadius } = useTheme();
  const webRef = useRef<WebView>(null);

  const itemId = id ?? '';
  const { data: item, isLoading, isError } = useLibraryItem(itemId);

  const [pageNumber, setPageNumber] = useState('1');
  const [selectedText, setSelectedText] = useState('');
  const [showNoteSheet, setShowNoteSheet] = useState(false);

  const [shellHtml, setShellHtml] = useState<string | null>(null);
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [localUri, setLocalUri] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [viewerReady, setViewerReady] = useState(false);

  const loadPdf = useCallback(async () => {
    if (!item?.pdfUrl) return;

    setPdfLoading(true);
    setPdfError(null);
    setShellHtml(null);
    setPdfBase64(null);
    setLocalUri(null);
    setViewerReady(false);

    try {
      const fileName = `${item.id}.pdf`;
      const { uri, base64 } = await downloadPdfToCache(item.pdfUrl, fileName);
      setLocalUri(uri);
      setPdfBase64(base64);
      setShellHtml(buildPdfViewerShellHtml(item.title));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to download PDF';
      setPdfError(message);
    } finally {
      setPdfLoading(false);
    }
  }, [item?.id, item?.pdfUrl, item?.title]);

  useEffect(() => {
    void loadPdf();
  }, [loadPdf]);

  const injectPdfData = useCallback(() => {
    if (!pdfBase64 || !webRef.current) return;
    // Chunk injection for very large files if needed; demo PDFs are tiny
    const script = `
      (function() {
        try {
          if (typeof window.__renderPdfBase64 === 'function') {
            window.__renderPdfBase64(${JSON.stringify(pdfBase64)});
          } else {
            window.ReactNativeWebView.postMessage('not-ready');
          }
        } catch (e) {
          window.ReactNativeWebView.postMessage('error:' + (e && e.message ? e.message : 'inject'));
        }
      })();
      true;
    `;
    webRef.current.injectJavaScript(script);
  }, [pdfBase64]);

  useEffect(() => {
    if (viewerReady && pdfBase64) {
      injectPdfData();
    }
  }, [viewerReady, pdfBase64, injectPdfData]);

  const onWebMessage = (event: WebViewMessageEvent) => {
    const data = event.nativeEvent.data;
    if (data === 'not-ready') {
      setTimeout(injectPdfData, 400);
    }
  };

  const openWithSystem = async () => {
    if (localUri && (await Sharing.isAvailableAsync())) {
      await Sharing.shareAsync(localUri, {
        mimeType: 'application/pdf',
        dialogTitle: item?.title ?? 'Open PDF',
        UTI: 'com.adobe.pdf',
      });
      return;
    }
    if (item?.pdfUrl) {
      await WebBrowser.openBrowserAsync(resolveMediaUrl(item.pdfUrl));
    }
  };

  const goCreateNote = () => {
    if (!item || !selectedText.trim()) return;
    router.push(
      newNoteHref({
        libraryItemId: item.id,
        selectedText: selectedText.trim(),
        pageNumber: pageNumber || '1',
        citation: item.citation ?? '',
        court: item.court ?? '',
        title: suggestNoteTitle(selectedText),
      }),
    );
  };

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: colors.background.default,
          paddingTop: insets.top,
        },
      ]}
    >
      <View
        style={[
          styles.toolbar,
          {
            borderBottomColor: colors.border.default,
            paddingHorizontal: spacing.md,
            paddingBottom: spacing.sm,
          },
        ]}
      >
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Text style={{ fontSize: 22, color: colors.primary.main }}>←</Text>
        </Pressable>
        <Text
          style={[typography.h3, { flex: 1, textAlign: 'center', fontSize: 15 }]}
          numberOfLines={1}
        >
          {item?.title ?? 'PDF Reader'}
        </Text>
        <Pressable
          onPress={() => setShowNoteSheet((v) => !v)}
          style={[
            styles.noteToggle,
            {
              backgroundColor: colors.secondary.light,
              borderRadius: borderRadius.full,
            },
          ]}
        >
          <Text
            style={[
              typography.caption,
              { color: colors.secondary.dark, fontWeight: '700' },
            ]}
          >
            + Note
          </Text>
        </Pressable>
      </View>

      {isLoading || pdfLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.primary.main} size="large" />
          <Text
            style={[
              typography.bodySmall,
              { color: colors.text.secondary, marginTop: 12, textAlign: 'center' },
            ]}
          >
            Downloading PDF from server…
          </Text>
        </View>
      ) : null}

      {isError || (!isLoading && !item) ? (
        <Text style={{ color: colors.error.main, padding: 16 }}>
          Unable to load document details.
        </Text>
      ) : null}

      {pdfError ? (
        <View style={[styles.centered, { paddingHorizontal: 24 }]}>
          <Text style={{ fontSize: 40, marginBottom: 12 }}>📄</Text>
          <Text
            style={[
              typography.body,
              { color: colors.error.main, textAlign: 'center', marginBottom: 8 },
            ]}
          >
            Could not open PDF
          </Text>
          <Text
            style={[
              typography.bodySmall,
              { color: colors.text.secondary, textAlign: 'center' },
            ]}
          >
            {pdfError}
          </Text>
          <Text
            style={[
              typography.caption,
              {
                color: colors.text.disabled,
                textAlign: 'center',
                marginTop: 12,
              },
            ]}
          >
            Make sure the backend is running (`yarn backend:dev`). Demo PDFs are
            served from the API host at /demo/*.pdf
          </Text>
          <Pressable
            onPress={() => void loadPdf()}
            style={[
              styles.actionBtn,
              {
                backgroundColor: colors.primary.main,
                borderRadius: borderRadius.md,
                marginTop: spacing.lg,
              },
            ]}
          >
            <Text style={[typography.button, { color: '#fff' }]}>Retry</Text>
          </Pressable>
        </View>
      ) : null}

      {shellHtml && !pdfLoading && !pdfError ? (
        <WebView
          ref={webRef}
          originWhitelist={['*']}
          source={{ html: shellHtml, baseUrl: 'https://cdnjs.cloudflare.com' }}
          style={{ flex: 1 }}
          javaScriptEnabled
          domStorageEnabled
          allowFileAccess
          allowUniversalAccessFromFileURLs
          mixedContentMode="always"
          setSupportMultipleWindows={false}
          onLoadEnd={() => setViewerReady(true)}
          onMessage={onWebMessage}
          startInLoadingState
          renderLoading={() => (
            <ActivityIndicator
              color={colors.primary.main}
              style={StyleSheet.absoluteFill}
            />
          )}
        />
      ) : null}

      {item && !pdfLoading ? (
        <View
          style={[
            styles.footer,
            {
              borderTopColor: colors.border.default,
              paddingBottom: showNoteSheet ? 8 : insets.bottom + 8,
              gap: 8,
            },
          ]}
        >
          <Pressable
            onPress={() => void openWithSystem()}
            style={[
              styles.actionBtn,
              {
                backgroundColor: colors.primary.main,
                borderRadius: borderRadius.md,
              },
            ]}
          >
            <Text style={[typography.button, { color: '#fff', textAlign: 'center' }]}>
              Open with…
            </Text>
          </Pressable>
        </View>
      ) : null}

      {showNoteSheet && item ? (
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.background.paper,
              borderTopColor: colors.border.default,
              paddingBottom: insets.bottom + spacing.md,
              paddingHorizontal: spacing.lg,
              paddingTop: spacing.md,
            },
          ]}
        >
          <Text style={[typography.h3, { fontSize: 16, marginBottom: 8 }]}>
            Add note from this PDF
          </Text>
          <Text
            style={[
              typography.caption,
              { color: colors.text.secondary, marginBottom: 8 },
            ]}
          >
            Type or paste the excerpt below, set the page, then continue.
          </Text>
          <View style={[styles.row, { gap: 8, marginBottom: 8 }]}>
            <TextInput
              value={pageNumber}
              onChangeText={setPageNumber}
              keyboardType="number-pad"
              placeholder="Page"
              placeholderTextColor={colors.text.disabled}
              style={[
                styles.pageInput,
                {
                  borderColor: colors.border.default,
                  borderRadius: borderRadius.md,
                  color: colors.text.primary,
                },
              ]}
            />
            <TextInput
              value={selectedText}
              onChangeText={setSelectedText}
              placeholder="Paste highlighted excerpt…"
              placeholderTextColor={colors.text.disabled}
              multiline
              style={[
                styles.textInput,
                {
                  borderColor: colors.border.default,
                  borderRadius: borderRadius.md,
                  color: colors.text.primary,
                  flex: 1,
                },
              ]}
            />
          </View>
          <Pressable
            onPress={goCreateNote}
            disabled={!selectedText.trim()}
            style={[
              styles.createBtn,
              {
                backgroundColor: colors.primary.main,
                borderRadius: borderRadius.md,
                opacity: selectedText.trim() ? 1 : 0.5,
              },
            ]}
          >
            <Text
              style={[typography.button, { color: '#fff', textAlign: 'center' }]}
            >
              Continue to Note Form
            </Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  actionBtn: { paddingHorizontal: 16, paddingVertical: 12 },
  centered: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  createBtn: { paddingVertical: 14 },
  footer: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  noteToggle: { paddingHorizontal: 10, paddingVertical: 6 },
  pageInput: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: 64,
  },
  root: { flex: 1 },
  row: { flexDirection: 'row' },
  sheet: {
    borderTopWidth: 1,
    maxHeight: '42%',
  },
  textInput: {
    borderWidth: 1,
    maxHeight: 90,
    minHeight: 48,
    paddingHorizontal: 10,
    paddingVertical: 8,
    textAlignVertical: 'top',
  },
  toolbar: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 8,
  },
});
