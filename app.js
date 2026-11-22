'use strict';

// ---------- Translations ----------
const I18N = {
  ar: {
    appName: 'محول الصيغ',
    tagline: 'حوّل الصور والصوت والفيديو داخل جهازك',
    install: 'تثبيت التطبيق',
    dropTitle: 'اسحب الملفات هنا أو اضغط للاختيار',
    dropHint: 'صور، صوت، فيديو · ملفاتك لا تغادر جهازك',
    files: 'الملفات',
    clear: 'مسح الكل',
    imageSettings: 'إعدادات الصور',
    preset: 'إعداد جاهز',
    convertTo: 'تحويل إلى',
    maxSide: 'أقصى أبعاد',
    quality: 'الجودة',
    targetSize: 'حجم الملف الأقصى',
    square: 'قص مربع (1:1)',
    convert: 'تحويل',
    converting: 'جارٍ التحويل…',
    downloadZip: 'تنزيل الكل (ZIP)',
    download: 'تنزيل',
    avSoon: 'تحويل الصوت والفيديو قادم في التحديث القادم.',
    privacy: 'يعمل بالكامل داخل المتصفح، بدون خوادم وبدون رفع ملفات.',
    offlineReady: 'جاهز للعمل بدون إنترنت',
    iosTip: 'للتثبيت على iPhone: اضغط زر المشاركة ثم «إضافة إلى الشاشة الرئيسية»',
    image: 'صورة', audio: 'صوت', video: 'فيديو',
    remove: 'إزالة',
    unsupported: 'بعض الملفات غير مدعومة وتم تجاهلها',
    otherLang: 'English',
    original: 'الحجم الأصلي',
    noLimit: 'بدون حد',
    waiting: 'بانتظار',
    failed: 'تعذّر تحويل هذا الملف',
    heicFailed: 'تعذّر فتح صورة HEIC',
    noAvif: 'متصفحك لا يدعم الحفظ بصيغة AVIF. جرّب Chrome على الكمبيوتر أو اختر WebP.',
    pngNoQuality: 'PNG بدون فقدان جودة، لذلك يتم تجاهل شريط الجودة.',
    done: (n, before, after) => `تم تحويل ${n} ملف · ${before} ← ${after}`,
    presets: {
      custom: 'مخصص',
      chat: 'للمحادثات (واتساب/تيليجرام)',
      instagram: 'إنستغرام مربع',
      email: 'للبريد الإلكتروني (أقل من 500 KB)',
      web: 'للمواقع (WebP)',
      smallest: 'أصغر حجم ممكن',
      lossless: 'بدون فقدان جودة (PNG)',
    },
  },
  en: {
    appName: 'Format Factory',
    tagline: 'Convert images, audio and video on your device',
    install: 'Install app',
    dropTitle: 'Drop files here or tap to choose',
    dropHint: 'Images, audio, video · your files never leave your device',
    files: 'Files',
    clear: 'Clear all',
    imageSettings: 'Image settings',
    preset: 'Preset',
    convertTo: 'Convert to',
    maxSide: 'Max dimensions',
    quality: 'Quality',
    targetSize: 'Max file size',
    square: 'Square crop (1:1)',
    convert: 'Convert',
    converting: 'Converting…',
    downloadZip: 'Download all (ZIP)',
    download: 'Download',
    avSoon: 'Audio and video conversion arrives in the next update.',
    privacy: 'Runs fully in your browser. No servers, no uploads.',
    offlineReady: 'Ready to work offline',
    iosTip: 'To install on iPhone: tap Share, then “Add to Home Screen”',
    image: 'Image', audio: 'Audio', video: 'Video',
    remove: 'Remove',
    unsupported: 'Some files are not supported and were skipped',
    otherLang: 'العربية',
    original: 'Original size',
    noLimit: 'No limit',
    waiting: 'Waiting',
    failed: 'Could not convert this file',
    heicFailed: 'Could not open this HEIC photo',
    noAvif: 'This browser can’t save AVIF. Try Chrome on a computer, or pick WebP.',
    pngNoQuality: 'PNG is lossless, so the quality slider is ignored.',
    done: (n, before, after) => `Converted ${n} file(s) · ${before} → ${after}`,
    presets: {
      custom: 'Custom',
      chat: 'For chats (WhatsApp/Telegram)',
      instagram: 'Instagram square',
      email: 'For email (under 500 KB)',
      web: 'For websites (WebP)',
      smallest: 'Smallest possible',
      lossless: 'Lossless (PNG)',
    },
  },
};

