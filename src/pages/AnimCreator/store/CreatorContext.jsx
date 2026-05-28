// CreatorContext.jsx — UPDATED (Feature 7)
// Multi-scene system: each scene has its own elements, history, bg, grid state
// Active scene's data is surfaced at top level (elements, selected, etc.)
// All existing actions operate on the active scene — no breaking changes

import { createContext, useContext, useReducer, useCallback } from 'react'

// ─── Default element template ─────────────────────────────────
export function makeElement(type, x, y) {
  const id = 'el_' + Date.now() + '_' + Math.random().toString(36).slice(2,6)
  return {
    id, type, x, y,
    width:  type==='text'?160 : type==='circle'?80 : type==='line'?120 : 100,
    height: type==='text'?44  : type==='circle'?80 : type==='line'?6   : 100,
    rotation: 0, opacity: 1,
    fill: '#7c3aed', stroke:'transparent', strokeWidth:0,
    label: type==='text'?'Text': type.charAt(0).toUpperCase()+type.slice(1),
    fontSize:20, fontWeight:'700', fontColor:'#ffffff',
    borderRadius: type==='circle'?50 : type==='rect'?8 : 0,
    gradient: null,
    shadow:     { enabled:false, color:'#7c3aed', blur:20, x:0, y:0 },
    glow:       { enabled:false, color:'#7c3aed', intensity:20 },
    anim:       { name:'none', duration:2, delay:0, easing:'ease-in-out', loop:true, direction:'normal' },
    physics:    { enabled:false, mode:'none', gravity:0.3, bounce:0.6, mass:1, friction:0.08,
                  wind:0, magnetic:0, stiffness:0.15, damping:0.85,
                  vx:0, vy:0, ax:0, ay:0, restX:0, restY:0, sleeping:false },
    borderAnim: { enabled:false, type:'neon', color:'#06b6d4', speed:2, thickness:2, glow:15 },
    effects:    { blur:0, brightness:100, contrast:100, saturate:100, hueRotate:0 },
    visible:true, locked:false, zIndex:0, _selected:false,
  }
}

// ─── Scene factory ────────────────────────────────────────────
function makeScene(name = 'Scene 1', id = null) {
  return {
    id:         id || 'sc_' + Date.now() + '_' + Math.random().toString(36).slice(2,5),
    name,
    elements:   [],
    selected:   [],
    history:    [],
    future:     [],
    bgColor:    '#0a0a0f',
    showGrid:   true,
    showGuides: true,
    zoom:       1,
    panX:       0,
    panY:       0,
  }
}

// ─── Snapshot helpers ─────────────────────────────────────────
function snap(sc) { return { elements:sc.elements.map(e=>({...e})), selected:[...sc.selected] } }
function pushH(sc) {
  const h = [...sc.history, snap(sc)]
  return h.length > 50 ? h.slice(-50) : h
}

// ─── Active scene reducer (all per-scene ops) ─────────────────
function sceneReducer(sc, action) {
  switch (action.type) {
    case 'ADD_ELEMENT': {
      const el = { ...action.el, zIndex: sc.elements.length }
      return { ...sc, elements:[...sc.elements,el], selected:[el.id], history:pushH(sc) }
    }
    case 'UPDATE_ELEMENT':
      return { ...sc, elements: sc.elements.map(e=>e.id===action.id?{...e,...action.patch}:e) }
    case 'UPDATE_ELEMENT_HIST':
      return { ...sc, elements: sc.elements.map(e=>e.id===action.id?{...e,...action.patch}:e), history:pushH(sc) }
    case 'DELETE_ELEMENTS': {
      const ids = new Set(action.ids)
      return { ...sc, elements:sc.elements.filter(e=>!ids.has(e.id)), selected:[], history:pushH(sc) }
    }
    case 'DUPLICATE_ELEMENT': {
      const src = sc.elements.find(e=>e.id===action.id); if(!src) return sc
      const dup = { ...src, id:'el_'+Date.now()+'_'+Math.random().toString(36).slice(2,6), x:src.x+20, y:src.y+20, zIndex:sc.elements.length }
      return { ...sc, elements:[...sc.elements,dup], selected:[dup.id], history:pushH(sc) }
    }
    case 'PASTE_ELEMENTS': {
      const pasted = action.els.map((el,i)=>({ ...el, id:'el_'+Date.now()+'_'+Math.random().toString(36).slice(2,6)+'_'+i, x:el.x+24, y:el.y+24, zIndex:sc.elements.length+i }))
      return { ...sc, elements:[...sc.elements,...pasted], selected:pasted.map(e=>e.id), history:pushH(sc) }
    }
    case 'SELECT':         return { ...sc, selected:action.ids }
    case 'SET_ZOOM':       return { ...sc, zoom:Math.max(0.15,Math.min(4,action.zoom)) }
    case 'SET_PAN':        return { ...sc, panX:action.x, panY:action.y }
    case 'SET_BG_COLOR':   return { ...sc, bgColor:action.color }
    case 'SET_SHOW_GRID':  return { ...sc, showGrid:action.value }
    case 'SET_SHOW_GUIDES':return { ...sc, showGuides:action.value }
    case 'CLEAR_SCENE':    return { ...sc, elements:[], selected:[], history:pushH(sc) }
    case 'LOAD_ELEMENTS':  return { ...sc, elements:action.elements }
    case 'REORDER': {
      const els = [...sc.elements]
      const [moved] = els.splice(action.from,1)
      els.splice(action.to,0,moved)
      return { ...sc, elements:els.map((e,i)=>({...e,zIndex:i})), history:pushH(sc) }
    }
    case 'UNDO': {
      if (!sc.history.length) return sc
      const prev = sc.history[sc.history.length-1]
      return { ...sc, elements:prev.elements, selected:prev.selected, history:sc.history.slice(0,-1), future:[snap(sc),...sc.future] }
    }
    case 'REDO': {
      if (!sc.future.length) return sc
      const next = sc.future[0]
      return { ...sc, elements:next.elements, selected:next.selected, future:sc.future.slice(1), history:[...sc.history,snap(sc)] }
    }
    default: return sc
  }
}

