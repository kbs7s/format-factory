'use strict';
// On-device storage: converted files in IndexedDB, and offline download of
// the big libraries into the Cache Storage the service worker reads from.
(function () {
  // ---------- Saved files (IndexedDB) ----------
  const DB_NAME = 'format-factory';
  const STORE = 'files';
  let dbPromise = null;

  function openDb() {
    if (!dbPromise) {
      dbPromise = new Promise((resolve, reject) => {
        if (!('indexedDB' in window)) { reject(new Error('no-idb')); return; }
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains(STORE)) {
            const os = db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
            os.createIndex('date', 'date');
          }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => { dbPromise = null; reject(req.error || new Error('idb-open')); };
      });
    }
    return dbPromise;
  }

  async function tx(mode, fn) {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const t = db.transaction(STORE, mode);
      const os = t.objectStore(STORE);
      let result;
      const req = fn(os);
      if (req) req.onsuccess = () => { result = req.result; };
      t.oncomplete = () => resolve(result);
      t.onerror = () => reject(t.error || new Error('idb'));
      t.onabort = () => reject(t.error || new Error('idb-abort'));
    });
  }

  /** rec: { name, origName, kind, format, size, origSize, width, height, blob } */
  function saveFile(rec) {
    return tx('readwrite', (os) => os.add(Object.assign({ date: Date.now() }, rec)));
  }
  async function listFiles() {
    const all = (await tx('readonly', (os) => os.getAll())) || [];
    return all.sort((a, b) => b.date - a.date);
  }
  function getFile(id) { return tx('readonly', (os) => os.get(id)); }
  function deleteFile(id) { return tx('readwrite', (os) => os.delete(id)); }
  function clearFiles() { return tx('readwrite', (os) => os.clear()); }

  async function estimate() {
    try {
      if (navigator.storage && navigator.storage.estimate) return await navigator.storage.estimate();
    } catch { /* unsupported */ }
    return null;
  }

  // Asks the browser not to clear our data when space runs low.
  async function persist() {
    try {
      if (!navigator.storage || !navigator.storage.persist) return null;
      if (await navigator.storage.persisted()) return true;
      return await navigator.storage.persist();
    } catch { return null; }
  }

  // ---------- Offline libraries (Cache Storage) ----------
  // Must match LIB_CACHE in sw.js.
  const LIB_CACHE = 'ff-lib-ffmpeg0.12.10-heic0.0.4';
  const ENGINE_FILES = [
    { path: 'lib/ffmpeg/ffmpeg.js', size: 4400 },
    { path: 'lib/ffmpeg/814.ffmpeg.js', size: 3200 },
    { path: 'lib/ffmpeg/ffmpeg-core.js', size: 112059 },
    { path: 'lib/ffmpeg/ffmpeg-core.wasm', size: 32232419 },
  ];
  const ENGINE_TOTAL = ENGINE_FILES.reduce((s, f) => s + f.size, 0);
  const abs = (p) => new URL(p, location.href).href;

  async function engineCached() {
    if (!('caches' in window)) return false;
    try {
      for (const f of ENGINE_FILES) { if (!(await caches.match(abs(f.path)))) return false; }
      return true;
    } catch { return false; }
  }

  // Downloads the video engine into the cache. onProgress(bytesDone, bytesTotal)
  async function downloadEngine(onProgress) {
    if (!('caches' in window)) throw new Error('no-cache');
    const cache = await caches.open(LIB_CACHE);
    let before = 0;
    for (const f of ENGINE_FILES) {
      const url = abs(f.path);
      if (await cache.match(url)) { before += f.size; onProgress && onProgress(before, ENGINE_TOTAL); continue; }
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok || !res.body) throw new Error('engine-download');
      const reader = res.body.getReader();
      const chunks = []; let got = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value); got += value.length;
        onProgress && onProgress(Math.min(before + got, ENGINE_TOTAL), ENGINE_TOTAL);
      }
      const type = res.headers.get('content-type') || (url.endsWith('.wasm') ? 'application/wasm' : 'text/javascript');
      await cache.put(url, new Response(new Blob(chunks, { type }), { headers: { 'content-type': type } }));
      before += f.size;
    }
    onProgress && onProgress(ENGINE_TOTAL, ENGINE_TOTAL);
  }

  async function shellCached() {
    if (!('caches' in window)) return false;
    try { return !!(await caches.match(abs('index.html'))); } catch { return false; }
  }

  window.FFStore = { saveFile, listFiles, getFile, deleteFile, clearFiles, estimate, persist, engineCached, downloadEngine, shellCached, ENGINE_TOTAL };
})();
