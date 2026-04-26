/* ===== STATE ===== */
const state = {
  layout: 'classic-4',
  filter: 'none',
  timer: 5,
  border: 'white',
  sticker: 'none',
  caption: 'photobooth',
  photos: [],
  stream: null,
  capturing: false,
  facingMode: 'user',
  theme: 'dark',
};

const MAX_CAPTION_LENGTH = 30;

function getPhotoCount() {
  switch (state.layout) {
    case 'classic-4': return 4;
    case 'classic-3': return 3;
    case 'grid-4': return 4;
    case 'single': return 1;
    default: return 4;
  }
}

/* ===== BORDER DEFINITIONS ===== */
const borders = {
  white:      { type: 'solid', color: '#ffffff' },
  black:      { type: 'solid', color: '#000000' },
  cream:      { type: 'solid', color: '#f5e6d3' },
  blush:      { type: 'solid', color: '#ffc0cb' },
  lavender:   { type: 'solid', color: '#e6e0ff' },
  mint:       { type: 'solid', color: '#d4edda' },
  sunset:     { type: 'gradient', colors: ['#ff6b6b', '#ffa07a', '#ffd700'] },
  ocean:      { type: 'gradient', colors: ['#667eea', '#764ba2'] },
  aurora:     { type: 'gradient', colors: ['#a8edea', '#fed6e3'] },
  candy:      { type: 'gradient', colors: ['#f093fb', '#f5576c'] },
  forest:     { type: 'gradient', colors: ['#134e5e', '#71b280'] },
  golden:     { type: 'gradient', colors: ['#f2c94c', '#f2994a'] },
  hearts:     { type: 'pattern', pattern: 'hearts', bg: '#fff0f3' },
  polkadots:  { type: 'pattern', pattern: 'polkadots', bg: '#fef9ef' },
  stripes:    { type: 'pattern', pattern: 'stripes', bg: '#f0f4ff' },
  confetti:   { type: 'pattern', pattern: 'confetti', bg: '#fffdf0' },
  floral:     { type: 'pattern', pattern: 'floral', bg: '#fdf2f8' },
  stars:      { type: 'pattern', pattern: 'stars', bg: '#f5f0ff' },
};

/* ===== STICKER DEFINITIONS ===== */
const stickerSets = {
  none: [],
  'love': [
    { e: '♡', x: 0.03, y: 0.04, s: 22 },
    { e: '♡', x: 0.92, y: 0.04, s: 18 },
    { e: '♡', x: 0.05, y: 0.96, s: 16 },
    { e: '♡', x: 0.90, y: 0.96, s: 20 },
    { e: '♡', x: 0.48, y: 0.02, s: 14 },
    { e: '♡', x: 0.50, y: 0.98, s: 14 },
    { e: '♡', x: 0.02, y: 0.50, s: 12 },
    { e: '♡', x: 0.95, y: 0.50, s: 12 },
  ],
  'sparkle': [
    { e: '✦', x: 0.04, y: 0.04, s: 18 },
    { e: '✧', x: 0.93, y: 0.05, s: 14 },
    { e: '✦', x: 0.06, y: 0.95, s: 16 },
    { e: '✧', x: 0.91, y: 0.94, s: 20 },
    { e: '·', x: 0.20, y: 0.03, s: 22 },
    { e: '·', x: 0.80, y: 0.03, s: 22 },
    { e: '✦', x: 0.02, y: 0.30, s: 10 },
    { e: '✧', x: 0.96, y: 0.70, s: 10 },
  ],
  'butterfly': [
    { e: '🦋', x: 0.04, y: 0.04, s: 22 },
    { e: '🦋', x: 0.90, y: 0.06, s: 18 },
    { e: '🦋', x: 0.06, y: 0.93, s: 16 },
    { e: '🦋', x: 0.88, y: 0.92, s: 20 },
    { e: '·', x: 0.30, y: 0.02, s: 14 },
    { e: '·', x: 0.70, y: 0.98, s: 14 },
  ],
  'daisy': [
    { e: '✿', x: 0.04, y: 0.04, s: 22 },
    { e: '✿', x: 0.92, y: 0.05, s: 18 },
    { e: '❀', x: 0.05, y: 0.94, s: 20 },
    { e: '✿', x: 0.90, y: 0.94, s: 16 },
    { e: '❀', x: 0.48, y: 0.02, s: 14 },
    { e: '✿', x: 0.02, y: 0.50, s: 12 },
    { e: '❀', x: 0.96, y: 0.50, s: 12 },
  ],
  'celestial': [
    { e: '☽', x: 0.05, y: 0.05, s: 24 },
    { e: '★', x: 0.92, y: 0.04, s: 14 },
    { e: '★', x: 0.88, y: 0.08, s: 10 },
    { e: '☆', x: 0.06, y: 0.94, s: 16 },
    { e: '★', x: 0.90, y: 0.93, s: 12 },
    { e: '·', x: 0.25, y: 0.03, s: 16 },
    { e: '·', x: 0.75, y: 0.03, s: 16 },
    { e: '·', x: 0.50, y: 0.97, s: 16 },
  ],
  'ribbon': [
    { e: '🎀', x: 0.04, y: 0.04, s: 20 },
    { e: '🎀', x: 0.90, y: 0.05, s: 16 },
    { e: '🎀', x: 0.05, y: 0.94, s: 18 },
    { e: '🎀', x: 0.90, y: 0.93, s: 14 },
  ],
};

