# Format Factory · محول الصيغ

A free file converter for images, audio and video that runs entirely in the browser. Files never leave your device. It installs on phones and computers like an app (PWA) and works offline.

محول مجاني للصور والصوت والفيديو يعمل بالكامل داخل المتصفح. ملفاتك لا تغادر جهازك. يمكن تثبيته على الهاتف مثل التطبيق ويعمل بدون إنترنت.

## Status

- [x] Step 1: app shell (Arabic/English, drag and drop, installable, offline)
- [x] Step 2: image conversion (JPG, PNG, WebP, AVIF where the browser supports it), resize, max file size, presets, iPhone HEIC photos, download all as ZIP
- [x] Step 3: audio and video conversion with ffmpeg.wasm: MP4, WebM, MOV, GIF, MP3, WAV, OGG, M4A, FLAC, OPUS; resolution, quality, bitrate, trim, mute, presets, progress and cancel
- [ ] Step 4: batch conversion and polish

## Works offline and saves on your device

- After the first visit, the app and image conversion work with no internet.
- The video and audio engine (31 MB) is saved the first time you convert a video or audio file, or ahead of time with **Download for offline use** in the "On this device" card.
- Converted files are saved on your device (IndexedDB) and stay after you close the app. Turn off **Save results automatically** to save only what you choose, and delete files from the **Saved files** list.
- Nothing is uploaded anywhere. Fonts are bundled in `fonts/` so the app looks the same offline.

## Install on your phone

- **Android (Chrome):** open the site and tap **Install app**, or menu ⋮ → *Install app*.
- **iPhone (Safari):** tap **Share** → *Add to Home Screen*.

## Run locally

Any static server works, for example:

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000. (Opening `index.html` directly works too, but offline mode needs a server.)

## Publish on GitHub Pages

Settings → Pages → *Deploy from a branch* → `main` / `(root)`.

## Updating

When you change app files, bump `VERSION` in `sw.js` so installed copies pick up the new version.

## Credits

- Fonts: [Cairo](https://github.com/Gue3bara/Cairo) and [Inter](https://github.com/rsms/inter), SIL Open Font License 1.1 (see `fonts/`).

- Audio and video use [ffmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm) (`@ffmpeg/ffmpeg` MIT, `@ffmpeg/core` GPL-2.0-or-later, built from [FFmpeg](https://ffmpeg.org)). See `lib/ffmpeg/LICENSE.txt`. The ~31 MB engine downloads once, the first time you convert audio or video, then works offline.

- iPhone HEIC photos are decoded with [heic2any](https://github.com/alexcorvi/heic2any) (MIT, see `lib/heic2any.LICENSE.txt`). It loads only when a HEIC file needs it.
