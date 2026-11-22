'use strict';
// Image conversion with the browser's own decoder and <canvas> encoder.
(function () {
  const MIME = { JPG: 'image/jpeg', PNG: 'image/png', WEBP: 'image/webp', AVIF: 'image/avif' };
  const EXT = { JPG: 'jpg', PNG: 'png', WEBP: 'webp', AVIF: 'avif' };
  const LOSSY = new Set(['JPG', 'WEBP', 'AVIF']);
  // Phones (iOS Safari especially) refuse canvases above ~16.7 million pixels.
  const MAX_PIXELS = 16000000;

  function toBlob(canvas, type, quality) {
    return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
  }

  // Which output formats this browser can actually encode.
  let encodersPromise = null;
  function detectEncoders() {
    if (!encodersPromise) {
      encodersPromise = (async () => {
        const c = document.createElement('canvas');
        c.width = 2; c.height = 2;
        c.getContext('2d').fillRect(0, 0, 2, 2);
        const out = {};
        for (const [fmt, mime] of Object.entries(MIME)) {
          try { const b = await toBlob(c, mime, 0.8); out[fmt] = !!b && b.type === mime; } catch { out[fmt] = false; }
        }
        return out;
      })();
    }
    return encodersPromise;
  }

  function isHeic(file) {
    return /hei[cf]$/i.test(file.type) || /\.(heic|heif)$/i.test(file.name);
  }

  let heicLib = null;
  function loadHeicLib() {
    if (!heicLib) {
      heicLib = new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'lib/heic2any.min.js';
        s.onload = () => resolve(window.heic2any);
        s.onerror = () => { heicLib = null; reject(new Error('heic-load')); };
        document.head.append(s);
      });
    }
    return heicLib;
  }

  function decodeWithImg(blob) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => { resolve({ source: img, width: img.naturalWidth, height: img.naturalHeight, close() { URL.revokeObjectURL(url); } }); };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('decode')); };
      img.src = url;
    });
  }

  async function decodeBlob(blob) {
    if (window.createImageBitmap) {
      try {
        const bmp = await createImageBitmap(blob, { imageOrientation: 'from-image' });
        return { source: bmp, width: bmp.width, height: bmp.height, close() { bmp.close(); } };
      } catch { /* fall back to <img> */ }
    }
    return decodeWithImg(blob);
  }

  async function decode(file) {
    try {
      return await decodeBlob(file);
    } catch (err) {
      if (!isHeic(file)) throw err;
      // Chrome/Android can't read iPhone HEIC photos natively: use heic2any.
      const heic2any = await loadHeicLib();
      let png = await heic2any({ blob: file, toType: 'image/png' });
      if (Array.isArray(png)) png = png[0];
      return decodeBlob(png);
    }
  }

  function render(img, crop, scale, fillWhite) {
    const w = Math.max(1, Math.round(crop.w * scale));
    const h = Math.max(1, Math.round(crop.h * scale));
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (fillWhite) { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h); }
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img.source, crop.x, crop.y, crop.w, crop.h, 0, 0, w, h);
    return canvas;
  }

  /**
   * opts: { format: 'JPG'|'PNG'|'WEBP'|'AVIF', quality: 0..1, maxSide: px|0,
   *         targetBytes: bytes|0, square: bool }
   * Re-encoding drops EXIF data (including GPS location) as a side effect.
   */
  async function convert(file, opts) {
    const img = await decode(file);
    try {
      const mime = MIME[opts.format];
      const lossy = LOSSY.has(opts.format);

      let crop = { x: 0, y: 0, w: img.width, h: img.height };
      if (opts.square) {
        const side = Math.min(img.width, img.height);
        crop = { x: Math.round((img.width - side) / 2), y: Math.round((img.height - side) / 2), w: side, h: side };
      }

      let scale = 1;
      if (opts.maxSide) scale = Math.min(1, opts.maxSide / Math.max(crop.w, crop.h));
      const pixels = crop.w * crop.h * scale * scale;
      if (pixels > MAX_PIXELS) scale *= Math.sqrt(MAX_PIXELS / pixels);

      const fillWhite = opts.format === 'JPG';
      let canvas = render(img, crop, scale, fillWhite);
      let blob = await toBlob(canvas, mime, lossy ? opts.quality : undefined);
      if (!blob) throw new Error('encode');

      // Shrink until it fits the size limit: first lower quality, then dimensions.
      if (opts.targetBytes && blob.size > opts.targetBytes) {
        for (let round = 0; round < 8 && blob.size > opts.targetBytes; round++) {
          if (lossy) {
            let lo = 0.3; let hi = opts.quality; let best = null;
            for (let i = 0; i < 6; i++) {
              const q = (lo + hi) / 2;
              const b = await toBlob(canvas, mime, q);
              if (b.size <= opts.targetBytes) { best = b; lo = q; } else { hi = q; }
            }
            if (best) { blob = best; break; }
            const low = await toBlob(canvas, mime, 0.3);
            if (low.size < blob.size) blob = low;
            if (blob.size <= opts.targetBytes) break;
          }
          scale *= Math.max(0.5, Math.min(0.9, Math.sqrt(opts.targetBytes / blob.size)));
          canvas = render(img, crop, scale, fillWhite);
          blob = await toBlob(canvas, mime, lossy ? opts.quality : undefined);
        }
      }

      const base = file.name.replace(/\.[^.]+$/, '') || 'image';
      return { blob, name: `${base}.${EXT[opts.format]}`, width: canvas.width, height: canvas.height };
    } finally {
      img.close();
    }
  }

  window.FFImage = { convert, detectEncoders, isHeic, LOSSY, FORMATS: Object.keys(MIME) };
})();
