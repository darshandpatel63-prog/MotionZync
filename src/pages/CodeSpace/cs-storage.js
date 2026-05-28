// ============================================================
// cs-storage.js  –  IndexedDB + localStorage storage engine
// All user code stays on device. Zero server uploads.
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
  await openDB()
  return wrap(tx(STORE_PROJ).getAll())
}

export async function getProject(id) {
  await openDB()
  return wrap(tx(STORE_PROJ).get(id))
}

export async function saveProject(proj) {
  await openDB()
  return wrap(tx(STORE_PROJ, 'readwrite').put({ ...proj, updatedAt: Date.now() }))
}

export async function deleteProject(id) {
  await openDB()
  const store = tx(STORE_PROJ, 'readwrite')
  await wrap(store.delete(id))
  // Also delete all snapshots for this project
  await deleteSnapshots(id)
}

// ── Snapshots (version history) ───────────────────────────────
export async function getSnapshots(projectId) {
  await openDB()
  const idx = tx(STORE_SNAP).index('projectId')
  const req  = idx.getAll(IDBKeyRange.only(projectId))
  return wrap(req)
}

export async function addSnapshot(projectId, files, message = '') {
  await openDB()
  const snaps = await getSnapshots(projectId)
  if (snaps.length >= 50) {
    // Remove oldest
    const oldest = snaps.sort((a, b) => a.ts - b.ts)[0]
    await wrap(tx(STORE_SNAP, 'readwrite').delete(oldest.id))
  }
  return wrap(tx(STORE_SNAP, 'readwrite').add({
    projectId,
    files,
    message,
    ts: Date.now(),
  }))
}

export async function deleteSnapshots(projectId) {
  await openDB()
  const snaps = await getSnapshots(projectId)
  const t = _db.transaction(STORE_SNAP, 'readwrite').objectStore(STORE_SNAP)
  for (const s of snaps) await wrap(t.delete(s.id))
}

// ── Config (editor settings, themes, etc.) ────────────────────
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
  try {
    const data = JSON.stringify(files)
    return btoa(unescape(encodeURIComponent(data)))
  } catch { return '' }
}

export function decodeShare(str) {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(str))))
  } catch { return null }
}

// ── ZIP export (pure browser, no lib needed) ──────────────────
// Uses a minimal CRC32 + Deflate-stored approach
export async function exportProjectZip(project) {
  const files = project.files || {}
  const entries = []

  for (const [path, content] of Object.entries(files)) {
    const data    = new TextEncoder().encode(content)
    const dosDate = dosDateTime(new Date())
    entries.push({ path, data, dosDate })
  }

  const zip = buildZip(entries)
  const blob = new Blob([zip], { type: 'application/zip' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `${project.name || 'project'}.zip`
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}

function dosDateTime(d) {
  const date = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate()
  const time = (d.getHours() << 11) | (d.getMinutes() << 5) | Math.floor(d.getSeconds() / 2)
  return { date, time }
}

function crc32(data) {
  let crc = 0xFFFFFFFF
  const table = crc32Table()
  for (let i = 0; i < data.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ data[i]) & 0xFF]
  }
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

function uint16LE(n, buf, off) { buf[off] = n & 0xFF; buf[off + 1] = (n >> 8) & 0xFF }
function uint32LE(n, buf, off) {
  buf[off]   =  n        & 0xFF; buf[off+1] = (n >>  8) & 0xFF
  buf[off+2] = (n >> 16) & 0xFF; buf[off+3] = (n >> 24) & 0xFF
}

function buildZip(entries) {
  const localHeaders = []
  const centralDir   = []
  let offset = 0

  for (const { path, data, dosDate } of entries) {
    const nameBytes = new TextEncoder().encode(path)
    const crc       = crc32(data)
    const size      = data.length

    // Local file header
    const lh = new Uint8Array(30 + nameBytes.length + size)
    let p = 0
    lh.set([0x50,0x4B,0x03,0x04], p); p += 4  // signature
    uint16LE(20,   lh, p); p += 2  // version needed
    uint16LE(0,    lh, p); p += 2  // flags
    uint16LE(0,    lh, p); p += 2  // compression (stored)
    uint16LE(dosDate.time, lh, p); p += 2
    uint16LE(dosDate.date, lh, p); p += 2
    uint32LE(crc,  lh, p); p += 4
    uint32LE(size, lh, p); p += 4
    uint32LE(size, lh, p); p += 4
    uint16LE(nameBytes.length, lh, p); p += 2
    uint16LE(0,    lh, p); p += 2  // extra field len
    lh.set(nameBytes, p); p += nameBytes.length
    lh.set(data, p)

    // Central dir entry
    const cd = new Uint8Array(46 + nameBytes.length)
    let q = 0
    cd.set([0x50,0x4B,0x01,0x02], q); q += 4
    uint16LE(20,   cd, q); q += 2
    uint16LE(20,   cd, q); q += 2
    uint16LE(0,    cd, q); q += 2
    uint16LE(0,    cd, q); q += 2
    uint16LE(dosDate.time, cd, q); q += 2
    uint16LE(dosDate.date, cd, q); q += 2
    uint32LE(crc,  cd, q); q += 4
    uint32LE(size, cd, q); q += 4
    uint32LE(size, cd, q); q += 4
    uint16LE(nameBytes.length, cd, q); q += 2
    uint16LE(0,    cd, q); q += 2
    uint16LE(0,    cd, q); q += 2
    uint16LE(0,    cd, q); q += 2
    uint16LE(0,    cd, q); q += 2
    uint32LE(0,    cd, q); q += 4
    uint32LE(offset, cd, q); q += 4
    cd.set(nameBytes, q)

    localHeaders.push(lh)
    centralDir.push(cd)
    offset += lh.length
  }

  const cdSize   = centralDir.reduce((s, c) => s + c.length, 0)
  const eocd     = new Uint8Array(22)
  eocd.set([0x50,0x4B,0x05,0x06])
  uint16LE(0, eocd, 4); uint16LE(0, eocd, 6)
  uint16LE(entries.length, eocd, 8); uint16LE(entries.length, eocd, 10)
  uint32LE(cdSize, eocd, 12); uint32LE(offset, eocd, 16)
  uint16LE(0, eocd, 20)

  const parts = [...localHeaders, ...centralDir, eocd]
  const total = parts.reduce((s, p) => s + p.length, 0)
  const out   = new Uint8Array(total)
  let at = 0
  for (const p of parts) { out.set(p, at); at += p.length }
  return out
}
