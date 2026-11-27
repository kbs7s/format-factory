'use strict';
// ==================== App Controller ====================
const I18N = {
  ar: {
    appName: 'محول الصيغ',
    localBadge: 'محلي 100% · بدون رفع',
    tagline: 'استوديو تحويل الصور والفيديو والصوت داخل جهازك',
    dropTitle: 'اسحب الصور أو الفيديو أو الصوت هنا',
    dropHint: 'تحويل دفعي، لصق مباشر (Ctrl+V)، وصور iPhone HEIC',
    chooseFiles: 'اختيار ملفات',
    trySamples: 'جرّب صور تجريبية',
    statFiles: 'الملفات',
    statBefore: 'الحجم الأصلي',
    statAfter: 'بعد التحويل',
    statSaved: 'التوفير',
    queueTitle: 'قائمة الملفات',
    filterAll: 'الكل',
    filterPending: 'قيد الانتظار',
    filterDone: 'مكتمل',
    clear: 'مسح الكل',
    presetSection: 'إعدادات جاهزة',
    reset: 'إعادة ضبط',
    outputSection: 'صيغة الإخراج والجودة',
    quality: 'الجودة',
    jpgBg: 'خلفية الشفافية (JPG)',
    sizeSection: 'الأبعاد وحجم الملف',
    maxSide: 'أقصى أبعاد (الضلع الأطول)',
    targetSize: 'حجم الملف الأقصى',
    transformSection: 'القص والتدوير والتسمية',
    cropMode: 'نسبة القص',
    orientation: 'التدوير والقلب',
    fileSuffix: 'لاحقة اسم الملف (اختياري)',
    exifNote: 'يتم مسح بيانات EXIF وموقع GPS تلقائياً عند إعادة الترميز لحماية خصوصيتك.',
    convert: 'تحويل الصور',
    converting: 'جارٍ التحويل…',
    downloadZip: 'تنزيل الكل (ZIP)',
    download: 'تنزيل',
    compare: 'مقارنة',
    privacy: 'يعمل بالكامل داخل المتصفح، بدون خوادم وبدون رفع ملفات.',
    install: 'تثبيت التطبيق',
    deviceTitle: 'على هذا الجهاز',
    offImages: 'تحويل الصور',
    offVideo: 'الفيديو والصوت',
    offReady: 'يعمل بدون إنترنت',
    offNeedsNet: 'يحتاج إنترنت مرة واحدة',
    offUnsupported: 'متصفحك لا يدعم العمل بدون إنترنت',
    offDownload: 'تنزيل للعمل بدون إنترنت (31 MB)',
    offDownloading: (a, b) => `جارٍ التنزيل ${a} من ${b}`,
    offDone: 'أصبح الفيديو والصوت يعملان بدون إنترنت',
    offFailed: 'تعذّر التنزيل. تحقق من الإنترنت وحاول مجدداً.',
    savedTitle: 'الملفات المحفوظة',
    autoSave: 'حفظ النتائج تلقائياً',
    clearSaved: 'حذف الكل',
    clearSavedConfirm: 'اضغط مجدداً للتأكيد',
    savedEmpty: 'الملفات المحوّلة تُحفظ هنا على جهازك فقط، وتبقى بعد إغلاق التطبيق.',
    save: 'حفظ',
    saved: 'محفوظ',
    delete: 'حذف',
    savedToast: 'تم الحفظ على جهازك',
    storageFull: 'مساحة التخزين ممتلئة. احذف بعض الملفات المحفوظة.',
    storageFailed: 'تعذّر الحفظ على هذا الجهاز',
    storageUsed: (a, b) => `مستخدم ${a} من ${b}`,
    offlineReady: 'جاهز للعمل بدون إنترنت',
    iosTip: 'للتثبيت على iPhone: اضغط زر المشاركة ثم «إضافة إلى الشاشة الرئيسية»',
    avPresetSection: 'جاهز للفيديو والصوت',
    avOutputSection: 'صيغة الفيديو والصوت',
    groupVideo: 'فيديو',
    groupAudio: 'صوت',
    resolution: 'الدقة',
    videoQuality: 'جودة الفيديو',
    bitrate: 'جودة الصوت',
    trimSection: 'القص وكتم الصوت',
    trimStart: 'البداية (دقيقة:ثانية)',
    trimEnd: 'النهاية (اختياري)',
    mute: 'كتم الصوت',
    cancel: 'إلغاء',
    cancelled: 'تم الإلغاء',
    vq: { high: 'عالية', medium: 'متوسطة', small: 'حجم صغير' },
    engineLoading: (a, b) => `تحميل محرك الفيديو ${a} من ${b} (مرة واحدة فقط)`,
    engineFailed: 'تعذّر تحميل محرك الفيديو. تحقق من الإنترنت وحاول مجدداً.',
    gifNote: (n) => `GIF يأخذ أول ${n} ثانية فقط (أو المقطع الذي تحدده).`,
    audioOnlyNote: 'ملفات الصوت لا يمكن تحويلها إلى فيديو. اختر صيغة صوت.',
    slowNote: 'تحويل الفيديو على الهاتف بطيء. أبقِ الصفحة مفتوحة حتى ينتهي.',
    errTooBig: 'الملف كبير جداً للمتصفح (الحد 700 MB)',
    errTrim: 'وقت القص غير صحيح',
    errAudioToVideo: 'لا يمكن تحويل ملف صوت إلى فيديو',
    errNoStream: 'لا يوجد صوت أو صورة مناسبة في هذا الملف',
    avPresets: {
      whatsapp: { name: 'فيديو للواتساب', desc: 'MP4 · 720p' },
      smallvideo: { name: 'فيديو صغير', desc: 'MP4 · 480p' },
      extract: { name: 'استخراج الصوت', desc: 'MP3 · 192 kbps' },
      voice: { name: 'رسالة صوتية', desc: 'MP3 · 96 kbps' },
      gif: { name: 'صورة متحركة', desc: 'GIF · 480px' },
      hq: { name: 'صوت عالي الجودة', desc: 'MP3 · 320 kbps' },
    },
    image: 'صورة',
    audio: 'صوت',
    video: 'فيديو',
    remove: 'إزالة',
    unsupported: 'بعض الملفات غير مدعومة وتم تجاهلها',
    pasted: 'تمت إضافة صورة من الحافظة',
    samplesAdded: 'تمت إضافة 3 صور تجريبية جاهزة للتحويل',
    otherLang: 'English',
    original: 'الحجم الأصلي',
    noLimit: 'بدون حد',
    waiting: 'بانتظار',
    failed: 'تعذّر تحويل هذا الملف',
    heicFailed: 'تعذّر فتح صورة HEIC',
    noAvif: 'متصفحك لا يدعم حفظ AVIF حالياً. اختر WebP أو JPG.',
    pngNoQuality: 'PNG بدون فقدان جودة، لذلك يتم تجاهل شريط الجودة.',
    feat1Title: 'خصوصية تامة',
    feat1Desc: 'تُعالج الصور محلياً داخل المتصفح مع إزالة بيانات EXIF والموقع تلقائياً.',
    feat2Title: 'ضغط ذكي حسب الحجم',
    feat2Desc: 'حدّد حداً أقصى لحجم الملف (مثل 200KB أو 500KB) ليضبط الجودة والأبعاد تلقائياً.',
    feat3Title: 'مقارنة قبل وبعد + ZIP',
    feat3Desc: 'عاين الفرق بسلايدر تفاعلي قبل التنزيل، أو نزّل جميع الملفات دفعة واحدة بملف ZIP.',
    cropNone: 'أصلي',
    cmpOrig: 'الأصلي',
    cmpConv: 'المحول',
    cmpDiff: 'الفرق',
    tierLow: 'ضغط عالٍ',
    tierMed: 'متوازن',
    tierHigh: 'جودة عالية',
    tierMax: 'أقصى جودة',
    progressText: (cur, tot) => `تحويل ${cur} من ${tot}…`,
    convertCount: (n) => n ? `تحويل ${n} ملف` : 'تحويل',
    presets: {
      chat: { name: 'للمحادثات', desc: 'JPG · 1600px · 80%' },
      instagram: { name: 'إنستغرام 1:1', desc: 'JPG · 1080px مربع' },
      email: { name: 'للبريد الإلكتروني', desc: 'JPG · أقل من 500KB' },
      web: { name: 'للمواقع (WebP)', desc: 'WebP · 1920px · 80%' },
      smallest: { name: 'أصغر حجم', desc: 'WebP · أقل من 200KB' },
      lossless: { name: 'بدون فقدان', desc: 'PNG · الأبعاد الأصلية' },
    },
  },
  en: {
    appName: 'Format Factory',
    localBadge: '100% Local · No Uploads',
    tagline: 'Convert images, video and audio right in your browser',
    dropTitle: 'Drop images, video or audio here',
    dropHint: 'Batch convert, paste from clipboard (Ctrl+V), and iPhone HEIC supported',
    chooseFiles: 'Choose files',
    trySamples: 'Try sample images',
    statFiles: 'Files',
    statBefore: 'Input size',
    statAfter: 'Output size',
    statSaved: 'Space saved',
    queueTitle: 'File queue',
    filterAll: 'All',
    filterPending: 'Pending',
    filterDone: 'Done',
    clear: 'Clear all',
    presetSection: 'Quick presets',
    reset: 'Reset',
    outputSection: 'Output format & quality',
    quality: 'Quality',
    jpgBg: 'Transparency fill (JPG)',
    sizeSection: 'Dimensions & file size',
    maxSide: 'Max dimensions (longest side)',
    targetSize: 'Target max file size',
    transformSection: 'Crop, rotate & naming',
    cropMode: 'Aspect crop',
    orientation: 'Rotate & flip',
    fileSuffix: 'Filename suffix (optional)',
    exifNote: 'EXIF and GPS location metadata are automatically stripped during re-encoding.',
    convert: 'Convert images',
    converting: 'Converting…',
    downloadZip: 'Download all (ZIP)',
    download: 'Download',
    compare: 'Compare',
    privacy: 'Runs completely in your browser. No servers, no uploads.',
    install: 'Install app',
    deviceTitle: 'On this device',
    offImages: 'Image conversion',
    offVideo: 'Video & audio',
    offReady: 'Works offline',
    offNeedsNet: 'Needs internet once',
    offUnsupported: 'This browser can’t work offline',
    offDownload: 'Download for offline use (31 MB)',
    offDownloading: (a, b) => `Downloading ${a} of ${b}`,
    offDone: 'Video and audio now work offline',
    offFailed: 'Download failed. Check your connection and try again.',
    savedTitle: 'Saved files',
    autoSave: 'Save results automatically',
    clearSaved: 'Delete all',
    clearSavedConfirm: 'Tap again to confirm',
    savedEmpty: 'Converted files are kept here on your device only, even after you close the app.',
    save: 'Save',
    saved: 'Saved',
    delete: 'Delete',
    savedToast: 'Saved on your device',
    storageFull: 'Storage is full. Delete some saved files.',
    storageFailed: 'Could not save on this device',
    storageUsed: (a, b) => `${a} used of ${b}`,
    offlineReady: 'Ready to work offline',
    iosTip: 'To install on iPhone: tap Share, then “Add to Home Screen”',
    avPresetSection: 'Video & audio presets',
    avOutputSection: 'Video & audio format',
    groupVideo: 'Video',
    groupAudio: 'Audio',
    resolution: 'Resolution',
    videoQuality: 'Video quality',
    bitrate: 'Audio quality',
    trimSection: 'Trim & sound',
    trimStart: 'Start (min:sec)',
    trimEnd: 'End (optional)',
    mute: 'Remove sound',
    cancel: 'Cancel',
    cancelled: 'Cancelled',
    vq: { high: 'High', medium: 'Medium', small: 'Small file' },
    engineLoading: (a, b) => `Downloading the video engine ${a} of ${b} (one time only)`,
    engineFailed: 'Could not load the video engine. Check your connection and try again.',
    gifNote: (n) => `GIF uses only the first ${n} seconds (or the part you trim).`,
    audioOnlyNote: 'Audio files can’t become video. Pick an audio format.',
    slowNote: 'Video conversion is slow on phones. Keep this page open until it finishes.',
    errTooBig: 'Too big for the browser (limit 700 MB)',
    errTrim: 'Trim times are not valid',
    errAudioToVideo: 'An audio file can’t become a video',
    errNoStream: 'This file has no usable audio or video',
    avPresets: {
      whatsapp: { name: 'WhatsApp video', desc: 'MP4 · 720p' },
      smallvideo: { name: 'Small video', desc: 'MP4 · 480p' },
      extract: { name: 'Extract audio', desc: 'MP3 · 192 kbps' },
      voice: { name: 'Voice note', desc: 'MP3 · 96 kbps' },
      gif: { name: 'Animated GIF', desc: 'GIF · 480px' },
      hq: { name: 'High quality audio', desc: 'MP3 · 320 kbps' },
    },
    image: 'Image',
    audio: 'Audio',
    video: 'Video',
    remove: 'Remove',
    unsupported: 'Some unsupported files were skipped',
    pasted: 'Image added from clipboard',
    samplesAdded: 'Added 3 sample images ready to test',
    otherLang: 'العربية',
    original: 'Original size',
    noLimit: 'No limit',
    waiting: 'Waiting',
    failed: 'Could not convert this file',
    heicFailed: 'Could not open this HEIC photo',
    noAvif: 'This browser cannot save AVIF yet. Pick WebP or JPG instead.',
    pngNoQuality: 'PNG is lossless, so the quality slider is ignored.',
    feat1Title: 'Complete Privacy',
    feat1Desc: 'Everything runs locally in your browser with automatic EXIF & GPS stripping.',
    feat2Title: 'Smart Size Targeting',
    feat2Desc: 'Set a max file size (e.g. 200KB or 500KB) and auto-tune quality & scale.',
    feat3Title: 'Before/After Compare + ZIP',
    feat3Desc: 'Inspect results with an interactive split slider, or download all as a ZIP.',
    cropNone: 'Original',
    cmpOrig: 'Original',
    cmpConv: 'Converted',
    cmpDiff: 'Difference',
    tierLow: 'Compact',
    tierMed: 'Balanced',
    tierHigh: 'High',
    tierMax: 'Maximum',
    progressText: (cur, tot) => `Converting ${cur} of ${tot}…`,
    convertCount: (n) => n ? `Convert ${n} file${n > 1 ? 's' : ''}` : 'Convert',
    presets: {
      chat: { name: 'For Chats', desc: 'JPG · 1600px · 80%' },
      instagram: { name: 'Instagram 1:1', desc: 'JPG · 1080px square' },
      email: { name: 'For Email', desc: 'JPG · under 500KB' },
      web: { name: 'Web (WebP)', desc: 'WebP · 1920px · 80%' },
      smallest: { name: 'Smallest Size', desc: 'WebP · under 200KB' },
      lossless: { name: 'Lossless', desc: 'PNG · original size' },
    },
  },
};