/* ===== PAGE NAVIGATION ===== */
function showPage(id, pushHistory) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  if (pushHistory !== false) {
    history.pushState({ page: id }, '', '#' + id);
  }
}

function goToLanding() {
  stopCamera();
  showPage('landing');
}

function goToBooth() {
  state.photos = [];
  updatePreview();
  updatePhotoCounter();
  showPage('booth');
  startCamera();
}

function goToResult() {
  stopCamera();
  const input = document.getElementById('caption-input');
  if (input) input.value = state.caption;
  showPage('result');
  renderStrip();
}

function handlePopState(e) {
  const pageId = (e.state && e.state.page) || getPageFromHash() || 'landing';
  const validPages = ['landing', 'booth', 'result', 'about', 'privacy'];
  if (!validPages.includes(pageId)) return;

  stopCamera();

  if (pageId === 'booth') {
    state.photos = [];
    updatePreview();
    updatePhotoCounter();
    showPage('booth', false);
    startCamera();
  } else if (pageId === 'result' && state.photos.length > 0) {
    const input = document.getElementById('caption-input');
    if (input) input.value = state.caption;
    showPage('result', false);
    renderStrip();
  } else if (pageId === 'result') {
    showPage('landing', false);
  } else {
    showPage(pageId, false);
  }
}

function getPageFromHash() {
  const hash = window.location.hash.replace('#', '');
  return hash || null;
}

window.addEventListener('popstate', handlePopState);

/* ===== CAMERA ===== */
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 1280 }, height: { ideal: 960 }, facingMode: state.facingMode },
      audio: false,
    });
    state.stream = stream;
    const video = document.getElementById('camera-feed');
    video.srcObject = stream;

    if (state.facingMode === 'user') {
      video.style.transform = 'scaleX(-1)';
    } else {
      video.style.transform = 'scaleX(1)';
    }

    applyLiveFilter();
    hideCameraWarning();
  } catch (err) {
    showCameraWarning();
  }
}

function stopCamera() {
  if (state.stream) {
    state.stream.getTracks().forEach(t => t.stop());
    state.stream = null;
    const video = document.getElementById('camera-feed');
    if (video) video.srcObject = null;
  }
}

async function flipCamera() {
  if (state.capturing) return;
  state.facingMode = state.facingMode === 'user' ? 'environment' : 'user';
  stopCamera();
  await startCamera();
}

/* ===== CAPTURE FLOW ===== */
function setSettingsLocked(locked) {
  const panel = document.querySelector('.settings-panel');
  if (!panel) return;
  panel.classList.toggle('locked', locked);
  panel.querySelectorAll('button').forEach(b => b.disabled = locked);
}

function startCapture() {
  if (state.capturing) return;

  if (!state.stream) {
    showCameraWarning();
    return;
  }

  state.capturing = true;
  state.photos = [];
  updatePreview();

  const btn = document.getElementById('btn-capture');
  btn.disabled = true;
  setSettingsLocked(true);

  captureNext(0);
}

