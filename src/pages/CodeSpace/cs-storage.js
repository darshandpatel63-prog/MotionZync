// ============================================================
// cs-storage.js  –  IndexedDB engine + ZIP export + ZIP import
// All code stays on device. Zero server storage.
// ============================================================

const DB_NAME    = 'CodeSpaceDB'
const DB_VERSION = 2
const STORE_PROJ = 'projects'
const STORE_SNAP = 'snapshots'
const STORE_CONF = 'config'

let _db = null

export function openDB() {
  if (_db) return Promise.resolve(_db)
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = e => {
      const db = e.target.result
      if (!db.objectStoreNames.contains(STORE_PROJ)) {
        const s = db.createObjectStore(STORE_PROJ, { keyPath: 'id' })
        s.createIndex('updatedAt', 'updatedAt')
      }
      if (!db.objectStoreNames.contains(STORE_SNAP)) {
        const s = db.createObjectStore(STORE_SNAP, { keyPath: 'id', autoIncrement: true })
        s.createIndex('projectId', 'projectId')
      }
      if (!db.objectStoreNames.contains(STORE_CONF)) {
        db.createObjectStore(STORE_CONF, { keyPath: 'key' })
      }
    }
    req.onsuccess = e => { _db = e.target.result; resolve(_db) }
    req.onerror   = () => reject(req.error)
  })
}

function tx(storeName, mode = 'readonly') {
  return _db.transaction(storeName, mode).objectStore(storeName)
}
function wrap(req) {
  return new Promise((res, rej) => {
    req.onsuccess = () => res(req.result)
    req.onerror   = () => rej(req.error)
  })
}

// ── Projects ──────────────────────────────────────────────────
export async function getAllProjects() {
  await openDB(); return wrap(tx(STORE_PROJ).getAll())
}
export async function getProject(id) {
  await openDB(); return wrap(tx(STORE_PROJ).get(id))
}
export async function saveProject(proj) {
  await openDB()
  return wrap(tx(STORE_PROJ, 'readwrite').put({ ...proj, updatedAt: Date.now() }))
}
export async function deleteProject(id) {
  await openDB()
  await wrap(tx(STORE_PROJ, 'readwrite').delete(id))
  await deleteSnapshots(id)
}

// ── Snapshots ─────────────────────────────────────────────────
export async function getSnapshots(projectId) {
  await openDB()
  return wrap(tx(STORE_SNAP).index('projectId').getAll(IDBKeyRange.only(projectId)))
}
export async function addSnapshot(projectId, files, message = '') {
  await openDB()
  const snaps = await getSnapshots(projectId)
  if (snaps.length >= 50) {
    const oldest = snaps.sort((a, b) => a.ts - b.ts)[0]
    await wrap(tx(STORE_SNAP, 'readwrite').delete(oldest.id))
  }
  return wrap(tx(STORE_SNAP, 'readwrite').add({ projectId, files, message, ts: Date.now() }))
}
export async function deleteSnapshots(projectId) {
  await openDB()
  const snaps = await getSnapshots(projectId)
  const t = _db.transaction(STORE_SNAP, 'readwrite').objectStore(STORE_SNAP)
  for (const s of snaps) await wrap(t.delete(s.id))
}

// ── Config ────────────────────────────────────────────────────
export async function getConfig(key, fallback = null) {
  await openDB()
  const result = await wrap(tx(STORE_CONF).get(key))
  return result ? result.value : fallback
}
export async function setConfig(key, value) {
  await openDB()
  return wrap(tx(STORE_CONF, 'readwrite').put({ key, value }))
}

// ── Utilities ─────────────────────────────────────────────────
export function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}
export function encodeShare(files) {
  try { return btoa(unescape(encodeURIComponent(JSON.stringify(files)))) } catch { return '' }
}
export function decodeShare(str) {
  try { return JSON.parse(decodeURIComponent(escape(atob(str)))) } catch { return null }
}

