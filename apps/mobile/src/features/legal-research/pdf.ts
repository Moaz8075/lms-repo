import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';

import { getEnv } from '@/config/env';

/**
 * Resolve library PDF URLs for the device.
 * Demo files are always fetched from the backend API (`/api/v1/demo/...`)
 * so they work whenever the API is reachable (no separate frontend server).
 */
export function resolveMediaUrl(url: string): string {
  if (!url) return url;

  let resolved = url;

  // Remap any /demo/<file>.pdf (incl. old :3001 frontend URLs) onto the API
  const demoMatch = resolved.match(/\/demo\/([^/?#]+\.pdf)/i);
  if (demoMatch) {
    resolved = `${getEnv().apiUrl}/demo/${demoMatch[1]}`;
  } else if (Platform.OS === 'android') {
    resolved = resolved.replace(
      /\/\/(localhost|127\.0\.0\.1)(?=[:/]|$)/,
      '//10.0.2.2',
    );
  }

  return resolved;
}

export function isPdfUrl(url: string): boolean {
  const clean = url.split('?')[0].split('#')[0].toLowerCase();
  return clean.endsWith('.pdf') || clean.includes('/demo/');
}

/** Lightweight PDF.js shell — base64 is injected after load to avoid huge HTML. */
export function buildPdfViewerShellHtml(title: string): string {
  const safeTitle = title
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=4" />
  <title>${safeTitle}</title>
  <style>
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; background: #525659; }
    #status {
      color: #fff;
      text-align: center;
      padding: 28px 16px;
      font: 14px -apple-system, BlinkMacSystemFont, sans-serif;
    }
    #viewer { padding: 8px 0 48px; }
    canvas.page {
      display: block;
      margin: 0 auto 10px;
      background: #fff;
      max-width: 100%;
      box-shadow: 0 2px 8px rgba(0,0,0,.35);
    }
  </style>
</head>
<body>
  <div id="status">Preparing viewer…</div>
  <div id="viewer"></div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
  <script>
    window.__renderPdfBase64 = function (b64) {
      var statusEl = document.getElementById('status');
      var viewer = document.getElementById('viewer');
      viewer.innerHTML = '';
      statusEl.textContent = 'Rendering PDF…';

      if (!window.pdfjsLib) {
        statusEl.textContent = 'PDF engine unavailable. Use Open with… below.';
        return;
      }

      try {
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      } catch (e) {}

      var raw = atob(b64);
      var bytes = new Uint8Array(raw.length);
      for (var i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);

      pdfjsLib.getDocument({ data: bytes, disableWorker: true }).promise
        .then(function (pdf) {
          statusEl.textContent = pdf.numPages + ' page' + (pdf.numPages === 1 ? '' : 's');
          var scale = Math.min(1.5, (window.innerWidth - 16) / 612);
          var chain = Promise.resolve();
          for (var n = 1; n <= pdf.numPages; n++) {
            (function (pageNum) {
              chain = chain.then(function () {
                return pdf.getPage(pageNum).then(function (page) {
                  var viewport = page.getViewport({ scale: scale });
                  var canvas = document.createElement('canvas');
                  canvas.className = 'page';
                  canvas.width = viewport.width;
                  canvas.height = viewport.height;
                  viewer.appendChild(canvas);
                  return page.render({
                    canvasContext: canvas.getContext('2d'),
                    viewport: viewport
                  }).promise;
                });
              });
            })(n);
          }
          return chain;
        })
        .catch(function (err) {
          statusEl.textContent = 'Could not render PDF. Use Open with… below.';
          console.error(err);
        });
    };

    window.__pdfReady = true;
  </script>
</body>
</html>`;
}

export async function downloadPdfToCache(
  url: string,
  fileName = 'legal-research.pdf',
): Promise<{ uri: string; base64: string }> {
  const resolved = resolveMediaUrl(url);
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const localUri = `${FileSystem.cacheDirectory}${safeName}`;

  const download = await FileSystem.downloadAsync(resolved, localUri);
  if (download.status < 200 || download.status >= 300) {
    throw new Error(`Download failed (HTTP ${download.status}) from ${resolved}`);
  }

  const base64 = await FileSystem.readAsStringAsync(download.uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  if (!base64) {
    throw new Error('Downloaded PDF was empty');
  }

  return { uri: download.uri, base64 };
}