function showCameraWarning() {
  let warning = document.getElementById('camera-warning');
  if (!warning) {
    warning = document.createElement('div');
    warning.id = 'camera-warning';
    warning.className = 'camera-warning';
    warning.innerHTML = `
      <p>Camera access is required to take photos.</p>
      <p>Please allow camera permissions in your browser and try again.</p>
      <button class="btn-primary" onclick="retryCameraAccess()" style="padding:10px 28px;font-size:0.8rem;">Allow Camera</button>
    `;
    document.querySelector('.camera-area').appendChild(warning);
  }
  warning.classList.add('visible');
}

function hideCameraWarning() {
  const warning = document.getElementById('camera-warning');
  if (warning) warning.classList.remove('visible');
}

async function retryCameraAccess() {
  await startCamera();
  if (state.stream) {
    hideCameraWarning();
  }
}

function captureNext(index) {
  const total = getPhotoCount();
  if (index >= total) {
    state.capturing = false;
    document.getElementById('btn-capture').disabled = false;
    setSettingsLocked(false);
    goToResult();
    return;
  }

  updatePhotoCounter(`Photo ${index + 1} of ${total}`);
  runCountdown(state.timer, () => {
    takePhoto();
    updatePreview();
    updatePhotoCounter(`Captured ${index + 1} of ${total}`);

    setTimeout(() => captureNext(index + 1), 800);
  });
}

function runCountdown(seconds, callback) {
  const overlay = document.getElementById('countdown-overlay');
  overlay.classList.add('visible');
  let remaining = seconds;

  function tick() {
    if (remaining <= 0) {
      overlay.classList.remove('visible');
      overlay.innerHTML = '';
      callback();
      return;
    }
    overlay.innerHTML = `<span class="countdown-number">${remaining}</span>`;
    remaining--;
    setTimeout(tick, 1000);
  }

  tick();
}

function takePhoto() {
  const video = document.getElementById('camera-feed');
  const canvas = document.getElementById('hidden-canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  if (state.facingMode === 'user') {
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    ctx.restore();
  } else {
    ctx.drawImage(video, 0, 0);
  }

  applyFilter(ctx, canvas.width, canvas.height);

  const dataUrl = canvas.toDataURL('image/png');
  state.photos.push(dataUrl);

  triggerFlash();
}

function triggerFlash() {
  const flash = document.getElementById('flash-overlay');
  flash.classList.remove('flash');
  void flash.offsetWidth;
  flash.classList.add('flash');
}