const PRESETS = {
  custom: null,
  chat: { format: 'JPG', maxSide: 1600, quality: 80, target: 0, square: false },
  instagram: { format: 'JPG', maxSide: 1080, quality: 85, target: 0, square: true },
  email: { format: 'JPG', maxSide: 1280, quality: 75, target: 500 * 1024, square: false },
  web: { format: 'WEBP', maxSide: 1920, quality: 80, target: 0, square: false },
  smallest: { format: 'WEBP', maxSide: 1280, quality: 60, target: 200 * 1024, square: false },
  lossless: { format: 'PNG', maxSide: 0, quality: 100, target: 0, square: false },
};
const SIZES = [0, 4000, 2560, 1920, 1600, 1280, 1080, 800, 512];
const TARGETS = [0, 2048, 1024, 500, 200, 100].map((kb) => kb * 1024);
const ICONS = { image: '🖼️', audio: '🎵', video: '🎬' };

// ---------- Storage helpers (may be blocked in private mode) ----------
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* ignore */ } },
};

// ---------- State ----------
let lang = store.get('lang') || ((navigator.language || 'ar').toLowerCase().startsWith('ar') ? 'ar' : 'en');
let files = []; // { id, file, kind, thumb, status, result, error }
let nextId = 1;
let busy = false;
let encoders = { JPG: true, PNG: true, WEBP: true, AVIF: false };

const $ = (id) => document.getElementById(id);
const t = (key) => (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key;

// ---------- Settings ----------
function loadSettings() {
  try { return Object.assign({ preset: 'custom', format: 'JPG', maxSide: 0, quality: 80, target: 0, square: false }, JSON.parse(store.get('imgSettings') || '{}')); } catch { return { preset: 'custom', format: 'JPG', maxSide: 0, quality: 80, target: 0, square: false }; }
}
let settings = loadSettings();
function saveSettings() { store.set('imgSettings', JSON.stringify(settings)); }

function fillSelect(sel, items) {
  const prev = sel.value;
  sel.replaceChildren(...items.map(([value, label, disabled]) => {
    const o = new Option(label, String(value));
    if (disabled) o.disabled = true;
    return o;
  }));
  if (prev) sel.value = prev;
}

function renderSettings() {
  fillSelect($('presetSelect'), Object.keys(PRESETS).map((k) => [k, t('presets')[k]]));
  fillSelect($('formatSelect'), FFImage.FORMATS.map((f) => [f, f + (encoders[f] ? '' : ' ✕'), false]));
  fillSelect($('sizeSelect'), SIZES.map((s) => [s, s ? ltr(`${s} px`) : t('original')]));
  fillSelect($('targetSelect'), TARGETS.map((b) => [b, b ? ltr(formatSize(b)) : t('noLimit')]));

  $('presetSelect').value = settings.preset;
  $('formatSelect').value = settings.format;
  $('sizeSelect').value = String(settings.maxSide);
  $('targetSelect').value = String(settings.target);
  $('quality').value = settings.quality;
  $('qualityOut').textContent = settings.quality;
  $('squareCrop').checked = settings.square;

  const lossy = FFImage.LOSSY.has(settings.format);
  $('quality').disabled = !lossy;
  $('qualityField').classList.toggle('muted', !lossy);
  const note = !encoders[settings.format] ? t('noAvif') : (!lossy ? t('pngNoQuality') : '');
  $('formatNote').textContent = note;
  $('formatNote').hidden = !note;
  updateConvertBtn();
}

function onSettingChange(patch) {
  Object.assign(settings, patch, { preset: 'custom' });
  saveSettings();
  renderSettings();
  markStale();
}

$('presetSelect').addEventListener('change', (e) => {
  const p = PRESETS[e.target.value];
  settings.preset = e.target.value;
  if (p) {
    Object.assign(settings, p);
    if (settings.format === 'AVIF' && !encoders.AVIF) settings.format = 'WEBP';
  }
  saveSettings(); renderSettings(); markStale();
});
$('formatSelect').addEventListener('change', (e) => onSettingChange({ format: e.target.value }));
$('sizeSelect').addEventListener('change', (e) => onSettingChange({ maxSide: Number(e.target.value) }));
$('targetSelect').addEventListener('change', (e) => onSettingChange({ target: Number(e.target.value) }));
$('quality').addEventListener('input', (e) => { $('qualityOut').textContent = e.target.value; });
$('quality').addEventListener('change', (e) => onSettingChange({ quality: Number(e.target.value) }));
$('squareCrop').addEventListener('change', (e) => onSettingChange({ square: e.target.checked }));

// ---------- Language ----------
function applyLang() {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.title = lang === 'ar' ? 'محول الصيغ · Format Factory' : 'Format Factory';
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  $('langBtn').textContent = t('otherLang');
  if (busy) $('convertBtn').textContent = t('converting');
  renderSettings();
  render();
}
$('langBtn').addEventListener('click', () => {
  lang = lang === 'ar' ? 'en' : 'ar';
  store.set('lang', lang);
  applyLang();
});

// ---------- Files ----------
function kindOf(file) {
  const type = file.type || '';
  if (type.startsWith('image/')) return 'image';
  if (type.startsWith('audio/')) return 'audio';
  if (type.startsWith('video/')) return 'video';
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  if (['heic', 'heif', 'bmp', 'tif', 'tiff', 'ico', 'svg', 'avif', 'webp', 'jpg', 'jpeg', 'png', 'gif'].includes(ext)) return 'image';
  if (['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac', 'opus', 'wma', 'amr'].includes(ext)) return 'audio';
  if (['mp4', 'mkv', 'mov', 'avi', 'webm', 'wmv', 'flv', '3gp', 'm4v'].includes(ext)) return 'video';
  return null;
}

function formatSize(bytes) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0; let n = bytes;
  while (n >= 1024 && i < units.length - 1) { n /= 1024; i++; }
  return `${n.toFixed(n < 10 && i ? 1 : 0)} ${units[i]}`;
}
const ltr = (s) => `⁦${s}⁩`;