const PRESETS = {
  chat: { format: 'JPG', maxSide: 1600, quality: 80, target: 0, cropMode: 'none' },
  instagram: { format: 'JPG', maxSide: 1080, quality: 85, target: 0, cropMode: '1:1' },
  email: { format: 'JPG', maxSide: 1280, quality: 75, target: 500 * 1024, cropMode: 'none' },
  web: { format: 'WEBP', maxSide: 1920, quality: 80, target: 0, cropMode: 'none' },
  smallest: { format: 'WEBP', maxSide: 1280, quality: 60, target: 200 * 1024, cropMode: 'none' },
  lossless: { format: 'PNG', maxSide: 0, quality: 100, target: 0, cropMode: 'none' },
};
const SIZES = [0, 4000, 2560, 1920, 1600, 1280, 1080, 800, 512];
const TARGETS = [0, 2048, 1024, 500, 200, 100].map((kb) => kb * 1024);
const CROP_MODES = ['none', '1:1', '16:9', '4:5'];
const ICONS = { image: '🖼️', audio: '🎵', video: '🎬' };
const AV_PRESETS = {
  whatsapp: { format: 'MP4', resolution: 720, quality: 'medium', bitrate: 128, mute: false },
  smallvideo: { format: 'MP4', resolution: 480, quality: 'small', bitrate: 96, mute: false },
  extract: { format: 'MP3', resolution: 0, quality: 'medium', bitrate: 192, mute: false },
  voice: { format: 'MP3', resolution: 0, quality: 'medium', bitrate: 96, mute: false },
  gif: { format: 'GIF', resolution: 480, quality: 'medium', bitrate: 128, mute: false },
  hq: { format: 'MP3', resolution: 0, quality: 'high', bitrate: 320, mute: false },
};
const RESOLUTIONS = [0, 1080, 720, 480, 360];
const BITRATES = [320, 256, 192, 128, 96, 64];
const AV_DEFAULTS = { preset: 'custom', format: 'MP4', resolution: 0, quality: 'medium', bitrate: 192, mute: false, start: '', end: '' };
const ERRORS = { 'too-big': 'errTooBig', 'bad-trim': 'errTrim', 'audio-to-video': 'errAudioToVideo', 'no-stream': 'errNoStream' };