/* ===== FILTERS ===== */
function applyFilter(ctx, w, h) {
  if (state.filter === 'none') return;

  const imageData = ctx.getImageData(0, 0, w, h);
  const d = imageData.data;

  switch (state.filter) {
    case 'grayscale':
      for (let i = 0; i < d.length; i += 4) {
        const avg = d[i] * 0.299 + d[i+1] * 0.587 + d[i+2] * 0.114;
        d[i] = d[i+1] = d[i+2] = avg;
      }
      break;
    case 'sepia':
      for (let i = 0; i < d.length; i += 4) {
        const r = d[i], g = d[i+1], b = d[i+2];
        d[i]   = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
        d[i+1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
        d[i+2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
      }
      break;
    case 'warm':
      for (let i = 0; i < d.length; i += 4) {
        d[i]   = Math.min(255, d[i] + 20);
        d[i+1] = Math.min(255, d[i+1] + 10);
        d[i+2] = Math.max(0, d[i+2] - 15);
      }
      break;
    case 'cool':
      for (let i = 0; i < d.length; i += 4) {
        d[i]   = Math.max(0, d[i] - 15);
        d[i+1] = Math.min(255, d[i+1] + 5);
        d[i+2] = Math.min(255, d[i+2] + 25);
      }
      break;
    case 'vintage':
      for (let i = 0; i < d.length; i += 4) {
        const r = d[i], g = d[i+1], b = d[i+2];
        d[i]   = Math.min(255, r * 0.6 + g * 0.3 + b * 0.1 + 40);
        d[i+1] = Math.min(255, r * 0.2 + g * 0.5 + b * 0.1 + 20);
        d[i+2] = Math.min(255, r * 0.1 + g * 0.2 + b * 0.4 + 10);
      }
      break;
  }

  ctx.putImageData(imageData, 0, 0);
}

function applyLiveFilter() {
  const video = document.getElementById('camera-feed');
  if (!video) return;

  const cssFilters = {
    none: 'none',
    grayscale: 'grayscale(100%)',
    sepia: 'sepia(80%)',
    warm: 'saturate(1.3) hue-rotate(-10deg) brightness(1.05)',
    cool: 'saturate(1.1) hue-rotate(15deg) brightness(1.02)',
    vintage: 'sepia(40%) contrast(0.85) brightness(1.1) saturate(0.8)',
  };

  video.style.filter = cssFilters[state.filter] || 'none';
}

/* ===== PREVIEW ===== */
function updatePreview() {
  const strip = document.getElementById('preview-strip');
  const total = getPhotoCount();
  strip.innerHTML = '';

  for (let i = 0; i < total; i++) {
    if (state.photos[i]) {
      const div = document.createElement('div');
      div.className = 'preview-thumb';
      const img = document.createElement('img');
      img.src = state.photos[i];
      div.appendChild(img);
      strip.appendChild(div);
    } else {
      const div = document.createElement('div');
      div.className = 'preview-placeholder';
      div.textContent = `${i + 1}`;
      strip.appendChild(div);
    }
  }
}

function updatePhotoCounter(text) {
  document.getElementById('photo-counter').textContent = text || '';
}

/* ===== BORDER DRAWING ===== */
function fillBorder(ctx, w, h, borderDef) {
  if (borderDef.type === 'solid') {
    ctx.fillStyle = borderDef.color;
    ctx.fillRect(0, 0, w, h);

  } else if (borderDef.type === 'gradient') {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    borderDef.colors.forEach((c, i) => {
      grad.addColorStop(i / (borderDef.colors.length - 1), c);
    });
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

  } else if (borderDef.type === 'pattern') {
    ctx.fillStyle = borderDef.bg;
    ctx.fillRect(0, 0, w, h);
    drawPattern(ctx, w, h, borderDef.pattern, borderDef.bg);
  }
}

function drawPattern(ctx, w, h, pattern, bg) {
  ctx.save();

  switch (pattern) {
    case 'hearts': {
      ctx.fillStyle = '#f4a0b5';
      ctx.font = '18px serif';
      const spacing = 50;
      for (let y = 10; y < h; y += spacing) {
        for (let x = 10; x < w; x += spacing) {
          const offsetX = (Math.floor(y / spacing) % 2) * (spacing / 2);
          ctx.globalAlpha = 0.35;
          ctx.fillText('♥', x + offsetX, y);
        }
      }
      break;
    }
    case 'polkadots': {
      ctx.fillStyle = '#e8c87a';
      const dotR = 6, spacing = 36;
      for (let y = dotR; y < h; y += spacing) {
        for (let x = dotR; x < w; x += spacing) {
          const offsetX = (Math.floor(y / spacing) % 2) * (spacing / 2);
          ctx.globalAlpha = 0.3;
          ctx.beginPath();
          ctx.arc(x + offsetX, y, dotR, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      break;
    }
    case 'stripes': {
      ctx.strokeStyle = '#b8c5e8';
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.35;
      const gap = 16;
      for (let i = -h; i < w + h; i += gap) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + h, h);
        ctx.stroke();
      }
      break;
    }
    case 'confetti': {
      const confettiColors = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6eb4', '#a66cff'];
      const rng = mulberry32(42);
      for (let i = 0; i < 120; i++) {
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = confettiColors[Math.floor(rng() * confettiColors.length)];
        const cx = rng() * w, cy = rng() * h;
        const size = 4 + rng() * 6;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rng() * Math.PI);
        ctx.fillRect(-size / 2, -1.5, size, 3);
        ctx.restore();
      }
      break;
    }
    case 'floral': {
      ctx.globalAlpha = 0.3;
      ctx.font = '20px serif';
      const florals = ['✿', '❀', '❁', '✾'];
      const rng2 = mulberry32(77);
      for (let i = 0; i < 60; i++) {
        ctx.fillStyle = ['#e8a0bf', '#c9a0dc', '#f4a0a0', '#a0d4a0'][Math.floor(rng2() * 4)];
        ctx.fillText(florals[Math.floor(rng2() * florals.length)], rng2() * w, rng2() * h);
      }
      break;
    }
    case 'stars': {
      ctx.globalAlpha = 0.3;
      ctx.font = '14px serif';
      const rng3 = mulberry32(123);
      for (let i = 0; i < 70; i++) {
        ctx.fillStyle = ['#c9a0dc', '#a0b4dc', '#dca0d4'][Math.floor(rng3() * 3)];
        const sym = ['★', '☆', '✦'][Math.floor(rng3() * 3)];
        ctx.fillText(sym, rng3() * w, rng3() * h);
      }
      break;
    }
  }

  ctx.restore();
}

function mulberry32(seed) {
  return function() {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function getBorderBaseColor(borderDef) {
  if (borderDef.type === 'solid') return borderDef.color;
  if (borderDef.type === 'gradient') return borderDef.colors[0];
  return borderDef.bg;
}

/* ===== STRIP RENDERING ===== */
function renderStrip() {
  const canvas = document.getElementById('result-canvas');
  const ctx = canvas.getContext('2d');

  const borderDef = borders[state.border] || borders.white;
  const padding = 30;
  const gap = 16;
  const photoW = 400;
  const photoH = 300;
  const captionH = 60;

  let stripW, stripH, photoPositions = [];

  if (state.layout === 'classic-4' || state.layout === 'classic-3') {
    const count = state.layout === 'classic-4' ? 4 : 3;
    stripW = photoW + padding * 2;
    stripH = padding + (photoH + gap) * count - gap + padding + captionH;

    for (let i = 0; i < count; i++) {
      photoPositions.push({ x: padding, y: padding + i * (photoH + gap), w: photoW, h: photoH });
    }

  } else if (state.layout === 'grid-4') {
    stripW = photoW * 2 + gap + padding * 2;
    stripH = photoH * 2 + gap + padding * 2 + captionH;

    photoPositions = [
      { x: padding, y: padding, w: photoW, h: photoH },
      { x: padding + photoW + gap, y: padding, w: photoW, h: photoH },
      { x: padding, y: padding + photoH + gap, w: photoW, h: photoH },
      { x: padding + photoW + gap, y: padding + photoH + gap, w: photoW, h: photoH },
    ];

  } else if (state.layout === 'single') {
    stripW = photoW + padding * 2;
    stripH = photoH + padding * 2 + captionH;

    photoPositions = [{ x: padding, y: padding, w: photoW, h: photoH }];
  }

  canvas.width = stripW;
  canvas.height = stripH;

  fillBorder(ctx, stripW, stripH, borderDef);

  const count = photoPositions.length;
  const loadPromises = state.photos.slice(0, count).map((src, i) => {
    return loadImage(src).then(img => {
      drawCroppedImage(ctx, img, photoPositions[i].x, photoPositions[i].y, photoPositions[i].w, photoPositions[i].h);
    });
  });

  Promise.all(loadPromises).then(() => {
    drawStickers(ctx, stripW, stripH);
    drawCaption(ctx, stripW, stripH, borderDef);
  });
}

function drawCroppedImage(ctx, img, x, y, w, h) {
  const imgRatio = img.width / img.height;
  const targetRatio = w / h;
  let sx, sy, sw, sh;

  if (imgRatio > targetRatio) {
    sh = img.height;
    sw = sh * targetRatio;
    sx = (img.width - sw) / 2;
    sy = 0;
  } else {
    sw = img.width;
    sh = sw / targetRatio;
    sx = 0;
    sy = (img.height - sh) / 2;
  }

  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

function drawCaption(ctx, w, h, borderDef) {
  ctx.save();
  ctx.font = '18px "Sacramento", cursive';
  ctx.textAlign = 'center';

  const baseColor = getBorderBaseColor(borderDef);
  const isDark = isColorDark(baseColor);
  ctx.fillStyle = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)';

  const caption = state.caption || 'photobooth';
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  ctx.fillText(`${caption}  ·  ${dateStr}`, w / 2, h - 20);
  ctx.restore();
}

function drawStickers(ctx, w, h) {
  const stickers = stickerSets[state.sticker];
  if (!stickers || stickers.length === 0) return;

  const borderDef = borders[state.border] || borders.white;
  const baseColor = getBorderBaseColor(borderDef);
  const isDark = isColorDark(baseColor);

  stickers.forEach(s => {
    ctx.save();
    ctx.font = `${s.s}px serif`;
    ctx.globalAlpha = 0.7;

    if (!s.e.match(/[\u{1F300}-\u{1FAFF}]/u)) {
      ctx.fillStyle = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.45)';
    }

    ctx.fillText(s.e, s.x * w, s.y * h);
    ctx.restore();
  });
}

function isColorDark(hex) {
  if (!hex || hex[0] !== '#') return false;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 0.299 + g * 0.587 + b * 0.114) < 128;
}

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = src;
  });
}