// ─── Top-level reducer ────────────────────────────────────────
function reducer(state, action) {
  // Scene management actions
  switch (action.type) {

    // ── Add new scene ────────────────────────────────────────
    case 'ADD_SCENE': {
      const sc  = makeScene(action.name || `Scene ${state.scenes.length+1}`)
      return { ...state, scenes:[...state.scenes, sc], activeSceneId:sc.id }
    }

    // ── Switch active scene ──────────────────────────────────
    case 'SWITCH_SCENE': {
      if (!state.scenes.find(s=>s.id===action.id)) return state
      return { ...state, activeSceneId: action.id }
    }

    // ── Delete scene (min 1 must remain) ─────────────────────
    case 'DELETE_SCENE': {
      if (state.scenes.length <= 1) return state
      const newScenes = state.scenes.filter(s=>s.id!==action.id)
      const newActive = state.activeSceneId===action.id
        ? newScenes[Math.max(0, state.scenes.findIndex(s=>s.id===action.id)-1)].id
        : state.activeSceneId
      return { ...state, scenes:newScenes, activeSceneId:newActive }
    }

    // ── Rename scene ─────────────────────────────────────────
    case 'RENAME_SCENE':
      return { ...state, scenes:state.scenes.map(s=>s.id===action.id?{...s,name:action.name}:s) }

    // ── Duplicate scene ──────────────────────────────────────
    case 'DUPLICATE_SCENE': {
      const src = state.scenes.find(s=>s.id===action.id); if(!src) return state
      const dup = { ...src, id:'sc_'+Date.now()+'_'+Math.random().toString(36).slice(2,5),
                    name: src.name+' (copy)', history:[], future:[] }
      const idx = state.scenes.indexOf(src)
      const newScenes = [...state.scenes]
      newScenes.splice(idx+1, 0, dup)
      return { ...state, scenes:newScenes, activeSceneId:dup.id }
    }

    // ── Reorder scenes (drag tab) ────────────────────────────
    case 'REORDER_SCENES': {
      const scs  = [...state.scenes]
      const [mv] = scs.splice(action.from, 1)
      scs.splice(action.to, 0, mv)
      return { ...state, scenes:scs }
    }

    // ── Load scene data (from SceneManager) ──────────────────
    case 'LOAD_SCENE_DATA': {
      const { id, data } = action
      return { ...state, scenes:state.scenes.map(s=>s.id===id?{...s,...data,id}:s) }
    }

    // ── Global (non-scene) actions ───────────────────────────
    case 'SET_TOOL':        return { ...state, activeTool:action.tool }
    case 'SET_MODE':        return { ...state, mode:action.mode }
    case 'SET_PANEL':       return { ...state, activeRightPanel:action.panel }
    case 'SET_PLAYING':     return { ...state, playing:action.playing, playTime:action.playing?0:state.playTime }
    case 'TICK_PLAY':       return { ...state, playTime:state.playTime+action.dt }

    // ── All other actions → delegate to active scene ─────────
    default: {
      const idx = state.scenes.findIndex(s=>s.id===state.activeSceneId)
      if (idx < 0) return state
      const updated = sceneReducer(state.scenes[idx], action)
      if (updated === state.scenes[idx]) return state
      const newScenes = [...state.scenes]
      newScenes[idx] = updated
      return { ...state, scenes:newScenes }
    }
  }
}

