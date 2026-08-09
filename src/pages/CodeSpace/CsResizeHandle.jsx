// ============================================================
// CsResizeHandle.jsx  –  Draggable divider for resizing side panels
// (Phase 1 / Fix 6 — new feature, panels had no resize before)
//
// Uses Pointer Events (not mouse-only) so the same handle works with
// touch, mouse, and pen — this app is used mobile-first. setPointerCapture
// keeps the drag tracking correctly even if the finger/cursor moves faster
// than the handle's own (6px-wide) hit area.
// ============================================================
import { useCallback, useRef } from 'react'

export default function CsResizeHandle({ width, onResize, min = 160, max = 560, side = 'left', className = '' }) {
  const drag = useRef(null) // { pointerId, startX, startWidth }

  const onPointerDown = useCallback((e) => {
    e.preventDefault()
    drag.current = { pointerId: e.pointerId, startX: e.clientX, startWidth: width }
    e.currentTarget.setPointerCapture(e.pointerId)
    document.body.classList.add('cs2-resizing')
  }, [width])

  const onPointerMove = useCallback((e) => {
    const d = drag.current
    if (!d || e.pointerId !== d.pointerId) return
    const delta = e.clientX - d.startX
    const raw = side === 'left' ? d.startWidth + delta : d.startWidth - delta
    onResize(Math.min(max, Math.max(min, raw)))
  }, [side, min, max, onResize])

  const endDrag = useCallback((e) => {
    if (!drag.current || e.pointerId !== drag.current.pointerId) return
    drag.current = null
    document.body.classList.remove('cs2-resizing')
  }, [])

  return (
    <div
      className={`cs2-resize-handle ${className}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize panel"
      tabIndex={0}
      onKeyDown={(e) => {
        // Keyboard accessible resize too — not just drag
        if (e.key === 'ArrowLeft') onResize(Math.max(min, width - 20))
        if (e.key === 'ArrowRight') onResize(Math.min(max, width + 20))
      }}
    />
  )
}