/* ===== DOWNLOAD / SHARE / PRINT ===== */
function downloadStrip() {
  const canvas = document.getElementById('result-canvas');
  const link = document.createElement('a');
  link.download = `photobooth-${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

async function shareStrip() {
  const canvas = document.getElementById('result-canvas');

  try {
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    const file = new File([blob], 'photobooth.png', { type: 'image/png' });

    if (navigator.share && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: 'Photobooth',
        text: 'Check out my photobooth strip!',
      });
    } else {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      showToast('Copied to clipboard!');
    }
  } catch (err) {
    if (err.name !== 'AbortError') {
      showToast('Sharing not supported — try downloading instead');
    }
  }
}

function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.remove('visible');
  void toast.offsetWidth;
  toast.classList.add('visible');
  setTimeout(() => toast.classList.remove('visible'), 2500);
}

function printStrip() {
  const canvas = document.getElementById('result-canvas');
  const dataUrl = canvas.toDataURL('image/png');

  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
    <head><title>Print Photobooth Strip</title></head>
    <body style="margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#fff;">
      <img src="${dataUrl}" style="max-width:100%;max-height:100vh;" onload="window.print();window.close();">
    </body>
    </html>
  `);
  printWindow.document.close();
}

function retakePhotos() {
  state.photos = [];
  goToBooth();
}

