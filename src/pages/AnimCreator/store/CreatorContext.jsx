import { createContext, useContext, useReducer, useCallback } from 'react'

// ─── Default element template ────────────────────────────────
export function makeElement(type, x, y) {
  const id = 'el_' + Date.now() + '_' + Math.random().toString(36).slice(2,6)
  return {
    id, type, x, y,
    width:  type==='text'?160 : type==='circle'?80 : type==='line'?120 : 100,
    height: type==='text'?44  : type==='circle'?80 : type==='line'?6   : 100,
    rotation: 0, opacity: 1,
    fill:   '#7c3aed', stroke:'transparent', strokeWidth:0,
    label:  type==='text'?'Text': type.charAt(0).toUpperCase()+type.slice(1),
    fontSize:20, fontWeight:'700', fontColor:'#ffffff',
    borderRadius: type==='circle'?50 : type==='rect'?8 : 0,
    gradient: null,
    shadow: { enabled:false, color:'#7c3aed', blur:20, x:0, y:0 },
    glow:   { enabled:false, color:'#7c3aed', intensity:20 },
    // Animation
    anim: { name:'none', duration:2, delay:0, easing:'ease-in-out', loop:true, direction:'normal' },
    // Physics
    physics: {
      enabled:false, mode:'none',
      gravity:0.3, bounce:0.6, mass:1, friction:0.08,
      wind:0, magnetic:0, stiffness:0.15, damping:0.85,
      vx:0, vy:0, ax:0, ay:0, restX:0, restY:0, sleeping:false,
    },
    borderAnim: { enabled:false, type:'neon', color:'#06b6d4', speed:2, thickness:2, glow:15 },
    effects: { blur:0, brightness:100, contrast:100, saturate:100, hueRotate:0 },
    visible:true, locked:false, zIndex:0,
    _selected:false,
  }
}

// ─── Helpers ─────────────────────────────────────────────────
function snapshot(s) { return { elements:s.elements.map(e=>({...e})), selected:[...s.selected] } }
function pushHist(s) {
  const h = [...s.history, snapshot(s)]
  return h.length>50 ? h.slice(-50) : h
}

// ─── Reducer ─────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {

    case 'ADD_ELEMENT': {
      const el = { ...action.el, zIndex:state.elements.length }
      return { ...state, elements:[...state.elements,el], selected:[el.id], history:pushHist(state) }
    }

    case 'UPDATE_ELEMENT': {
      return { ...state, elements:state.elements.map(e=>e.id===action.id?{...e,...action.patch}:e) }
    }

    case 'UPDATE_ELEMENT_HIST': {
      return { ...state, elements:state.elements.map(e=>e.id===action.id?{...e,...action.patch}:e), history:pushHist(state) }
    }

    case 'DELETE_ELEMENTS': {
      const ids = new Set(action.ids)
      return { ...state, elements:state.elements.filter(e=>!ids.has(e.id)), selected:[], history:pushHist(state) }
    }

    case 'DUPLICATE_ELEMENT': {
      const src = state.elements.find(e=>e.id===action.id)
      if (!src) return state
      const dup = { ...src, id:'el_'+Date.now()+'_'+Math.random().toString(36).slice(2,6),
                    x:src.x+20, y:src.y+20, zIndex:state.elements.length }
      return { ...state, elements:[...state.elements,dup], selected:[dup.id], history:pushHist(state) }
    }

    // NEW: paste multiple copied elements with offset
    case 'PASTE_ELEMENTS': {
      const pasted = action.els.map((el,i) => ({
        ...el,
        id: 'el_'+Date.now()+'_'+Math.random().toString(36).slice(2,6)+'_'+i,
        x:  el.x + 24,
        y:  el.y + 24,
        zIndex: state.elements.length + i,
      }))
      return {
        ...state,
        elements: [...state.elements, ...pasted],
        selected: pasted.map(e=>e.id),
        history:  pushHist(state),
      }
    }

    case 'SELECT':  return { ...state, selected:action.ids }
    case 'SET_TOOL': return { ...state, activeTool:action.tool }
    case 'SET_MODE': return { ...state, mode:action.mode }
    case 'SET_PANEL': return { ...state, activeRightPanel:action.panel }
    case 'SET_PLAYING': return { ...state, playing:action.playing, playTime:action.playing?0:state.playTime }
    case 'TICK_PLAY': return { ...state, playTime:state.playTime+action.dt }
    case 'SET_ZOOM': return { ...state, zoom:Math.max(0.15,Math.min(4,action.zoom)) }
    case 'SET_PAN':  return { ...state, panX:action.x, panY:action.y }

    case 'REORDER': {
      const els = [...state.elements]
      const [moved] = els.splice(action.from,1)
      els.splice(action.to,0,moved)
      return { ...state, elements:els.map((e,i)=>({...e,zIndex:i})), history:pushHist(state) }
    }

    case 'UNDO': {
      if (!state.history.length) return state
      const prev = state.history[state.history.length-1]
      return { ...state, elements:prev.elements, selected:prev.selected,
               history:state.history.slice(0,-1), future:[snapshot(state),...state.future] }
    }
    case 'REDO': {
      if (!state.future.length) return state
      const next = state.future[0]
      return { ...state, elements:next.elements, selected:next.selected,
               future:state.future.slice(1), history:[...state.history,snapshot(state)] }
    }

    case 'CLEAR_SCENE':    return { ...state, elements:[], selected:[], history:pushHist(state) }
    case 'LOAD_ELEMENTS':  return { ...state, elements:action.elements }
    case 'SET_SHOW_GRID':  return { ...state, showGrid:action.value }
    case 'SET_SHOW_GUIDES':return { ...state, showGuides:action.value }
    case 'SET_BG_COLOR':   return { ...state, bgColor:action.color }

    case 'UPDATE_PHYSICS_RUNTIME': {
      return {
        ...state,
        elements: state.elements.map(e=>{
          const u = action.updates[e.id]
          return u ? { ...e, physics:{...e.physics,...u} } : e
        }),
      }
    }

    default: return state
  }
}