const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* ignore */ } },
};

const DEFAULT_SETTINGS = {
  preset: 'custom',
  format: 'WEBP',
  maxSide: 0,
  quality: 80,
  target: 0,
  cropMode: 'none',
  rotate: 0,
  flipH: false,
  flipV: false,
  bgColor: '#ffffff',
  suffix: '',
};

function loadSettings() {
  try {
    return Object.assign({}, DEFAULT_SETTINGS, JSON.parse(store.get('ffStudioSettings') || '{}'));
  } catch {
    return Object.assign({}, DEFAULT_SETTINGS);
  }
}

let lang = store.get('ffLang') || store.get('lang') || ((navigator.language || 'ar').toLowerCase().startsWith('ar') ? 'ar' : 'en');
let theme = store.get('ffTheme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
let settings = loadSettings();
let files = [];
let nextId = 1;
let busy = false;
let activeFilter = 'all';
let encoders = { JPG: true, PNG: true, WEBP: true, AVIF: false };
let cancelRequested = false;
let engineMsg = '';
let av = (() => {
  try { return Object.assign({}, AV_DEFAULTS, JSON.parse(store.get('ffAvSettings') || '{}'), { start: '', end: '' }); } catch { return Object.assign({}, AV_DEFAULTS); }
})();
function saveAv() { const { start, end, ...rest } = av; store.set('ffAvSettings', JSON.stringify(rest)); }

const $ = (id) => document.getElementById(id);
const t = (key) => (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key;
const ltr = (s) => `\u2066${s}\u2069`;

function saveSettings() {
  store.set('ffStudioSettings', JSON.stringify(settings));
}

function formatSize(bytes) {
  if (!bytes || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < units.length - 1) { n /= 1024; i++; }
  return `${n.toFixed(n < 10 && i ? 1 : 0)} ${units[i]}`;
}

// ---------- Theme ----------
function applyTheme() {
  document.documentElement.dataset.theme = theme;
  $('themeIconSun').hidden = theme !== 'dark';
  $('themeIconMoon').hidden = theme === 'dark';
}
$('themeBtn').addEventListener('click', () => {
  theme = theme === 'dark' ? 'light' : 'dark';
  store.set('ffTheme', theme);
  applyTheme();
});

// ---------- Settings UI ----------
function qualityTierLabel(q) {
  if (q <= 45) return t('tierLow');
  if (q <= 75) return t('tierMed');
  if (q <= 90) return t('tierHigh');
  return t('tierMax');
}

function renderSettings() {
  // Preset cards
  const presetGrid = $('presetGrid');
  presetGrid.replaceChildren();
  const presetText = t('presets');
  for (const key of Object.keys(PRESETS)) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `preset-btn${settings.preset === key ? ' active' : ''}`;
    const n = document.createElement('span');
    n.className = 'preset-name';
    n.textContent = presetText[key].name;
    const d = document.createElement('span');
    d.className = 'preset-desc';
    d.textContent = presetText[key].desc;
    btn.append(n, d);
    btn.addEventListener('click', () => {
      const p = PRESETS[key];
      settings.preset = key;
      Object.assign(settings, p);
      if (settings.format === 'AVIF' && !encoders.AVIF) settings.format = 'WEBP';
      saveSettings();
      renderSettings();
      markStale();
    });
    presetGrid.append(btn);
  }

  // Format segmented buttons
  const fmtGroup = $('formatGroup');
  fmtGroup.replaceChildren();
  for (const fmt of FFImage.FORMATS) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `seg-btn${settings.format === fmt ? ' active' : ''}`;
    btn.disabled = !encoders[fmt];
    btn.textContent = fmt;
    btn.addEventListener('click', () => onSettingChange({ format: fmt }));
    fmtGroup.append(btn);
  }

  // Quality
  $('quality').value = settings.quality;
  $('qualityOut').textContent = settings.quality;
  $('qualityTier').textContent = qualityTierLabel(settings.quality);
  const lossy = FFImage.LOSSY.has(settings.format);
  $('quality').disabled = !lossy;
  $('qualityField').classList.toggle('muted', !lossy);

  // JPG Background Color
  $('bgColorField').hidden = settings.format !== 'JPG';
  $('bgColorPicker').value = settings.bgColor || '#ffffff';
  document.querySelectorAll('.swatch').forEach((sw) => {
    sw.classList.toggle('active', sw.dataset.bg.toLowerCase() === (settings.bgColor || '#ffffff').toLowerCase());
  });

  // Format Note
  const note = !encoders[settings.format] ? t('noAvif') : (!lossy ? t('pngNoQuality') : '');
  $('formatNote').textContent = note;
  $('formatNote').hidden = !note;

  // Max Side Select
  const sizeSel = $('sizeSelect');
  sizeSel.replaceChildren(...SIZES.map((s) => new Option(s ? ltr(`${s} px`) : t('original'), String(s))));
  sizeSel.value = String(settings.maxSide);

  // Target Size Pills
  const targetPills = $('targetPills');
  targetPills.replaceChildren();
  for (const bytes of TARGETS) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `mini-pill${settings.target === bytes ? ' active' : ''}`;
    btn.textContent = bytes ? ltr(formatSize(bytes)) : t('noLimit');
    btn.addEventListener('click', () => onSettingChange({ target: bytes }));
    targetPills.append(btn);
  }

  // Crop Modes
  const cropGroup = $('cropGroup');
  cropGroup.replaceChildren();
  for (const mode of CROP_MODES) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `seg-btn${settings.cropMode === mode ? ' active' : ''}`;
    btn.textContent = mode === 'none' ? t('cropNone') : mode;
    btn.addEventListener('click', () => onSettingChange({ cropMode: mode }));
    cropGroup.append(btn);
  }

  // Transform badge & active state
  const parts = [];
  if (settings.rotate) parts.push(`${settings.rotate}°`);
  if (settings.flipH) parts.push('⇄');
  if (settings.flipV) parts.push('⇅');
  $('transformBadge').textContent = parts.join(' ');
  $('transformBadge').hidden = parts.length === 0;
  $('flipHBtn').classList.toggle('active', !!settings.flipH);
  $('flipVBtn').classList.toggle('active', !!settings.flipV);

  $('suffixInput').value = settings.suffix || '';

  // Footer encoder capability pills
  const encWrap = $('encoderPills');
  encWrap.replaceChildren();
  for (const fmt of FFImage.FORMATS) {
    const span = document.createElement('span');
    span.className = `pill ${encoders[fmt] ? 'pill-ok' : 'pill-neutral'}`;
    span.textContent = `${fmt} ${encoders[fmt] ? '✓' : '✕'}`;
    encWrap.append(span);
  }

  updateConvertBtn();
}

