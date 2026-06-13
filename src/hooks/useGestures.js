// useGestures.js
// Mobile-first gesture system
// Handles: pinch-zoom, two-finger rotate, three-finger undo, swipe, pan
import { useEffect, useRef, useCallback } from 'react'

const PI = Math.PI

function getDistance(t1, t2) {
  const dx = t1.clientX - t2.clientX
  const dy = t1.clientY - t2.clientY
  return Math.sqrt(dx * dx + dy * dy)
}

function getAngle(t1, t2) {
  return Math.atan2(t2.clientY - t1.clientY, t2.clientX - t1.clientX)
}

function getMidpoint(t1, t2) {
  return {
    x: (t1.clientX + t2.clientX) / 2,
    y: (t1.clientY + t2.clientY) / 2,
  }
}

/**
 * useGestures(ref, callbacks)
 *
 * callbacks: {
 *   onPinchZoom(delta, midpoint)        — pinch to zoom
 *   onTwoFingerRotate(angleDelta)        — rotate canvas
 *   onThreeFingerUndo()                  — 3-finger tap = undo
 *   onThreeFingerRedo()                  — 3-finger swipe right = redo
 *   onPan(dx, dy)                        — two-finger pan
 *   onSwipeLeft()                        — single-finger fast swipe left
 *   onSwipeRight()                       — single-finger fast swipe right
 *   onLongPress(x, y)                    — long press
 *   onStylusMove(x, y, pressure, tilt)  — stylus pointer move
 * }
 */
export function useGestures(ref, callbacks = {}) {
  const state = useRef({
    touches: [],
    pinchStartDist: null,
    pinchStartAngle: null,
    lastMidpoint: null,
    threeFingerTimer: null,
    longPressTimer: null,
    swipeStartX: null,
    swipeStartY: null,
    swipeStartTime: null,
  })

  const cb = useRef(callbacks)
  cb.current = callbacks

  const onPointerMove = useCallback((e) => {
    if (e.pointerType === 'pen' || e.pointerType === 'stylus') {
      cb.current.onStylusMove?.(
        e.clientX, e.clientY,
        e.pressure ?? 0.5,
        e.tiltX ?? 0,
        e.tiltY ?? 0
      )
    }
  }, [])

  const onTouchStart = useCallback((e) => {
    const touches = Array.from(e.touches)
    state.current.touches = touches

    // Long press on single touch
    if (touches.length === 1) {
      state.current.swipeStartX    = touches[0].clientX
      state.current.swipeStartY    = touches[0].clientY
      state.current.swipeStartTime = Date.now()
      state.current.longPressTimer = setTimeout(() => {
        cb.current.onLongPress?.(touches[0].clientX, touches[0].clientY)
      }, 600)
    }

    // Two-finger init
    if (touches.length === 2) {
      clearTimeout(state.current.longPressTimer)
      state.current.pinchStartDist  = getDistance(touches[0], touches[1])
      state.current.pinchStartAngle = getAngle(touches[0], touches[1])
      state.current.lastMidpoint    = getMidpoint(touches[0], touches[1])
    }

    // Three-finger undo tap
    if (touches.length === 3) {
      clearTimeout(state.current.longPressTimer)
      state.current.threeFingerTimer = setTimeout(() => {
        cb.current.onThreeFingerUndo?.()
      }, 100)
    }
  }, [])

  const onTouchMove = useCallback((e) => {
    e.preventDefault()
    const touches = Array.from(e.touches)
    clearTimeout(state.current.longPressTimer)

    if (touches.length === 2) {
      const dist  = getDistance(touches[0], touches[1])
      const angle = getAngle(touches[0], touches[1])
      const mid   = getMidpoint(touches[0], touches[1])

      // Pinch zoom
      if (state.current.pinchStartDist != null) {
        const delta = dist / state.current.pinchStartDist
        cb.current.onPinchZoom?.(delta, mid)
        state.current.pinchStartDist = dist
      }

      // Rotation
      if (state.current.pinchStartAngle != null) {
        const angleDelta = angle - state.current.pinchStartAngle
        if (Math.abs(angleDelta) > 0.01) {
          cb.current.onTwoFingerRotate?.(angleDelta)
          state.current.pinchStartAngle = angle
        }
      }

      // Pan
      if (state.current.lastMidpoint) {
        const dx = mid.x - state.current.lastMidpoint.x
        const dy = mid.y - state.current.lastMidpoint.y
        if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
          cb.current.onPan?.(dx, dy)
        }
        state.current.lastMidpoint = mid
      }
    }

    // Three-finger swipe redo
    if (touches.length === 3) {
      clearTimeout(state.current.threeFingerTimer)
      const dx = touches[0].clientX - (state.current.touches[0]?.clientX ?? touches[0].clientX)
      if (dx > 40) cb.current.onThreeFingerRedo?.()
    }
  }, [])

  const onTouchEnd = useCallback((e) => {
    clearTimeout(state.current.longPressTimer)
    clearTimeout(state.current.threeFingerTimer)

    const remaining = Array.from(e.touches)

    // Swipe detection
    if (remaining.length === 0 && state.current.swipeStartX != null) {
      const dt = Date.now() - state.current.swipeStartTime
      const dx = e.changedTouches[0].clientX - state.current.swipeStartX
      const dy = e.changedTouches[0].clientY - state.current.swipeStartY
      const speed = Math.abs(dx) / dt

      if (speed > 0.5 && Math.abs(dx) > 60 && Math.abs(dy) < 40) {
        if (dx < 0) cb.current.onSwipeLeft?.()
        else        cb.current.onSwipeRight?.()
      }
    }

    if (remaining.length < 2) {
      state.current.pinchStartDist  = null
      state.current.pinchStartAngle = null
      state.current.lastMidpoint    = null
    }
    state.current.touches = remaining
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    el.addEventListener('pointermove', onPointerMove, { passive: true })
    el.addEventListener('touchstart',  onTouchStart,  { passive: false })
    el.addEventListener('touchmove',   onTouchMove,   { passive: false })
    el.addEventListener('touchend',    onTouchEnd,    { passive: true })

    return () => {
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('touchstart',  onTouchStart)
      el.removeEventListener('touchmove',   onTouchMove)
      el.removeEventListener('touchend',    onTouchEnd)
    }
  }, [ref, onPointerMove, onTouchStart, onTouchMove, onTouchEnd])
}