function revokeResult(f) {
  if (f.result && f.result.url) URL.revokeObjectURL(f.result.url);
  f.result = null;
}

function addFiles(list) {
  let skipped = 0;
  for (const file of list) {
    const kind = kindOf(file);
    if (!kind) { skipped++; continue; }
    const thumb = kind === 'image' && !FFImage.isHeic(file) ? URL.createObjectURL(file) : null;
    files.push({ id: nextId++, file, kind, thumb, status: 'idle', result: null, error: null });
  }
  render();
  if (skipped) toast(t('unsupported'));
}

function removeFile(id) {
  const f = files.find((x) => x.id === id);
  if (f) { if (f.thumb) URL.revokeObjectURL(f.thumb); revokeResult(f); }
  files = files.filter((x) => x.id !== id);
  render();
}

function clearFiles() {
  files.forEach((f) => { if (f.thumb) URL.revokeObjectURL(f.thumb); revokeResult(f); });
  files = [];
  render();
}

// Settings changed after converting: old results no longer match.
function markStale() {
  if (busy) return;
  let changed = false;
  files.forEach((f) => { if (f.result || f.error) { revokeResult(f); f.error = null; f.status = 'idle'; changed = true; } });
  if (changed) render();
}

function render() {
  $('panel').hidden = files.length === 0;
  $('count').textContent = files.length;
  const hasImages = files.some((f) => f.kind === 'image');
  $('imgOptions').hidden = !hasImages;
  $('avNote').hidden = !files.some((f) => f.kind !== 'image');

  const ul = $('fileList');
  ul.replaceChildren();
  for (const f of files) {
    const li = document.createElement('li');
    li.className = 'file';

    let thumb;
    if (f.thumb || (f.result && f.result.url)) {
      thumb = document.createElement('img');
      thumb.src = (f.result && f.result.url) || f.thumb;
      thumb.alt = '';
    } else {
      thumb = document.createElement('div');
      thumb.textContent = ICONS[f.kind];
    }
    thumb.className = 'thumb';

    const meta = document.createElement('div');
    meta.className = 'meta';
    const name = document.createElement('p');
    name.className = 'name';
    name.textContent = f.file.name;
    name.title = f.file.name;
    const sub = document.createElement('p');
    sub.className = 'sub';
    sub.textContent = `${t(f.kind)} · ${ltr(formatSize(f.file.size))}`;
    meta.append(name, sub);

    if (f.status === 'working') {
      const s = document.createElement('p');
      s.className = 'sub working';
      s.textContent = t('converting');
      meta.append(s);
    } else if (f.error) {
      const s = document.createElement('p');
      s.className = 'sub err';
      s.textContent = f.error;
      meta.append(s);
    } else if (f.result) {
      const r = f.result;
      const pct = Math.round((1 - r.blob.size / f.file.size) * 100);
      const s = document.createElement('p');
      s.className = 'sub result';
      const change = pct >= 0 ? `−${pct}%` : `+${-pct}%`;
      s.textContent = `${lang === 'ar' ? '←' : '→'} ${ltr(`${r.name} · ${formatSize(r.blob.size)} (${change})`)}`;
      const dims = document.createElement('p');
      dims.className = 'sub';
      dims.textContent = ltr(`${r.width}×${r.height}`);
      meta.append(s, dims);
    }

    li.append(thumb, meta);

    if (f.result) {
      const a = document.createElement('a');
      a.className = 'btn btn-small';
      a.href = f.result.url;
      a.download = f.result.name;
      a.textContent = t('download');
      li.append(a);
    }

    const rm = document.createElement('button');
    rm.className = 'btn btn-link remove';
    rm.textContent = '✕';
    rm.disabled = busy;
    rm.setAttribute('aria-label', `${t('remove')} ${f.file.name}`);
    rm.addEventListener('click', () => removeFile(f.id));
    li.append(rm);

    ul.append(li);
  }

  const done = files.filter((f) => f.result);
  $('zipBtn').hidden = done.length < 2;
  if (done.length) {
    const before = done.reduce((s, f) => s + f.file.size, 0);
    const after = done.reduce((s, f) => s + f.result.blob.size, 0);
    $('summary').textContent = t('done')(done.length, ltr(formatSize(before)), ltr(formatSize(after)));
    $('summary').hidden = false;
  } else {
    $('summary').hidden = true;
  }
  updateConvertBtn();
}