// ── ZIP Export ────────────────────────────────────────────────
export async function exportProjectZip(project) {
  const files   = project.files || {}
  const entries = []
  for (const [path, content] of Object.entries(files)) {
    const data    = new TextEncoder().encode(content)
    const dosDate = dosDateTime(new Date())
    entries.push({ path, data, dosDate })
  }
  const zip  = buildZip(entries)
  const blob = new Blob([zip], { type: 'application/zip' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url; a.download = `${project.name || 'project'}.zip`; a.click()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}

// ── ZIP Import ────────────────────────────────────────────────
// Loads JSZip from CDN then parses the zip file
export async function importZipFile(file) {
  const JSZip = await loadJSZip()
  const zip   = await JSZip.loadAsync(file)
  const files = {}
  const promises = []

  zip.forEach((relativePath, zipEntry) => {
    if (zipEntry.dir) return
    // Skip hidden system files
    if (relativePath.includes('__MACOSX') || relativePath.includes('.DS_Store')) return
    const p = zipEntry.async('string').then(content => {
      // Clean up leading folder name if all files share one root folder
      files[relativePath] = content
    })
    promises.push(p)
  })

  await Promise.all(promises)

  // Strip common root prefix (e.g. "myproject/src/..." → "src/...")
  const keys  = Object.keys(files)
  if (keys.length === 0) return {}
  const parts = keys[0].split('/')
  if (parts.length > 1) {
    const root = parts[0]
    const allShareRoot = keys.every(k => k.startsWith(root + '/'))
    if (allShareRoot) {
      const stripped = {}
      for (const [k, v] of Object.entries(files)) {
        stripped[k.slice(root.length + 1)] = v
      }
      return stripped
    }
  }
  return files
}

async function loadJSZip() {
  if (window.JSZip) return window.JSZip
  return new Promise((resolve, reject) => {
    const s   = document.createElement('script')
    s.src     = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'
    s.onload  = () => resolve(window.JSZip)
    s.onerror = () => reject(new Error('Failed to load JSZip'))
    document.head.appendChild(s)
  })
}

// ── ZIP builder helpers ───────────────────────────────────────
function dosDateTime(d) {
  return {
    date: ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate(),
    time: (d.getHours() << 11) | (d.getMinutes() << 5) | Math.floor(d.getSeconds() / 2),
  }
}
function crc32(data) {
  let crc = 0xFFFFFFFF
  const t = crc32Table()
  for (let i = 0; i < data.length; i++) crc = (crc >>> 8) ^ t[(crc ^ data[i]) & 0xFF]
  return (crc ^ 0xFFFFFFFF) >>> 0
}
let _crcTable = null
function crc32Table() {
  if (_crcTable) return _crcTable
  _crcTable = new Uint32Array(256)
  for (let i = 0; i < 256; i++) {
    let c = i
    for (let j = 0; j < 8; j++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1
    _crcTable[i] = c
  }
  return _crcTable
}
function u16(n, b, o) { b[o] = n & 0xFF; b[o+1] = (n >> 8) & 0xFF }
function u32(n, b, o) { b[o]=n&0xFF; b[o+1]=(n>>8)&0xFF; b[o+2]=(n>>16)&0xFF; b[o+3]=(n>>24)&0xFF }
function buildZip(entries) {
  const lh = []; const cd = []; let off = 0
  for (const { path, data, dosDate } of entries) {
    const nb = new TextEncoder().encode(path)
    const cr = crc32(data); const sz = data.length
    const h  = new Uint8Array(30 + nb.length + sz)
    let p = 0
    h.set([0x50,0x4B,0x03,0x04],p);p+=4; u16(20,h,p);p+=2; u16(0,h,p);p+=2; u16(0,h,p);p+=2
    u16(dosDate.time,h,p);p+=2; u16(dosDate.date,h,p);p+=2; u32(cr,h,p);p+=4
    u32(sz,h,p);p+=4; u32(sz,h,p);p+=4; u16(nb.length,h,p);p+=2; u16(0,h,p);p+=2
    h.set(nb,p);p+=nb.length; h.set(data,p)
    const c = new Uint8Array(46 + nb.length)
    let q = 0
    c.set([0x50,0x4B,0x01,0x02],q);q+=4; u16(20,c,q);q+=2; u16(20,c,q);q+=2; u16(0,c,q);q+=2
    u16(0,c,q);q+=2; u16(dosDate.time,c,q);q+=2; u16(dosDate.date,c,q);q+=2; u32(cr,c,q);q+=4
    u32(sz,c,q);q+=4; u32(sz,c,q);q+=4; u16(nb.length,c,q);q+=2; u16(0,c,q);q+=2; u16(0,c,q);q+=2
    u16(0,c,q);q+=2; u16(0,c,q);q+=2; u32(0,c,q);q+=4; u32(off,c,q);q+=4; c.set(nb,q)
    lh.push(h); cd.push(c); off += h.length
  }
  const cdsz = cd.reduce((s,c) => s+c.length, 0)
  const eo   = new Uint8Array(22)
  eo.set([0x50,0x4B,0x05,0x06])
  u16(0,eo,4); u16(0,eo,6); u16(entries.length,eo,8); u16(entries.length,eo,10)
  u32(cdsz,eo,12); u32(off,eo,16); u16(0,eo,20)
  const parts = [...lh,...cd,eo]
  const total = parts.reduce((s,p) => s+p.length,0)
  const out   = new Uint8Array(total); let at = 0
  for (const p of parts) { out.set(p,at); at+=p.length }
  return out
    }
  