function onSettingChange(patch) {
  Object.assign(settings, patch, { preset: 'custom' });
  saveSettings();
  renderSettings();
  markStale();
}

$('sizeSelect').addEventListener('change', (e) => onSettingChange({ maxSide: Number(e.target.value) }));
$('quality').addEventListener('input', (e) => {
  const v = Number(e.target.value);
  $('qualityOut').textContent = v;
  $('qualityTier').textContent = qualityTierLabel(v);
});
$('quality').addEventListener('change', (e) => onSettingChange({ quality: Number(e.target.value) }));
$('rotLeftBtn').addEventListener('click', () => onSettingChange({ rotate: (settings.rotate + 270) % 360 }));
$('rotRightBtn').addEventListener('click', () => onSettingChange({ rotate: (settings.rotate + 90) % 360 }));
$('flipHBtn').addEventListener('click', () => onSettingChange({ flipH: !settings.flipH }));
$('flipVBtn').addEventListener('click', () => onSettingChange({ flipV: !settings.flipV }));
$('suffixInput').addEventListener('input', (e) => {
  settings.suffix = e.target.value;
  saveSettings();
  markStale();
});
document.querySelectorAll('.swatch').forEach((sw) => {
  sw.addEventListener('click', () => onSettingChange({ bgColor: sw.dataset.bg }));
});
$('bgColorPicker').addEventListener('input', (e) => onSettingChange({ bgColor: e.target.value }));
$('resetSettingsBtn').addEventListener('click', () => {
  settings = Object.assign({}, DEFAULT_SETTINGS);
  if (!encoders[settings.format]) settings.format = 'JPG';
  saveSettings();
  renderSettings();
  markStale();
});

// ---------- Audio / video settings ----------
function presetCard(name, desc, active, onClick) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `preset-btn${active ? ' active' : ''}`;
  const n = document.createElement('span'); n.className = 'preset-name'; n.textContent = name;
  const d = document.createElement('span'); d.className = 'preset-desc'; d.textContent = desc;
  btn.append(n, d);
  btn.addEventListener('click', onClick);
  return btn;
}
function segButton(label, active, onClick, disabled) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `seg-btn${active ? ' active' : ''}`;
  btn.textContent = label;
  btn.disabled = !!disabled;
  btn.addEventListener('click', onClick);
  return btn;
}
function avTrimValid() {
  const s = FFMedia.parseTime(av.start); const e = FFMedia.parseTime(av.end);
  return !Number.isNaN(s) && !Number.isNaN(e) && !(s != null && e != null && e <= s);
}

