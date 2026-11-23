'use strict';
// Image conversion with the browser decoder and <canvas> encoder, plus crop/rotate/flip.
(function () {
  const MIME = { JPG: 'image/jpeg', PNG: 'image/png', WEBP: 'image/webp', AVIF: 'image/avif' };
  const EXT = { JPG: 'jpg', PNG: 'png', WEBP: 'webp', AVIF: 'avif' };
  const LOSSY = new Set(['JPG', 'WEBP', 'AVIF']);
  const MAX_PIXELS = 16000000;

  function toBlob(canvas, type, quality) {
    return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
  }

  let encodersPromise = null;
  function detectEncoders() {
    if (!encodersPromise) {
      encodersPromise = (async () => {
        const c = document.createElement('canvas');
        c.width = 2; c.height = 2;
        c.getContext('2d').fillRect(0, 0, 2, 2);
        const out = {};
        for (const [fmt, mime] of Object.entries(MIME)) {
          try {
            const b = await toBlob(c, mime, 0.8);
            out[fmt] = !!b && b.type === mime;
          } catch {
            out[fmt] = false;
          }
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
      img.onload = () => resolve({
        source: img,
        width: img.naturalWidth,
        height: img.naturalHeight,
        close() { URL.revokeObjectURL(url); },
      });
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('decode')); };
      img.src = url;
    });
  }

  async function decodeBlob(blob) {
    if (window.createImageBitmap) {
      try {
        const bmp = await createImageBitmap(blob, { imageOrientation: 'from-image' });
        return { source: bmp, width: bmp.width, height: bmp.height, close() { bmp.close(); } };
      } catch { /* fallback */ }
    }
    return decodeWithImg(blob);
  }

  async function decode(file) {
    try {
      return await decodeBlob(file);
    } catch (err) {
      if (!isHeic(file)) throw err;
      const heic2any = await loadHeicLib();
      let png = await heic2any({ blob: file, toType: 'image/png' });
      if (Array.isArray(png)) png = png[0];
      return decodeBlob(png);
    }
  }

  function applyOrientation(img, rotate, flipH, flipV) {
    const deg = ((rotate || 0) % 360 + 360) % 360;
    if (!deg && !flipH && !flipV) return { source: img.source, width: img.width, height: img.height };
    const swap = deg === 90 || deg === 270;
    const w = swap ? img.height : img.width;
    const h = swap ? img.width : img.height;
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d');
    ctx.translate(w / 2, h / 2);
    ctx.rotate((deg * Math.PI) / 180);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.drawImage(img.source, -img.width / 2, -img.height / 2);
    return { source: c, width: w, height: h };
  }

  function computeCrop(w, h, cropMode) {
    if (!cropMode || cropMode === 'none') return { x: 0, y: 0, w, h };
    let ratio = 1;
    if (cropMode === '16:9') ratio = 16 / 9;
    else if (cropMode === '4:5') ratio = 4 / 5;
    let cw = w;
    let ch = Math.round(w / ratio);
    if (ch > h) {
      ch = h;
      cw = Math.round(h * ratio);
    }
    return {
      x: Math.round((w - cw) / 2),
      y: Math.round((h - ch) / 2),
      w: Math.max(1, cw),
      h: Math.max(1, ch),
    };
  }

  function renderCanvas(oriented, crop, scale, fillBg) {
    const w = Math.max(1, Math.round(crop.w * scale));
    const h = Math.max(1, Math.round(crop.h * scale));
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (fillBg) {
      ctx.fillStyle = fillBg;
      ctx.fillRect(0, 0, w, h);
    }
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(oriented.source, crop.x, crop.y, crop.w, crop.h, 0, 0, w, h);
    return canvas;
  }

  async function convert(file, opts) {
    const img = await decode(file);
    try {
      const mime = MIME[opts.format];
      const lossy = LOSSY.has(opts.format);
      const oriented = applyOrientation(img, opts.rotate, opts.flipH, opts.flipV);
      const cropMode = opts.cropMode || (opts.square ? '1:1' : 'none');
      const crop = computeCrop(oriented.width, oriented.height, cropMode);

      let scale = 1;
      if (opts.maxSide) scale = Math.min(1, opts.maxSide / Math.max(crop.w, crop.h));
      const pixels = crop.w * crop.h * scale * scale;
      if (pixels > MAX_PIXELS) scale *= Math.sqrt(MAX_PIXELS / pixels);

      const fillBg = opts.format === 'JPG' ? (opts.bgColor || '#ffffff') : null;
      let canvas = renderCanvas(oriented, crop, scale, fillBg);
      let blob = await toBlob(canvas, mime, lossy ? opts.quality : undefined);
      if (!blob) throw new Error('encode');

      if (opts.targetBytes && blob.size > opts.targetBytes) {
        for (let round = 0; round < 8 && blob.size > opts.targetBytes; round++) {
          if (lossy) {
            let lo = 0.25;
            let hi = opts.quality;
            let best = null;
            for (let i = 0; i < 6; i++) {
              const q = (lo + hi) / 2;
              const b = await toBlob(canvas, mime, q);
              if (b && b.size <= opts.targetBytes) { best = b; lo = q; } else { hi = q; }
            }
            if (best) { blob = best; break; }
            const low = await toBlob(canvas, mime, 0.25);
            if (low && low.size < blob.size) blob = low;
            if (blob.size <= opts.targetBytes) break;
          }
          scale *= Math.max(0.5, Math.min(0.9, Math.sqrt(opts.targetBytes / blob.size)));
          canvas = renderCanvas(oriented, crop, scale, fillBg);
          blob = await toBlob(canvas, mime, lossy ? opts.quality : undefined);
        }
      }

      const base = (file.name.replace(/\.[^.]+$/, '') || 'image');
      const cleanSuffix = (opts.suffix || '').replace(/[\\/:*?"<>|]/g, '');
      return {
        blob,
        name: `${base}${cleanSuffix}.${EXT[opts.format]}`,
        width: canvas.width,
        height: canvas.height,
        origWidth: img.width,
        origHeight: img.height,
      };
    } finally {
      img.close();
    }
  }

  window.FFImage = { convert, detectEncoders, isHeic, LOSSY, FORMATS: Object.keys(MIME) };
})();