function updateConvertBtn() {
  const btn = $('convertBtn');
  btn.disabled = busy || !files.some((f) => f.kind === 'image') || !encoders[settings.format];
}

// ---------- Convert ----------
async function convertAll() {
  if (busy) return;
  busy = true;
  $('convertBtn').textContent = t('converting');
  const opts = {
    format: settings.format,
    quality: settings.quality / 100,
    maxSide: settings.maxSide,
    targetBytes: settings.target,
    square: settings.square,
  };
  const todo = files.filter((f) => f.kind === 'image');
  todo.forEach((f) => { revokeResult(f); f.error = null; f.status = 'waiting'; });
  render();

  for (const f of todo) {
    if (!files.includes(f)) continue;
    f.status = 'working';
    render();
    try {
      const r = await FFImage.convert(f.file, opts);
      r.url = URL.createObjectURL(r.blob);
      f.result = r;
    } catch (err) {
      console.error(err);
      f.error = FFImage.isHeic(f.file) ? t('heicFailed') : t('failed');
    }
    f.status = 'idle';
    render();
    await new Promise((res) => setTimeout(res, 0)); // let the UI breathe
  }

  busy = false;
  $('convertBtn').textContent = t('convert');
  render();
}
$('convertBtn').addEventListener('click', convertAll);

$('zipBtn').addEventListener('click', async () => {
  const done = files.filter((f) => f.result);
  if (!done.length) return;
  $('zipBtn').disabled = true;
  try {
    const zip = await FFZip.makeZip(done.map((f) => ({ name: f.result.name, blob: f.result.blob })));
    const url = URL.createObjectURL(zip);
    const a = document.createElement('a');
    a.href = url;
    a.download = `format-factory-${new Date().toISOString().slice(0, 10)}.zip`;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  } finally {
    $('zipBtn').disabled = false;
  }
});

// ---------- Drop zone ----------
const drop = $('dropZone');
const input = $('fileInput');
drop.addEventListener('click', () => input.click());
drop.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); }
});
input.addEventListener('change', () => { addFiles(input.files); input.value = ''; });
['dragenter', 'dragover'].forEach((ev) => drop.addEventListener(ev, (e) => {
  e.preventDefault(); drop.classList.add('over');
}));
['dragleave', 'drop'].forEach((ev) => drop.addEventListener(ev, (e) => {
  e.preventDefault(); drop.classList.remove('over');
}));
drop.addEventListener('drop', (e) => addFiles(e.dataTransfer.files));
// Stop the browser opening files dropped outside the zone.
window.addEventListener('dragover', (e) => e.preventDefault());
window.addEventListener('drop', (e) => e.preventDefault());
$('clearBtn').addEventListener('click', () => { if (!busy) clearFiles(); });

// ---------- Small toast ----------
function toast(msg) {
  const el = document.createElement('div');
  el.className = 'ios-tip';
  el.setAttribute('role', 'status');
  el.textContent = msg;
  document.body.append(el);
  setTimeout(() => el.remove(), 3500);
}

// ---------- Install (PWA) ----------
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  $('installBtn').hidden = false;
});
$('installBtn').addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  $('installBtn').hidden = true;
});
window.addEventListener('appinstalled', () => { $('installBtn').hidden = true; });

// iPhone/iPad Safari has no install prompt: show a one-time tip instead.
const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const isStandalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;
if (isIOS && !isStandalone && !store.get('iosTipSeen')) $('iosTip').hidden = false;
$('iosTipClose').addEventListener('click', () => {
  $('iosTip').hidden = true;
  store.set('iosTipSeen', '1');
});

// ---------- Service worker (offline) ----------
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').then(() => navigator.serviceWorker.ready)
      .then(() => { $('offlineNote').hidden = false; })
      .catch(() => { /* offline support unavailable */ });
  });
}

applyLang();
FFImage.detectEncoders().then((enc) => {
  encoders = enc;
  if (!encoders[settings.format]) settings.format = 'WEBP';
  renderSettings();
});
