'use strict';
// Audio and video conversion with ffmpeg.wasm (single-thread build, so it
// works on GitHub Pages without special server headers).
(function () {
  const ENGINE_BASE = new URL('lib/ffmpeg/', location.href).href;
  const WASM_SIZE = 32232419; // fallback when the server hides the length
  // The whole file and its output must fit in the browser's memory.
  const MAX_INPUT = 700 * 1024 * 1024;

  const VIDEO_OUT = ['MP4', 'WEBM', 'MOV', 'GIF'];
  const AUDIO_OUT = ['MP3', 'WAV', 'OGG', 'M4A', 'FLAC', 'OPUS'];
  const LOSSY_AUDIO = new Set(['MP3', 'OGG', 'M4A', 'OPUS']);
  const EXT = { MP4: 'mp4', WEBM: 'webm', MOV: 'mov', GIF: 'gif', MP3: 'mp3', WAV: 'wav', OGG: 'ogg', M4A: 'm4a', FLAC: 'flac', OPUS: 'opus' };
  const MIME = { MP4: 'video/mp4', WEBM: 'video/webm', MOV: 'video/quicktime', GIF: 'image/gif', MP3: 'audio/mpeg', WAV: 'audio/wav', OGG: 'audio/ogg', M4A: 'audio/mp4', FLAC: 'audio/flac', OPUS: 'audio/ogg' };
  const CRF = { high: 23, medium: 28, small: 33 };
  const VPX_BITRATE = { high: '2500k', medium: '1200k', small: '600k' };
  const GIF_MAX_SECONDS = 15;

  let ffmpeg = null;
  let loading = null;
  let logs = [];

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = () => reject(new Error('engine-load'));
      document.head.append(s);
    });
  }

  async function fetchWithProgress(url, onProgress) {
    const res = await fetch(url);
    if (!res.ok || !res.body) throw new Error('engine-load');
    const total = Number(res.headers.get('content-length')) || WASM_SIZE;
    const reader = res.body.getReader();
    const chunks = []; let got = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value); got += value.length;
      if (onProgress) onProgress(Math.min(got, total), total);
    }
    return URL.createObjectURL(new Blob(chunks, { type: 'application/wasm' }));
  }

  // Loads the engine once; later calls reuse it.
  function load(onProgress) {
    if (ffmpeg) return Promise.resolve(ffmpeg);
    if (!loading) {
      loading = (async () => {
        if (!window.FFmpegWASM) await loadScript('lib/ffmpeg/ffmpeg.js');
        const inst = new window.FFmpegWASM.FFmpeg();
        inst.on('log', ({ message }) => { logs.push(message); if (logs.length > 400) logs.shift(); });
        const wasmURL = await fetchWithProgress(ENGINE_BASE + 'ffmpeg-core.wasm', onProgress);
        try {
          await inst.load({ coreURL: ENGINE_BASE + 'ffmpeg-core.js', wasmURL });
        } finally {
          URL.revokeObjectURL(wasmURL);
        }
        ffmpeg = inst;
        return inst;
      })().catch((err) => { loading = null; throw err; });
    }
    return loading;
  }

  function isLoaded() { return !!ffmpeg; }

  // Stops a running conversion. The engine has to be loaded again afterwards
  // (from the browser cache, so it's quick).
  function cancel() {
    if (ffmpeg) { try { ffmpeg.terminate(); } catch { /* ignore */ } }
    ffmpeg = null; loading = null;
  }

  // "1:23", "01:02:03", "83" or "83.5" → seconds. Empty → null.
  function parseTime(text) {
    const s = String(text || '').trim().replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
    if (!s) return null;
    if (!/^\d+(?::\d{1,2}){0,2}(?:[.,]\d+)?$/.test(s)) return NaN;
    return s.replace(',', '.').split(':').reduce((acc, part) => acc * 60 + Number(part), 0);
  }

  function parseDuration(lines) {
    for (const l of lines) {
      const m = /Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/.exec(l);
      if (m) return Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]);
    }
    return 0;
  }

  function scaleFilter(side) {
    // Fit the short side to `side` px, never upscale, keep even dimensions.
    return `scale=w=if(gte(iw\\,ih)\\,-2\\,min(${side}\\,iw)):h=if(gte(iw\\,ih)\\,min(${side}\\,ih)\\,-2)`;
  }

  function buildArgs(input, output, o, isVideoIn) {
    const args = ['-hide_banner', '-y'];
    if (o.start) args.push('-ss', String(o.start));
    args.push('-i', input);
    let dur = o.end ? o.end - (o.start || 0) : 0;
    if (o.format === 'GIF' && (!dur || dur > GIF_MAX_SECONDS)) dur = GIF_MAX_SECONDS;
    if (dur) args.push('-t', String(dur));

    switch (o.format) {
      case 'MP4':
      case 'MOV': {
        const vf = o.resolution ? [scaleFilter(o.resolution)] : ['scale=trunc(iw/2)*2:trunc(ih/2)*2'];
        args.push('-vf', vf.join(','), '-c:v', 'libx264', '-preset', 'veryfast', '-crf', String(CRF[o.quality] || 28), '-pix_fmt', 'yuv420p');
        if (o.mute) args.push('-an'); else args.push('-c:a', 'aac', '-b:a', '128k');
        args.push('-movflags', '+faststart');
        break;
      }
      case 'WEBM': {
        if (o.resolution) args.push('-vf', scaleFilter(o.resolution));
        args.push('-c:v', 'libvpx', '-deadline', 'realtime', '-cpu-used', '8', '-b:v', VPX_BITRATE[o.quality] || '1200k');
        if (o.mute) args.push('-an'); else args.push('-c:a', 'libopus', '-b:a', '96k');
        break;
      }
      case 'GIF': {
        const side = Math.min(o.resolution || 480, 480);
        args.push('-vf', `fps=10,scale=${side}:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse=dither=bayer`, '-an', '-loop', '0');
        break;
      }
      case 'MP3': args.push('-vn', '-c:a', 'libmp3lame', '-b:a', `${o.bitrate}k`); break;
      case 'WAV': args.push('-vn', '-c:a', 'pcm_s16le'); break;
      case 'OGG': args.push('-vn', '-c:a', 'libvorbis', '-b:a', `${o.bitrate}k`); break;
      case 'M4A': args.push('-vn', '-c:a', 'aac', '-b:a', `${o.bitrate}k`); break;
      case 'FLAC': args.push('-vn', '-c:a', 'flac'); break;
      case 'OPUS': args.push('-vn', '-c:a', 'libopus', '-b:a', `${Math.min(o.bitrate, 256)}k`); break;
      default: throw new Error('format');
    }
    if (!isVideoIn && VIDEO_OUT.includes(o.format)) throw new Error('audio-to-video');
    args.push(output);
    return { args, clipDuration: dur };
  }

  /**
   * opts: { format, resolution: px|0, quality: 'high'|'medium'|'small',
   *         bitrate: kbps, start: s|null, end: s|null, mute: bool }
   * onProgress(fraction 0..1)
   */
  async function convert(file, kind, opts, onProgress) {
    if (file.size > MAX_INPUT) throw new Error('too-big');
    if (opts.start != null && opts.end != null && opts.end <= opts.start) throw new Error('bad-trim');
    const ff = await load();

    const inExt = (file.name.match(/\.([a-z0-9]{1,5})$/i) || [, kind === 'video' ? 'mp4' : 'mp3'])[1].toLowerCase();
    const input = `input.${inExt}`;
    const output = `output.${EXT[opts.format]}`;
    const { args, clipDuration } = buildArgs(input, output, opts, kind === 'video');

    logs = [];
    let total = clipDuration;
    const onProg = ({ time }) => {
      if (!total) total = Math.max(0, parseDuration(logs) - (opts.start || 0));
      if (total && onProgress) onProgress(Math.max(0, Math.min(1, time / 1e6 / total)));
    };
    ff.on('progress', onProg);
    try {
      await ff.writeFile(input, new Uint8Array(await file.arrayBuffer()));
      const code = await ff.exec(args);
      if (code !== 0) {
        console.warn(logs.slice(-15).join('\n'));
        if (logs.some((l) => /does not contain any stream|Output file .* does not contain|matches no streams/i.test(l))) throw new Error('no-stream');
        throw new Error('ffmpeg');
      }
      const data = await ff.readFile(output);
      const base = file.name.replace(/\.[^.]+$/, '') || 'file';
      let name = `${base}.${EXT[opts.format]}`;
      if (name === file.name) name = `${base}-converted.${EXT[opts.format]}`;
      return { blob: new Blob([data.buffer], { type: MIME[opts.format] }), name };
    } finally {
      ff.off('progress', onProg);
      for (const f of [input, output]) { try { await ff.deleteFile(f); } catch { /* not there */ } }
    }
  }

  window.FFMedia = { load, isLoaded, cancel, convert, parseTime, VIDEO_OUT, AUDIO_OUT, LOSSY_AUDIO, GIF_MAX_SECONDS, MAX_INPUT };
})();
