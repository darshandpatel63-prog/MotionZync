// useScenes.js — NEW
// localStorage-based scene save / load / delete / rename / duplicate
// Key format: mz_scene_<id>  |  mz_scene_index (list of ids + meta)

const INDEX_KEY = 'mz_scene_index'
const PREFIX    = 'mz_scene_'

// ── Helpers ───────────────────────────────────────────────────
function readIndex() {
  try { return JSON.parse(localStorage.getItem(INDEX_KEY) || '[]') }
  catch { return [] }
}
function writeIndex(idx) {
  localStorage.setItem(INDEX_KEY, JSON.stringify(idx))
}
function readScene(id) {
  try { return JSON.parse(localStorage.getItem(PREFIX + id) || 'null') }
  catch { return null }
}
function writeScene(id, data) {
  localStorage.setItem(PREFIX + id, JSON.stringify(data))
}
function removeScene(id) {
  localStorage.removeItem(PREFIX + id)
}
function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

// ── Public API (called directly — no React hook needed) ───────
export const scenesAPI = {

  /** List all scene metadata */
  list() {
    return readIndex().map(meta => ({ ...meta }))
  },

  /** Save current state as a scene (create new or overwrite) */
  save(state, { id = null, name = null } = {}) {
    const sceneId   = id || newId()
    const sceneName = name || `Scene ${new Date().toLocaleString('en-GB',{hour:'2-digit',minute:'2-digit',day:'2-digit',month:'short'})}`
    const thumbnail = _makeThumbnail(state.elements)

    const sceneData = {
      id:        sceneId,
      name:      sceneName,
      savedAt:   Date.now(),
      elements:  state.elements.map(e => _stripRuntime(e)),
      bgColor:   state.bgColor,
      showGrid:  state.showGrid,
      showGuides:state.showGuides,
      thumbnail,
    }

    // Update index
    const idx     = readIndex()
    const existing = idx.findIndex(m => m.id === sceneId)
    const meta = { id:sceneId, name:sceneName, savedAt:Date.now(), thumbnail, elementCount: state.elements.length }
    if (existing >= 0) idx[existing] = meta
    else               idx.unshift(meta)
    writeIndex(idx)
    writeScene(sceneId, sceneData)
    return sceneData
  },

  /** Load a scene by id — returns scene data */
  load(id) {
    return readScene(id)
  },

  /** Delete a scene */
  delete(id) {
    removeScene(id)
    writeIndex(readIndex().filter(m => m.id !== id))
  },

  /** Rename a scene */
  rename(id, newName) {
    const idx   = readIndex()
    const meta  = idx.find(m => m.id === id)
    if (meta) { meta.name = newName; writeIndex(idx) }
    const data  = readScene(id)
    if (data)  { data.name = newName; writeScene(id, data) }
  },

  /** Duplicate a scene */
  duplicate(id) {
    const data = readScene(id)
    if (!data) return null
    const newSceneId = newId()
    const copy = { ...data, id:newSceneId, name:`${data.name} (copy)`, savedAt:Date.now() }
    const idx  = readIndex()
    const meta = idx.find(m => m.id === id)
    if (meta) {
      const i = idx.indexOf(meta)
      idx.splice(i+1, 0, { ...meta, id:newSceneId, name:copy.name, savedAt:Date.now() })
    }
    writeIndex(idx)
    writeScene(newSceneId, copy)
    return copy
  },

  /** Total localStorage usage estimate (bytes) */
  storageInfo() {
    let used = 0
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k?.startsWith('mz_')) used += (localStorage.getItem(k)||'').length * 2
    }
    return { usedBytes: used, usedKB: Math.round(used/1024) }
  },
}

// ── Strip heavy runtime physics state before saving ───────────
function _stripRuntime(el) {
  const { physics, ...rest } = el
  return {
    ...rest,
    physics: physics ? {
      enabled:   physics.enabled,
      mode:      physics.mode,
      gravity:   physics.gravity,
      bounce:    physics.bounce,
      mass:      physics.mass,
      friction:  physics.friction,
      wind:      physics.wind,
      magnetic:  physics.magnetic,
      stiffness: physics.stiffness,
      damping:   physics.damping,
      // strip vx/vy/ax/ay/_floatT etc.
    } : physics,
  }
}

// ── Mini canvas thumbnail (returns data URL or empty string) ──
function _makeThumbnail(elements) {
  try {
    const cv  = document.createElement('canvas')
    cv.width  = 180; cv.height = 116
    const ctx = cv.getContext('2d')
    ctx.fillStyle = '#0a0a0f'
    ctx.fillRect(0,0,180,116)
    const sx = 180/900, sy = 116/580
    elements.slice(0,12).forEach(el => {
      if (el.visible===false) return
      ctx.save()
      ctx.globalAlpha = el.opacity||1
      ctx.fillStyle   = el.fill || '#7c3aed'
      const x=el.x*sx, y=el.y*sy, w=(el.width||60)*sx, h=(el.height||60)*sy
      if (el.type==='circle') {
        ctx.beginPath(); ctx.ellipse(x+w/2,y+h/2,w/2,h/2,0,0,Math.PI*2); ctx.fill()
      } else if (el.type==='triangle') {
        ctx.beginPath(); ctx.moveTo(x+w/2,y); ctx.lineTo(x+w,y+h); ctx.lineTo(x,y+h); ctx.closePath(); ctx.fill()
      } else {
        ctx.beginPath(); ctx.roundRect(x,y,w,h,2); ctx.fill()
      }
      ctx.restore()
    })
    return cv.toDataURL('image/webp', 0.6)
  } catch { return '' }
      }
    
