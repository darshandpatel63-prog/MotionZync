// ============================================================
// cs-a11y.js  –  Shared modal accessibility hook (Phase 7.2)
// Traps Tab focus inside a modal while it's open, calls onClose
// on Escape, and restores focus to whatever opened it on close.
// ============================================================
import { useEffect, useRef } from 'react'

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

// Use on components that are conditionally RENDERED — i.e. mounted only
// while open, unmounted on close — which is how every modal in this app
// already works. Returns a ref to attach to the modal's outer container.
export function useModalA11y(onClose) {
  const containerRef = useRef(null)

  useEffect(() => {
    const triggerEl = document.activeElement

    // Focus the first focusable element inside the modal on open
    const focusables = containerRef.current?.querySelectorAll(FOCUSABLE)
    focusables?.[0]?.focus()

    function handleKeyDown(e) {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key !== 'Tab') return
      const current = containerRef.current?.querySelectorAll(FOCUSABLE)
      if (!current?.length) return
      const first = current[0]
      const last = current[current.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      // Return focus to whatever opened the modal (e.g. the ⚙️ button)
      triggerEl?.focus?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return containerRef
}