/* ===== OPTION BUTTONS WIRING ===== */
function setupOptionButtons(containerId, stateKey, valueAttr, onChange) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn || !btn.hasAttribute(valueAttr)) return;

    container.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    let val = btn.getAttribute(valueAttr);
    if (stateKey === 'timer') val = parseInt(val);
    state[stateKey] = val;

    if (stateKey === 'layout') {
      state.photos = [];
      updatePreview();
      updatePhotoCounter();
    }

    if (stateKey === 'filter') {
      applyLiveFilter();
    }

    if (onChange) onChange();
  });
}

/* ===== CAPTION INPUT ===== */
function setupCaptionInput() {
  const input = document.getElementById('caption-input');
  if (!input) return;

  input.value = state.caption;
  input.maxLength = MAX_CAPTION_LENGTH;

  const counter = document.getElementById('caption-counter');

  function updateCounter() {
    if (counter) counter.textContent = `${input.value.length}/${MAX_CAPTION_LENGTH}`;
  }

  updateCounter();

  input.addEventListener('input', () => {
    state.caption = input.value;
    updateCounter();
    renderStrip();
  });
}

/* ===== THEME ===== */
function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  document.body.setAttribute('data-theme', state.theme);
  const icon = document.getElementById('theme-icon');
  if (icon) icon.textContent = state.theme === 'dark' ? '☀️' : '🌙';
}

/* ===== BORDER GROUP WIRING ===== */
function setupBorderGroups() {
  const allContainers = ['border-options', 'border-options-gradient', 'border-options-pattern'];

  function clearAllBorderActive() {
    allContainers.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    });
  }

  allContainers.forEach(id => {
    const container = document.getElementById(id);
    if (!container) return;
    container.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn || !btn.hasAttribute('data-border')) return;

      clearAllBorderActive();
      btn.classList.add('active');

      state.border = btn.getAttribute('data-border');
      renderStrip();
    });
  });
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  setupOptionButtons('layout-options', 'layout', 'data-layout');
  setupOptionButtons('filter-options', 'filter', 'data-filter');
  setupOptionButtons('timer-options', 'timer', 'data-timer');
  setupBorderGroups();
  setupOptionButtons('sticker-options', 'sticker', 'data-sticker', () => renderStrip());
  setupCaptionInput();

  const initialPage = getPageFromHash() || 'landing';
  const staticPages = ['landing', 'about', 'privacy'];
  if (staticPages.includes(initialPage)) {
    showPage(initialPage, false);
    history.replaceState({ page: initialPage }, '', '#' + initialPage);
  } else {
    showPage('landing', false);
    history.replaceState({ page: 'landing' }, '', '#landing');
  }
});
