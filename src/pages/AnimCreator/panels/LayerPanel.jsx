import { useRef } from 'react'
import { useCreator } from '../store/CreatorContext.jsx'
import './LayerPanel.css'

const TYPE_ICONS = { rect:'⬜', circle:'⭕', text:'T', triangle:'△', star:'⭐', line:'╱', image:'🖼️', draw:'✏️' }

function LayerItem({ el, index, total, isSelected, onSelect, onToggleVisible, onToggleLock, onDelete, onDuplicate, onMoveUp, onMoveDown }) {
  return (
    <div
      className={`layer-item ${isSelected ? 'selected' : ''} ${el.locked ? 'locked' : ''}`}
      onClick={() => onSelect(el.id)}
    >
      <div className="layer-left">
        <span className="layer-type-icon">{TYPE_ICONS[el.type] || '▪'}</span>
        <span className="layer-name" title={el.label}>{el.label}</span>
        {el.anim?.name && el.anim.name !== 'none' && <span className="layer-anim-dot" title={`Anim: ${el.anim.name}`}/>}
        {el.physics?.enabled && <span className="layer-phys-dot" title="Physics enabled"/>}
      </div>
      <div className="layer-actions">
        <button
          className={`la-btn ${!el.visible ? 'inactive' : ''}`}
          onClick={e => { e.stopPropagation(); onToggleVisible(el.id) }}
          title={el.visible ? 'Hide' : 'Show'}
        >{el.visible !== false ? '👁' : '🚫'}</button>
        <button
          className={`la-btn ${el.locked ? 'inactive' : ''}`}
          onClick={e => { e.stopPropagation(); onToggleLock(el.id) }}
          title={el.locked ? 'Unlock' : 'Lock'}
        >{el.locked ? '🔒' : '🔓'}</button>
      </div>
    </div>
  )
}

export default function LayerPanel() {
  const { elements, selected, select, updateEl, duplicate, dispatch, deleteSelected } = useCreator()
  // Reversed so top element shows first
  const reversed = [...elements].reverse()

  function handleSelect(id) { select([id]) }
  function toggleVisible(id) {
    const el = elements.find(e => e.id === id)
    if (el) updateEl(id, { visible: el.visible === false ? true : false })
  }
  function toggleLock(id) {
    const el = elements.find(e => e.id === id)
    if (el) updateEl(id, { locked: !el.locked })
  }
  function moveUp(id) {
    const idx = elements.findIndex(e => e.id === id)
    if (idx < elements.length - 1) dispatch({ type:'REORDER', from: idx, to: idx + 1 })
  }
  function moveDown(id) {
    const idx = elements.findIndex(e => e.id === id)
    if (idx > 0) dispatch({ type:'REORDER', from: idx, to: idx - 1 })
  }

  return (
    <div className="layer-panel">
      <div className="lp-header">
        <span className="lp-title">📂 Layers</span>
        <span className="lp-count">{elements.length}</span>
      </div>

      {elements.length === 0 && (
        <div className="lp-empty">
          <div className="lp-empty-icon">🎨</div>
          <p>No elements yet</p>
          <p className="lp-empty-sub">Use toolbar to add shapes</p>
        </div>
      )}

      <div className="lp-list">
        {reversed.map((el, i) => (
          <LayerItem
            key={el.id}
            el={el}
            index={i}
            total={elements.length}
            isSelected={selected.includes(el.id)}
            onSelect={handleSelect}
            onToggleVisible={toggleVisible}
            onToggleLock={toggleLock}
            onDelete={() => { select([el.id]); deleteSelected() }}
            onDuplicate={() => duplicate(el.id)}
            onMoveUp={() => moveUp(el.id)}
            onMoveDown={() => moveDown(el.id)}
          />
        ))}
      </div>

      {selected.length > 0 && (
        <div className="lp-footer">
          <button className="lp-footer-btn" onClick={() => duplicate(selected[0])} title="Duplicate">⧉ Dup</button>
          <button className="lp-footer-btn danger" onClick={deleteSelected} title="Delete selected">🗑 Del</button>
          {selected.length === 1 && <>
            <button className="lp-footer-btn" onClick={() => moveUp(selected[0])} title="Bring forward">↑</button>
            <button className="lp-footer-btn" onClick={() => moveDown(selected[0])} title="Send backward">↓</button>
          </>}
        </div>
      )}
    </div>
  )
}