function renderAvSettings() {
  const text = t('avPresets');
  $('avPresetGrid').replaceChildren(...Object.keys(AV_PRESETS).map((k) => presetCard(text[k].name, text[k].desc, av.preset === k, () => {
    onAvChange(Object.assign({ preset: k }, AV_PRESETS[k]), true);
  })));
  $('avVideoFormats').replaceChildren(...FFMedia.VIDEO_OUT.map((f) => segButton(f, av.format === f, () => onAvChange({ format: f }))));
  $('avAudioFormats').replaceChildren(...FFMedia.AUDIO_OUT.map((f) => segButton(f, av.format === f, () => onAvChange({ format: f }))));
  const resSel = $('avRes');
  resSel.replaceChildren(...RESOLUTIONS.map((r) => new Option(r ? ltr(`${r}p`) : t('original'), String(r))));
  resSel.value = String(av.resolution);
  $('avQualityGroup').style.gridTemplateColumns = 'repeat(3, minmax(0, 1fr))';
  $('avQualityGroup').replaceChildren(...['high', 'medium', 'small'].map((q) => segButton(t('vq')[q], av.quality === q, () => onAvChange({ quality: q }))));
  $('avBitratePills').replaceChildren(...BITRATES.map((b) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `mini-pill${av.bitrate === b ? ' active' : ''}`;
    btn.textContent = ltr(`${b} kbps`);
    btn.addEventListener('click', () => onAvChange({ bitrate: b }));
    return btn;
  }));
  $('avMute').checked = av.mute;
  if (document.activeElement !== $('trimStart')) $('trimStart').value = av.start;
  if (document.activeElement !== $('trimEnd')) $('trimEnd').value = av.end;

  const isVideoOut = FFMedia.VIDEO_OUT.includes(av.format);
  $('resField').hidden = !isVideoOut;
  $('vqField').hidden = !isVideoOut || av.format === 'GIF';
  $('brField').hidden = !FFMedia.LOSSY_AUDIO.has(av.format);
  $('muteField').hidden = !isVideoOut || av.format === 'GIF';

  const avFiles = files.filter((f) => f.kind !== 'image');
  const notes = [];
  if (isVideoOut && avFiles.length && avFiles.every((f) => f.kind === 'audio')) notes.push(t('audioOnlyNote'));
  if (av.format === 'GIF') notes.push(t('gifNote')(FFMedia.GIF_MAX_SECONDS));
  if (isVideoOut && avFiles.some((f) => f.kind === 'video')) notes.push(t('slowNote'));
  $('avNote').textContent = notes.join(' ');
  $('avNote').hidden = !notes.length;

  const s = FFMedia.parseTime(av.start); const e = FFMedia.parseTime(av.end);
  $('trimStart').classList.toggle('invalid', Number.isNaN(s));
  $('trimEnd').classList.toggle('invalid', Number.isNaN(e) || (s != null && e != null && e <= s));
}

function onAvChange(patch, keepPreset) {
  Object.assign(av, patch);
  if (!keepPreset) av.preset = 'custom';
  saveAv();
  renderAvSettings();
  markStale();
  updateConvertBtn();
}
$('avRes').addEventListener('change', (e) => onAvChange({ resolution: Number(e.target.value) }));
$('avMute').addEventListener('change', (e) => onAvChange({ mute: e.target.checked }));
$('trimStart').addEventListener('input', (e) => onAvChange({ start: e.target.value }, true));
$('trimEnd').addEventListener('input', (e) => onAvChange({ end: e.target.value }, true));