// ─── Initial state ────────────────────────────────────────────
const firstScene = makeScene('Scene 1', 'sc_default')
const INIT = {
  // Multi-scene
  scenes:          [firstScene],
  activeSceneId:   firstScene.id,
  // Global UI state (not per-scene)
  mode:            'simple',
  activeTool:      'select',
  activeRightPanel:'properties',
  playing:         false,
  playTime:        0,
}

// ─── Context ──────────────────────────────────────────────────
const Ctx = createContext(null)
export function CreatorProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, INIT)
  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>
}

// ─── useCreator hook ──────────────────────────────────────────
export function useCreator() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useCreator must be inside CreatorProvider')
  const { state, dispatch } = ctx

  // Active scene data — surfaced to top level (no breaking change)
  const activeScene = state.scenes.find(s=>s.id===state.activeSceneId) || state.scenes[0]
  const { elements, selected, history, future, bgColor, showGrid, showGuides, zoom, panX, panY } = activeScene

  const selectedEls = elements.filter(e=>selected.includes(e.id))
  const selectedEl  = selectedEls.length===1 ? selectedEls[0] : null

  // Per-element actions
  const addElement    = useCallback((type,x,y,extra={})=>dispatch({type:'ADD_ELEMENT',el:{...makeElement(type,x,y),...extra}}), [dispatch])
  const updateEl      = useCallback((id,patch)=>dispatch({type:'UPDATE_ELEMENT',id,patch}), [dispatch])
  const updateElHist  = useCallback((id,patch)=>dispatch({type:'UPDATE_ELEMENT_HIST',id,patch}), [dispatch])
  const deleteSelected= useCallback(()=>dispatch({type:'DELETE_ELEMENTS',ids:selected}), [dispatch,selected])
  const duplicate     = useCallback(id=>dispatch({type:'DUPLICATE_ELEMENT',id}), [dispatch])
  const pasteElements = useCallback(els=>dispatch({type:'PASTE_ELEMENTS',els}), [dispatch])
  const select        = useCallback(ids=>dispatch({type:'SELECT',ids}), [dispatch])

  // Global UI
  const setTool    = useCallback(t=>dispatch({type:'SET_TOOL',tool:t}), [dispatch])
  const setMode    = useCallback(m=>dispatch({type:'SET_MODE',mode:m}), [dispatch])
  const setPanel   = useCallback(p=>dispatch({type:'SET_PANEL',panel:p}), [dispatch])
  const undo       = useCallback(()=>dispatch({type:'UNDO'}), [dispatch])
  const redo       = useCallback(()=>dispatch({type:'REDO'}), [dispatch])
  const setZoom    = useCallback(z=>dispatch({type:'SET_ZOOM',zoom:z}), [dispatch])
  const clearScene = useCallback(()=>{if(window.confirm('Clear all elements?'))dispatch({type:'CLEAR_SCENE'})}, [dispatch])

  // ── Multi-scene actions ──────────────────────────────────
  const addScene       = useCallback(name=>dispatch({type:'ADD_SCENE',name}), [dispatch])
  const switchScene    = useCallback(id=>dispatch({type:'SWITCH_SCENE',id}), [dispatch])
  const deleteScene    = useCallback(id=>dispatch({type:'DELETE_SCENE',id}), [dispatch])
  const renameScene    = useCallback((id,name)=>dispatch({type:'RENAME_SCENE',id,name}), [dispatch])
  const duplicateScene = useCallback(id=>dispatch({type:'DUPLICATE_SCENE',id}), [dispatch])
  const reorderScenes  = useCallback((from,to)=>dispatch({type:'REORDER_SCENES',from,to}), [dispatch])

  return {
    // Active scene data (top-level for backward compat)
    elements, selected, history, future, bgColor, showGrid, showGuides, zoom, panX, panY,
    selectedEls, selectedEl,
    // Global state
    mode:            state.mode,
    activeTool:      state.activeTool,
    activeRightPanel:state.activeRightPanel,
    playing:         state.playing,
    playTime:        state.playTime,
    // Multi-scene
    scenes:          state.scenes,
    activeSceneId:   state.activeSceneId,
    activeScene,
    // Actions
    addElement, updateEl, updateElHist, deleteSelected,
    duplicate, pasteElements, select,
    setTool, setMode, setPanel, undo, redo, setZoom, clearScene,
    addScene, switchScene, deleteScene, renameScene, duplicateScene, reorderScenes,
    dispatch,
  }
              }
        
