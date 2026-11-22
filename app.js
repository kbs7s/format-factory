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
    convertTo: 'تحويل إلى',
    convert: 'تحويل',
    soon: 'التحويل قادم في التحديث القادم. هذه نسخة الواجهة فقط.',
    privacy: 'يعمل بالكامل داخل المتصفح، بدون خوادم وبدون رفع ملفات.',
    offlineReady: 'جاهز للعمل بدون إنترنت',
    iosTip: 'للتثبيت على iPhone: اضغط زر المشاركة ثم «إضافة إلى الشاشة الرئيسية»',
    image: 'صورة', audio: 'صوت', video: 'فيديو', other: 'غير مدعوم',
    remove: 'إزالة',
    groupImage: 'صور', groupAudio: 'صوت', groupVideo: 'فيديو',
    mixed: 'اختر ملفات من نوع واحد',
    unsupported: 'بعض الملفات غير مدعومة وتم تجاهلها',
    otherLang: 'English',
  },
  en: {
    appName: 'Format Factory',
    tagline: 'Convert images, audio and video on your device',
    install: 'Install app',
    dropTitle: 'Drop files here or tap to choose',
    dropHint: 'Images, audio, video · your files never leave your device',
    files: 'Files',
    clear: 'Clear all',
    convertTo: 'Convert to',
    convert: 'Convert',
    soon: 'Conversion arrives in the next update. This is the interface preview.',
    privacy: 'Runs fully in your browser. No servers, no uploads.',
    offlineReady: 'Ready to work offline',
    iosTip: 'To install on iPhone: tap Share, then “Add to Home Screen”',
    image: 'Image', audio: 'Audio', video: 'Video', other: 'Unsupported',
    remove: 'Remove',
    groupImage: 'Images', groupAudio: 'Audio', groupVideo: 'Video',
    mixed: 'Pick files of one type',
    unsupported: 'Some files are not supported and were skipped',
    otherLang: 'العربية',
  },
};

// Output formats per media kind (wired up in steps 2 and 3).
const FORMATS = {
  image: ['JPG', 'PNG', 'WEBP', 'AVIF'],
  audio: ['MP3', 'WAV', 'OGG', 'M4A', 'FLAC'],
  video: ['MP4', 'WEBM', 'MOV', 'GIF', 'MP3'],
};
const ICONS = { image: '🖼️', audio: '🎵', video: '🎬' };

// ---------- Storage helpers (may be blocked in private mode) ----------
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* ignore */ } },
};

// ---------- State ----------
let lang = store.get('lang') || ((navigator.language || 'ar').toLowerCase().startsWith('ar') ? 'ar' : 'en');
let files = []; // { id, file, kind, url }
let nextId = 1;

const $ = (id) => document.getElementById(id);
const t = (key) => (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key;

// ---------- Language ----------
function applyLang() {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.title = lang === 'ar' ? 'محول الصيغ · Format Factory' : 'Format Factory';
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  $('langBtn').textContent = t('otherLang');
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
  if (['heic', 'heif', 'bmp', 'tif', 'tiff', 'ico', 'svg'].includes(ext)) return 'image';
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

function addFiles(list) {
  let skipped = 0;
  for (const file of list) {
    const kind = kindOf(file);
    if (!kind) { skipped++; continue; }
    const url = kind === 'image' ? URL.createObjectURL(file) : null;
    files.push({ id: nextId++, file, kind, url });
  }
  render();
  if (skipped) toast(t('unsupported'));
}

function removeFile(id) {
  const f = files.find((x) => x.id === id);
  if (f && f.url) URL.revokeObjectURL(f.url);
  files = files.filter((x) => x.id !== id);
  render();
}

function clearFiles() {
  files.forEach((f) => f.url && URL.revokeObjectURL(f.url));
  files = [];
  render();
}

function render() {
  $('panel').hidden = files.length === 0;
  $('count').textContent = files.length;

  const ul = $('fileList');
  ul.replaceChildren();
  for (const f of files) {
    const li = document.createElement('li');
    li.className = 'file';

    let thumb;
    if (f.url) {
      thumb = document.createElement('img');
      thumb.src = f.url;
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
    sub.textContent = `${t(f.kind)} · \u2066${formatSize(f.file.size)}\u2069`;
    meta.append(name, sub);

    const rm = document.createElement('button');
    rm.className = 'btn btn-link remove';
    rm.textContent = '✕';
    rm.setAttribute('aria-label', `${t('remove')} ${f.file.name}`);
    rm.addEventListener('click', () => removeFile(f.id));

    li.append(thumb, meta, rm);
    ul.append(li);
  }
  renderFormats();
}

function renderFormats() {
  const sel = $('formatSelect');
  const prev = sel.value;
  sel.replaceChildren();
  const kinds = [...new Set(files.map((f) => f.kind))];
  const groups = { image: 'groupImage', audio: 'groupAudio', video: 'groupVideo' };
  if (kinds.length > 1) {
    const opt = new Option(t('mixed'), '');
    opt.disabled = true;
    sel.append(opt);
  }
  for (const kind of kinds) {
    const og = document.createElement('optgroup');
    og.label = t(groups[kind]);
    FORMATS[kind].forEach((fmt) => og.append(new Option(fmt, `${kind}:${fmt}`)));
    sel.append(og);
  }
  if ([...sel.options].some((o) => o.value === prev)) sel.value = prev;
  // Convert stays disabled until steps 2 and 3 add the engines.
  $('convertBtn').disabled = true;
}

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
$('clearBtn').addEventListener('click', clearFiles);

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
