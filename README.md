# Format Factory · محول الصيغ

A free file converter for images, audio and video that runs entirely in the browser. Files never leave your device. It installs on phones and computers like an app (PWA) and works offline.

محول مجاني للصور والصوت والفيديو يعمل بالكامل داخل المتصفح. ملفاتك لا تغادر جهازك. يمكن تثبيته على الهاتف مثل التطبيق ويعمل بدون إنترنت.

## Status

- [x] Step 1: app shell (Arabic/English, drag and drop, installable, offline)
- [ ] Step 2: image conversion (JPG, PNG, WebP, AVIF)
- [ ] Step 3: audio and video conversion (ffmpeg.wasm)
- [ ] Step 4: batch conversion and polish

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
