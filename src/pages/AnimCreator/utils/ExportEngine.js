// ExportEngine.js — NEW
// PNG screenshot via html2canvas-like DOM-to-canvas
// MP4 screen record via MediaRecorder API
// ZIP bundle via native Blob

// ─── PNG Screenshot ───────────────────────────────────────────
// Uses html2canvas (loaded from CDN if available) with DOM fallback
export async function exportPNG(stageEl, filename = 'scene.png') {
  if (!stageEl) throw new Error('No stage element found')

  let canvas

  // Try html2canvas first (CDN-loaded)
  if (window.html2canvas) {
    canvas = await window.html2canvas(stageEl, {
      backgroundColor: null,
      scale:           2,          // 2x retina
      useCORS:         true,
      allowTaint:      true,
      logging:         false,
      width:           stageEl.offsetWidth,
      height:          stageEl.offsetHeight,
    })
  } else {
    // Fallback: native canvas drawImage if html2canvas not available
    canvas = document.createElement('canvas')
    const dpr = window.devicePixelRatio || 1
    canvas.width  = stageEl.offsetWidth  * dpr
    canvas.height = stageEl.offsetHeight * dpr
    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)
    // Basic background fill
    const bg = getComputedStyle(stageEl).background || '#0a0a0f'
    ctx.fillStyle = bg; ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.font = '16px sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.4)'
    ctx.textAlign = 'center'
    ctx.fillText('Install html2canvas for full PNG export', canvas.width/(2*dpr), canvas.height/(2*dpr))
  }

  const url = canvas.toDataURL('image/png')
  _triggerDownload(url, filename)
  return url
}

// ─── MP4 / WEBM Screen Record ─────────────────────────────────
// Records the canvas area using MediaRecorder + getDisplayMedia fallback
export class ScreenRecorder {
  constructor() {
    this.mediaRecorder = null
    this.chunks        = []
    this.stream        = null
    this.onStop        = null
  }

  // Start recording from a canvas element
  async startFromCanvas(canvasEl, fps = 30) {
    if (!canvasEl) throw new Error('No canvas element')
    this.chunks = []

    // captureStream is widely supported
    if (!canvasEl.captureStream) throw new Error('captureStream not supported in this browser')
    this.stream = canvasEl.captureStream(fps)

    const mimeType = _bestMimeType()
    this.mediaRecorder = new MediaRecorder(this.stream, {
      mimeType,
      videoBitsPerSecond: 4_000_000,
    })
    this.mediaRecorder.ondataavailable = e => {
      if (e.data?.size > 0) this.chunks.push(e.data)
    }
    this.mediaRecorder.start(100)
    return mimeType
  }

  // Start recording from a DOM element using getDisplayMedia
  async startFromScreen() {
    this.chunks = []
    try {
      this.stream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 30, cursor: 'never' },
        audio: false,
      })
    } catch (e) {
      throw new Error('Screen capture permission denied')
    }
    const mimeType = _bestMimeType()
    this.mediaRecorder = new MediaRecorder(this.stream, {
      mimeType,
      videoBitsPerSecond: 4_000_000,
    })
    this.mediaRecorder.ondataavailable = e => {
      if (e.data?.size > 0) this.chunks.push(e.data)
    }
    this.mediaRecorder.start(100)
    return mimeType
  }

  stop(filename = 'animation') {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) { reject(new Error('Not recording')); return }
      this.mediaRecorder.onstop = () => {
        const mimeType = this.mediaRecorder.mimeType
        const ext      = mimeType.includes('mp4') ? 'mp4' : 'webm'
        const blob     = new Blob(this.chunks, { type: mimeType })
        const url      = URL.createObjectURL(blob)
        _triggerDownload(url, `${filename}.${ext}`)
        this.stream?.getTracks().forEach(t => t.stop())
        this.chunks = []
        resolve({ url, blob, ext })
      }
      this.mediaRecorder.stop()
    })
  }

  get isRecording() {
    return this.mediaRecorder?.state === 'recording'
  }
}

// ─── ZIP bundle (HTML + assets) ──────────────────────────────
// Creates a simple in-memory zip using Blob
// For proper ZIP we use a pure-JS implementation
export async function exportZIP(files, zipName = 'animation.zip') {
  // files: [{ name: string, content: string }]
  // Simple approach: if JSZip available use it, else download each file
  if (window.JSZip) {
    const zip = new window.JSZip()
    files.forEach(f => zip.file(f.name, f.content))
    const blob = await zip.generateAsync({ type:'blob', compression:'DEFLATE' })
    const url  = URL.createObjectURL(blob)
    _triggerDownload(url, zipName)
    URL.revokeObjectURL(url)
    return true
  } else {
    // Fallback: download files individually
    files.forEach((f, i) => {
      setTimeout(() => {
        const blob = new Blob([f.content], { type:'text/plain' })
        const url  = URL.createObjectURL(blob)
        _triggerDownload(url, f.name)
        URL.revokeObjectURL(url)
      }, i * 300)
    })
    return false
  }
}

// ─── Helpers ─────────────────────────────────────────────────
function _triggerDownload(url, filename) {
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.style.display = 'none'
  document.body.appendChild(a); a.click()
  document.body.removeChild(a)
  if (url.startsWith('blob:')) setTimeout(() => URL.revokeObjectURL(url), 5000)
}

function _bestMimeType() {
  const types = [
    'video/mp4;codecs=h264',
    'video/mp4',
    'video/webm;codecs=h264',
    'video/webm;codecs=vp9',
    'video/webm',
  ]
  return types.find(t => MediaRecorder.isTypeSupported?.(t)) || 'video/webm'
}

// ─── Load html2canvas from CDN (lazy) ────────────────────────
export function loadHtml2Canvas() {
  if (window.html2canvas) return Promise.resolve(true)
  return new Promise((resolve) => {
    const s = document.createElement('script')
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
    s.onload  = () => resolve(true)
    s.onerror = () => resolve(false)
    document.head.appendChild(s)
  })
}