// ---------- Language ----------
function applyLang() {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.title = lang === 'ar' ? 'محول الصيغ · Format Factory' : 'Format Factory';
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const val = t(el.dataset.i18n);
    if (typeof val === 'string') el.textContent = val;
  });
  $('langBtn').textContent = t('otherLang');
  renderSettings();
  renderAvSettings();
  render();
  if (typeof renderSaved === 'function' && window.FFStore) { renderSaved(); renderOffline(); }
}
$('langBtn').addEventListener('click', () => {
  lang = lang === 'ar' ? 'en' : 'ar';
  store.set('ffLang', lang);
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

function revokeResult(f) {
  if (f.result && f.result.url) URL.revokeObjectURL(f.result.url);
  f.result = null;
  f.savedId = null;
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
  if (f) {
    if (f.thumb) URL.revokeObjectURL(f.thumb);
    revokeResult(f);
  }
  files = files.filter((x) => x.id !== id);
  render();
}

function clearFiles() {
  files.forEach((f) => {
    if (f.thumb) URL.revokeObjectURL(f.thumb);
    revokeResult(f);
  });
  files = [];
  activeFilter = 'all';
  render();
}

function markStale() {
  if (busy) return;
  let changed = false;
  files.forEach((f) => {
    if (f.result || f.error) {
      revokeResult(f);
      f.error = null;
      f.status = 'idle';
      changed = true;
    }
  });
  if (changed) render();
}

// ---------- Sample Images Generator (for instant testing) ----------
async function addSampleImages() {
  const specs = [
    { name: 'sunset-landscape.png', w: 1600, h: 1066, c1: '#4f46e5', c2: '#ec4899', c3: '#f59e0b', title: 'Landscape 1600×1066' },
    { name: 'product-card.png', w: 1200, h: 1200, c1: '#0ea5e9', c2: '#14b8a6', c3: '#0f172a', title: 'Square 1200×1200' },
    { name: 'portrait-studio.png', w: 1080, h: 1350, c1: '#7c3aed', c2: '#2563eb', c3: '#38bdf8', title: 'Portrait 1080×1350' },
  ];
  const generated = [];
  for (const sp of specs) {
    const c = document.createElement('canvas');
    c.width = sp.w;
    c.height = sp.h;
    const ctx = c.getContext('2d');
    const g = ctx.createLinearGradient(0, 0, sp.w, sp.h);
    g.addColorStop(0, sp.c1);
    g.addColorStop(0.55, sp.c2);
    g.addColorStop(1, sp.c3);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, sp.w, sp.h);
    // Decorative geometric shapes for realistic compression texture
    for (let i = 0; i < 24; i++) {
      ctx.fillStyle = `rgba(255,255,255,${0.05 + (i % 5) * 0.03})`;
      ctx.beginPath();
      ctx.arc((sp.w * ((i * 37) % 100)) / 100, (sp.h * ((i * 53) % 100)) / 100, 40 + (i % 6) * 35, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.font = 'bold 54px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(sp.title, sp.w / 2, sp.h / 2);
    const blob = await new Promise((res) => c.toBlob(res, 'image/png'));
    generated.push(new File([blob], sp.name, { type: 'image/png' }));
  }
  addFiles(generated);
  toast(t('samplesAdded'));
}

// ---------- Filter Tabs ----------
document.querySelectorAll('.filter-tab').forEach((btn) => {
  btn.addEventListener('click', () => {
    activeFilter = btn.dataset.filter;
    document.querySelectorAll('.filter-tab').forEach((b) => b.classList.toggle('active', b === btn));
    render();
  });
});

// ---------- Render Queue & KPIs ----------
function render() {
  const hasFiles = files.length > 0;
  $('dropZone').classList.toggle('compact', hasFiles);
  $('statsGrid').hidden = !hasFiles;
  $('queuePanel').hidden = !hasFiles;
  $('featureStrip').hidden = hasFiles;
  $('count').textContent = files.length;
  const hasImages = files.some((f) => f.kind === 'image');
  const hasAv = files.some((f) => f.kind !== 'image');
  $('imgInspector').hidden = hasFiles && !hasImages;
  $('avInspector').hidden = !hasAv;
  if (hasAv) renderAvSettings();
  $('engineStatus').textContent = engineMsg;
  $('engineStatus').hidden = !engineMsg;
  $('cancelBtn').hidden = !busy;

  // KPIs
  const totalBefore = files.reduce((s, f) => s + f.file.size, 0);
  const done = files.filter((f) => f.result);
  $('statFilesVal').textContent = `${done.length}/${files.length}`;
  $('statBeforeVal').textContent = formatSize(totalBefore);
  if (done.length) {
    const doneBefore = done.reduce((s, f) => s + f.file.size, 0);
    const doneAfter = done.reduce((s, f) => s + f.result.blob.size, 0);
    const pct = doneBefore > 0 ? Math.round((1 - doneAfter / doneBefore) * 100) : 0;
    $('statAfterVal').textContent = formatSize(doneAfter);
    $('statSavedVal').textContent = pct >= 0 ? `-${pct}%` : `+${-pct}%`;
  } else {
    $('statAfterVal').textContent = '—';
    $('statSavedVal').textContent = '—';
  }

  // Filter list
  const visible = files.filter((f) => {
    if (activeFilter === 'done') return !!f.result;
    if (activeFilter === 'pending') return !f.result;
    return true;
  });

  const ul = $('fileList');
  ul.replaceChildren();
  for (const f of visible) {
    const li = document.createElement('li');
    li.className = `file-card${f.status === 'working' ? ' working' : ''}${f.result ? ' done' : ''}${f.error ? ' error' : ''}`;

    const thumbWrap = document.createElement('div');
    thumbWrap.className = 'thumb-wrap';
    const resultImg = f.result && /^image\//.test(f.result.blob.type) ? f.result.url : null;
    if (f.thumb || resultImg) {
      const img = document.createElement('img');
      img.src = resultImg || f.thumb;
      img.alt = '';
      thumbWrap.append(img);
    } else {
      thumbWrap.textContent = ICONS[f.kind] || '📄';
    }

    const meta = document.createElement('div');
    meta.className = 'file-meta';

    const name = document.createElement('p');
    name.className = 'file-name';
    name.textContent = f.result ? f.result.name : f.file.name;
    name.title = f.file.name;

    const sub = document.createElement('div');
    sub.className = 'file-sub';
    const origPill = document.createElement('span');
    origPill.className = 'pill pill-neutral';
    origPill.textContent = `${t(f.kind)} · ${ltr(formatSize(f.file.size))}`;
    sub.append(origPill);

    if (f.status === 'working') {
      const p = document.createElement('span');
      p.className = 'pill pill-accent';
      p.textContent = f.progress != null ? `${t('converting')} ${ltr(Math.round(f.progress * 100) + '%')}` : t('converting');
      sub.append(p);
      f.ui = { text: p };
    } else if (f.error) {
      const p = document.createElement('span');
      p.className = 'pill pill-err';
      p.textContent = f.error;
      sub.append(p);
    } else if (f.result) {
      const r = f.result;
      const pct = f.file.size > 0 ? Math.round((1 - r.blob.size / f.file.size) * 100) : 0;
      const resPill = document.createElement('span');
      resPill.className = `pill ${pct >= 0 ? 'pill-ok' : 'pill-warn'}`;
      resPill.textContent = `${ltr(formatSize(r.blob.size))} (${pct >= 0 ? `-${pct}%` : `+${-pct}%`})`;
      sub.append(resPill);
      if (r.width) {
        const dimPill = document.createElement('span');
        dimPill.className = 'pill pill-neutral';
        dimPill.textContent = ltr(`${r.width}×${r.height}`);
        sub.append(dimPill);
      }
    }
    meta.append(name, sub);
    if (f.status === 'working' && f.kind !== 'image') {
      const bar = document.createElement('div');
      bar.className = 'file-bar';
      const fill = document.createElement('span');
      fill.style.width = `${Math.round((f.progress || 0) * 100)}%`;
      bar.append(fill);
      meta.append(bar);
      f.ui.fill = fill;
    }

    const actions = document.createElement('div');
    actions.className = 'file-actions';

    if (f.result && f.thumb && f.kind === 'image') {
      const cmpBtn = document.createElement('button');
      cmpBtn.type = 'button';
      cmpBtn.className = 'btn btn-ghost btn-sm';
      cmpBtn.textContent = t('compare');
      cmpBtn.addEventListener('click', () => openCompare(f));
      actions.append(cmpBtn);
    }
    if (f.result) {
      const sv = document.createElement('button');
      sv.type = 'button';
      sv.className = 'btn btn-ghost btn-sm';
      sv.textContent = f.savedId ? `✓ ${t('saved')}` : t('save');
      sv.disabled = !!f.savedId || !!f.saving;
      sv.addEventListener('click', () => saveResult(f, true));
      actions.append(sv);
      const dl = document.createElement('a');
      dl.className = 'btn btn-soft btn-sm';
      dl.href = f.result.url;
      dl.download = f.result.name;
      dl.textContent = t('download');
      actions.append(dl);
    }
    const rm = document.createElement('button');
    rm.type = 'button';
    rm.className = 'btn btn-link btn-sm';
    rm.textContent = '✕';
    rm.disabled = busy;
    rm.setAttribute('aria-label', `${t('remove')} ${f.file.name}`);
    rm.addEventListener('click', () => removeFile(f.id));
    actions.append(rm);

    li.append(thumbWrap, meta, actions);
    ul.append(li);
  }

  $('zipBtn').hidden = done.length < 2;
  updateConvertBtn();
}

function updateConvertBtn() {
  const count = convertible().length;
  const btn = $('convertBtn');
  btn.disabled = busy || count === 0;
  $('convertBtnText').textContent = busy ? t('converting') : t('convertCount')(count);
}

// ---------- Batch Convert ----------
function convertible() {
  return files.filter((f) => (f.kind === 'image' ? encoders[settings.format] : avTrimValid()));
}

async function ensureEngine() {
  if (FFMedia.isLoaded()) return;
  engineMsg = t('engineLoading')(ltr('0 MB'), ltr('31 MB'));
  render();
  try {
    await FFMedia.load((got, total) => {
      engineMsg = t('engineLoading')(ltr(formatSize(got)), ltr(formatSize(total)));
      $('engineStatus').textContent = engineMsg;
      $('engineStatus').hidden = false;
    });
    engineMsg = '';
  } catch (err) {
    engineMsg = t('engineFailed');
    throw err;
  } finally {
    render();
  }
}

function setOverall(done, total, frac) {
  const pct = Math.round(((done + (frac || 0)) / total) * 100);
  $('progressPct').textContent = `${pct}%`;
  $('progressFill').style.width = `${pct}%`;
}

async function convertAll() {
  if (busy) return;
  const todo = convertible();
  if (!todo.length) return;
  busy = true;
  cancelRequested = false;
  const opts = {
    format: settings.format,
    quality: settings.quality / 100,
    maxSide: settings.maxSide,
    targetBytes: settings.target,
    cropMode: settings.cropMode,
    rotate: settings.rotate,
    flipH: settings.flipH,
    flipV: settings.flipV,
    bgColor: settings.bgColor,
    suffix: settings.suffix,
  };
  const avOpts = {
    format: av.format, resolution: av.resolution, quality: av.quality, bitrate: av.bitrate, mute: av.mute,
    start: FFMedia.parseTime(av.start), end: FFMedia.parseTime(av.end),
  };

  todo.forEach((f) => { revokeResult(f); f.error = null; f.status = 'waiting'; f.progress = null; });
  $('progressWrap').hidden = false;
  render();

  let completed = 0;
  for (const f of todo) {
    if (cancelRequested) break;
    if (!files.includes(f)) continue;
    f.status = 'working';
    f.ui = null;
    $('progressLabel').textContent = t('progressText')(completed + 1, todo.length);
    setOverall(completed, todo.length, 0);
    render();
    try {
      let r;
      if (f.kind === 'image') {
        r = await FFImage.convert(f.file, opts);
      } else {
        await ensureEngine();
        f.progress = 0;
        render();
        r = await FFMedia.convert(f.file, f.kind, avOpts, (p) => {
          f.progress = p;
          if (f.ui) {
            f.ui.text.textContent = `${t('converting')} ${ltr(Math.round(p * 100) + '%')}`;
            if (f.ui.fill) f.ui.fill.style.width = `${Math.round(p * 100)}%`;
          }
          setOverall(completed, todo.length, p);
        });
        if (settings.suffix && FFMedia) {
          const clean = settings.suffix.replace(/[\\/:*?"<>|]/g, '');
          r.name = r.name.replace(/(-converted)?(\.[^.]+)$/, `${clean}$2`);
        }
      }
      r.url = URL.createObjectURL(r.blob);
      f.result = r;
      f.savedId = null;
      if (autoSave) saveResult(f, false);
    } catch (err) {
      if (cancelRequested) {
        f.error = t('cancelled');
      } else {
        console.error(err);
        const key = ERRORS[err && err.message];
        f.error = key ? t(key) : (FFImage.isHeic(f.file) ? t('heicFailed') : t('failed'));
      }
    }
    f.status = 'idle';
    f.ui = null;
    completed++;
    setOverall(completed, todo.length, 0);
    render();
    await new Promise((res) => setTimeout(res, 0));
  }
  todo.forEach((f) => { if (f.status === 'waiting') { f.status = 'idle'; if (cancelRequested) f.error = t('cancelled'); } });

  busy = false;
  setTimeout(() => { if (!busy) $('progressWrap').hidden = true; }, 900);
  render();
  setTimeout(renderOffline, 1500);
}
$('cancelBtn').addEventListener('click', () => {
  if (!busy) return;
  cancelRequested = true;
  FFMedia.cancel(); // stops a running audio/video job right away
});
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

// ---------- Before/After Compare Modal ----------
function setComparePos(pct) {
  const clamped = Math.max(0, Math.min(100, pct));
  $('compareBeforeWrap').style.clipPath = `inset(0 ${100 - clamped}% 0 0)`;
  $('compareDivider').style.left = `${clamped}%`;
  $('compareSlider').value = String(clamped);
}

function openCompare(f) {
  if (!f.result || !f.thumb) return;
  $('compareTitle').textContent = f.result.name;
  $('compareImgBefore').src = f.thumb;
  $('compareImgAfter').src = f.result.url;
  $('badgeBefore').textContent = `${t('cmpOrig')} · ${formatSize(f.file.size)}`;
  $('badgeAfter').textContent = `${f.result.name.split('.').pop().toUpperCase()} · ${formatSize(f.result.blob.size)}`;
  $('cmpOrigVal').textContent = `${formatSize(f.file.size)} (${f.result.origWidth}×${f.result.origHeight})`;
  $('cmpConvVal').textContent = `${formatSize(f.result.blob.size)} (${f.result.width}×${f.result.height})`;
  const pct = f.file.size > 0 ? Math.round((1 - f.result.blob.size / f.file.size) * 100) : 0;
  $('cmpDiffVal').textContent = pct >= 0 ? `-${pct}%` : `+${-pct}%`;
  setComparePos(50);
  $('compareModal').hidden = false;
}

$('compareSlider').addEventListener('input', (e) => setComparePos(Number(e.target.value)));
$('closeCompareBtn').addEventListener('click', () => { $('compareModal').hidden = true; });
$('compareModal').addEventListener('click', (e) => {
  if (e.target === $('compareModal')) $('compareModal').hidden = true;
});
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !$('compareModal').hidden) $('compareModal').hidden = true;
});

// ---------- Drop Zone, Clipboard Paste & Buttons ----------
const drop = $('dropZone');
const input = $('fileInput');
drop.addEventListener('click', (e) => {
  if (e.target.closest('button')) return;
  input.click();
});
drop.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); }
});
$('chooseBtn').addEventListener('click', (e) => { e.stopPropagation(); input.click(); });
$('sampleBtn').addEventListener('click', (e) => { e.stopPropagation(); addSampleImages(); });
input.addEventListener('change', () => { addFiles(input.files); input.value = ''; });