// ─── Initial state ────────────────────────────────────────────
const INIT = {
  elements: [],
  selected: [],
  mode: 'simple',
  activeTool: 'select',
  activeRightPanel: 'properties',
  playing: false,
  playTime: 0,
  zoom: 1,
  panX: 0,
  panY: 0,
  history: [],
  future: [],
  showGrid: true,
  showGuides: true,
  bgColor: '#0a0a0f',
}

// ─── Context ──────────────────────────────────────────────────
const Ctx = createContext(null)

export function CreatorProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, INIT)
  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>
}

export function useCreator() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useCreator must be inside CreatorProvider')
  const { state, dispatch } = ctx

  const selectedEls = state.elements.filter(e=>state.selected.includes(e.id))
  const selectedEl  = selectedEls.length===1 ? selectedEls[0] : null

  const addElement    = useCallback((type,x,y,extra={})=>dispatch({type:'ADD_ELEMENT',el:{...makeElement(type,x,y),...extra}}), [dispatch])
  const updateEl      = useCallback((id,patch)=>dispatch({type:'UPDATE_ELEMENT',id,patch}), [dispatch])
  const updateElHist  = useCallback((id,patch)=>dispatch({type:'UPDATE_ELEMENT_HIST',id,patch}), [dispatch])
  const deleteSelected= useCallback(()=>dispatch({type:'DELETE_ELEMENTS',ids:state.selected}), [dispatch,state.selected])
  const duplicate     = useCallback(id=>dispatch({type:'DUPLICATE_ELEMENT',id}), [dispatch])
  const pasteElements = useCallback(els=>dispatch({type:'PASTE_ELEMENTS',els}), [dispatch])
  const select        = useCallback(ids=>dispatch({type:'SELECT',ids}), [dispatch])
  const setTool       = useCallback(t=>dispatch({type:'SET_TOOL',tool:t}), [dispatch])
  const setMode       = useCallback(m=>dispatch({type:'SET_MODE',mode:m}), [dispatch])
  const setPanel      = useCallback(p=>dispatch({type:'SET_PANEL',panel:p}), [dispatch])
  const undo          = useCallback(()=>dispatch({type:'UNDO'}), [dispatch])
  const redo          = useCallback(()=>dispatch({type:'REDO'}), [dispatch])
  const setZoom       = useCallback(z=>dispatch({type:'SET_ZOOM',zoom:z}), [dispatch])
  const clearScene    = useCallback(()=>{if(window.confirm('Clear all elements?'))dispatch({type:'CLEAR_SCENE'})}, [dispatch])

  return {
    ...state, selectedEls, selectedEl,
    addElement, updateEl, updateElHist, deleteSelected,
    duplicate, pasteElements, select, setTool, setMode, setPanel,
    undo, redo, setZoom, clearScene, dispatch,
  }
                             }
      
