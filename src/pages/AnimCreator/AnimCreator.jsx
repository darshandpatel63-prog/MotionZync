import { useState } from 'react'
import { CreatorProvider } from './store/CreatorContext.jsx'
import TopBar        from './panels/TopBar.jsx'
import LayerPanel    from './panels/LayerPanel.jsx'
import Canvas        from './panels/Canvas.jsx'
import RightPanel    from './panels/RightPanel.jsx'
import ExportModal   from './modals/ExportModal.jsx'
import LibraryModal  from './modals/LibraryModal.jsx'
import './AnimCreator.css'

function AnimCreatorInner() {
  const [showExport,  setShowExport]  = useState(false)
  const [showLibrary, setShowLibrary] = useState(false)

  return (
    <div className="anim-creator">
      {/* Top toolbar */}
      <TopBar
        onExport ={() => setShowExport(true)}
        onLibrary={() => setShowLibrary(true)}
      />

      {/* Main body */}
      <div className="ac-body">
        {/* Left: Layers */}
        <LayerPanel/>

        {/* Center: Canvas */}
        <Canvas/>

        {/* Right: Properties */}
        <RightPanel/>
      </div>

      {/* Modals */}
      {showExport  && <ExportModal  onClose={() => setShowExport(false)}/>}
      {showLibrary && <LibraryModal onClose={() => setShowLibrary(false)}/>}
    </div>
  )
}

export default function AnimCreator() {
  return (
    <CreatorProvider>
      <AnimCreatorInner/>
    </CreatorProvider>
  )
}