['dragenter', 'dragover'].forEach((ev) => drop.addEventListener(ev, (e) => {
  e.preventDefault();
  drop.classList.add('over');
}));
['dragleave', 'drop'].forEach((ev) => drop.addEventListener(ev, (e) => {
  e.preventDefault();
  drop.classList.remove('over');
}));
drop.addEventListener('drop', (e) => addFiles(e.dataTransfer.files));
window.addEventListener('dragover', (e) => e.preventDefault());
window.addEventListener('drop', (e) => e.preventDefault());

// Paste images directly from clipboard
window.addEventListener('paste', (e) => {
  if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
  const items = e.clipboardData && e.clipboardData.files;
  if (items && items.length) {
    addFiles(items);
    toast(t('pasted'));
  }
});

$('clearBtn').addEventListener('click', () => { if (!busy) clearFiles(); });

function toast(msg) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  $('toastStack').append(el);
  setTimeout(() => el.remove(), 3200);
}

// ---------- On this device: saved files + offline ----------
let autoSave = store.get('ffAutoSave') !== '0';
let savedUrls = [];
let engineDl = null; // { got, total } while downloading
let clearArmed = null;

async function saveResult(f, manual) {
  if (!f.result || f.savedId || f.saving) return;
  f.saving = true;
  try {
    const r = f.result;
    f.savedId = await FFStore.saveFile({
      name: r.name, origName: f.file.name, kind: f.kind,
      size: r.blob.size, origSize: f.file.size,
      width: r.width || 0, height: r.height || 0,
      type: r.blob.type, blob: r.blob,
    });
    FFStore.persist();
    if (manual) toast(t('savedToast'));
  } catch (err) {
    console.error(err);
    const full = err && (err.name === 'QuotaExceededError' || /quota/i.test(String(err.message)));
    toast(full ? t('storageFull') : t('storageFailed'));
  } finally {
    f.saving = false;
    render();
    renderSaved();
  }
}

