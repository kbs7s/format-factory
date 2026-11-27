// Bump VERSION whenever app files change so phones pick up the update.
const VERSION = 'ff-v5';
// Big libraries (video engine ~31 MB, HEIC decoder) live in their own cache,
// so an app update doesn't download them again. Bump only when lib/ changes,
// and keep it equal to LIB_CACHE in js/storage.js.
const LIB_CACHE = 'ff-lib-ffmpeg0.12.10-heic0.0.4';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './js/zip.js',
  './js/image.js',
  './js/media.js',
  './js/storage.js',
  './fonts/fonts.css',
  './fonts/cairo-arabic-wght-normal.woff2',
  './fonts/cairo-latin-wght-normal.woff2',
  './fonts/inter-latin-wght-normal.woff2',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png',
];

// Small enough to keep ready for offline iPhone (HEIC) photos from the start.
// The 31 MB video engine is cached on first use or via "Download for offline".
const LIB_PRECACHE = ['./lib/heic2any.min.js'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION).then((c) => c.addAll(ASSETS))
      .then(() => caches.open(LIB_CACHE).then((c) => c.addAll(LIB_PRECACHE)).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION && k !== LIB_CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;

  // Network first for pages (fresh updates).
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => { const copy = res.clone(); caches.open(VERSION).then((c) => c.put('./index.html', copy)); return res; })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Cache first for everything else; libraries are cached the first time they're used.
  const cacheName = url.pathname.includes('/lib/') ? LIB_CACHE : VERSION;
  event.respondWith(
    caches.open(cacheName).then((cache) => cache.match(req).then((hit) => hit || fetch(req).then((res) => {
      if (res.ok) cache.put(req, res.clone());
      return res;
    })))
  );
});