function fmtDate(ms) {
  try {
    return new Intl.DateTimeFormat(lang === 'ar' ? 'ar' : 'en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(ms));
  } catch { return new Date(ms).toLocaleString(); }
}

function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name;
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

let savedRenderSeq = 0;
async function renderSaved() {
  const seq = ++savedRenderSeq;
  let items = [];
  try { items = await FFStore.listFiles(); } catch { items = []; }
  if (seq !== savedRenderSeq) return;
  savedUrls.forEach((u) => URL.revokeObjectURL(u));
  savedUrls = [];

  $('savedCount').textContent = items.length;
  $('savedEmpty').hidden = items.length > 0;
  $('clearSavedBtn').hidden = items.length === 0;
  $('autoSave').checked = autoSave;

  const ul = $('savedList');
  ul.replaceChildren();
  for (const it of items) {
    const li = document.createElement('li');
    li.className = 'file-card done';
    const thumbWrap = document.createElement('div');
    thumbWrap.className = 'thumb-wrap';
    if (/^image\//.test(it.type || '') && it.blob) {
      const img = document.createElement('img');
      const u = URL.createObjectURL(it.blob);
      savedUrls.push(u);
      img.src = u; img.alt = '';
      thumbWrap.append(img);
    } else {
      thumbWrap.textContent = ICONS[it.kind] || '📄';
    }
    const meta = document.createElement('div');
    meta.className = 'file-meta';
    const name = document.createElement('p');
    name.className = 'file-name';
    name.textContent = it.name;
    name.title = it.origName || it.name;
    const sub = document.createElement('div');
    sub.className = 'file-sub';
    const p1 = document.createElement('span');
    p1.className = 'pill pill-neutral';
    p1.textContent = `${t(it.kind)} · ${ltr(formatSize(it.size))}`;
    const p2 = document.createElement('span');
    p2.className = 'pill pill-neutral';
    p2.textContent = fmtDate(it.date);
    sub.append(p1, p2);
    meta.append(name, sub);

    const actions = document.createElement('div');
    actions.className = 'file-actions';
    const dl = document.createElement('button');
    dl.type = 'button';
    dl.className = 'btn btn-soft btn-sm';
    dl.textContent = t('download');
    dl.addEventListener('click', async () => {
      const rec = await FFStore.getFile(it.id);
      if (rec && rec.blob) downloadBlob(rec.blob, rec.name);
    });
    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'btn btn-link btn-sm';
    del.textContent = '✕';
    del.setAttribute('aria-label', `${t('delete')} ${it.name}`);
    del.addEventListener('click', async () => {
      await FFStore.deleteFile(it.id);
      files.forEach((f) => { if (f.savedId === it.id) f.savedId = null; });
      render();
      renderSaved();
    });
    actions.append(dl, del);
    li.append(thumbWrap, meta, actions);
    ul.append(li);
  }

  const est = await FFStore.estimate();
  if (est && est.usage != null && est.quota) {
    $('storageUsage').textContent = t('storageUsed')(ltr(formatSize(est.usage)), ltr(formatSize(est.quota)));
    $('storageUsage').hidden = false;
  }
}

$('autoSave').addEventListener('change', (e) => {
  autoSave = e.target.checked;
  store.set('ffAutoSave', autoSave ? '1' : '0');
});
$('clearSavedBtn').addEventListener('click', async () => {
  const btn = $('clearSavedBtn');
  if (!clearArmed) {
    btn.textContent = t('clearSavedConfirm');
    btn.classList.add('btn-danger-confirm');
    clearArmed = setTimeout(() => { clearArmed = null; btn.textContent = t('clearSaved'); btn.classList.remove('btn-danger-confirm'); }, 4000);
    return;
  }
  clearTimeout(clearArmed); clearArmed = null;
  btn.textContent = t('clearSaved');
  btn.classList.remove('btn-danger-confirm');
  await FFStore.clearFiles();
  files.forEach((f) => { f.savedId = null; });
  render();
  renderSaved();
});

function setDot(el, state) { el.className = `status-dot${state ? ` ${state}` : ''}`; }

async function renderOffline() {
  const swOk = 'serviceWorker' in navigator && 'caches' in window;
  const shell = swOk && await FFStore.shellCached();
  setDot($('offShellDot'), shell ? 'ok' : 'warn');
  $('offShellText').textContent = !swOk ? t('offUnsupported') : (shell ? t('offReady') : t('offNeedsNet'));

  if (engineDl) {
    setDot($('offEngineDot'), 'busy');
    $('offEngineText').textContent = t('offDownloading')(ltr(formatSize(engineDl.got)), ltr(formatSize(engineDl.total)));
    $('offlineBtn').hidden = true;
    return;
  }
  const engine = swOk && await FFStore.engineCached();
  setDot($('offEngineDot'), engine ? 'ok' : 'warn');
  $('offEngineText').textContent = !swOk ? t('offUnsupported') : (engine ? t('offReady') : t('offNeedsNet'));
  $('offlineBtn').hidden = !swOk || engine;
}

$('offlineBtn').addEventListener('click', async () => {
  if (engineDl) return;
  engineDl = { got: 0, total: FFStore.ENGINE_TOTAL };
  renderOffline();
  try {
    await FFStore.downloadEngine((got, total) => {
      engineDl = { got, total };
      $('offEngineText').textContent = t('offDownloading')(ltr(formatSize(got)), ltr(formatSize(total)));
    });
    FFStore.persist();
    toast(t('offDone'));
  } catch (err) {
    console.error(err);
    toast(t('offFailed'));
  } finally {
    engineDl = null;
    renderOffline();
    renderSaved();
  }
});

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
      .then(() => { $('offlineNote').hidden = false; setTimeout(renderOffline, 500); })
      .catch(() => { /* offline support unavailable */ });
  });
}

// ---------- Init ----------
applyTheme();
applyLang();
FFImage.detectEncoders().then((enc) => {
  encoders = enc;
  if (!encoders[settings.format]) settings.format = encoders.WEBP ? 'WEBP' : 'JPG';
  renderSettings();
});
renderSaved();
renderOffline();
