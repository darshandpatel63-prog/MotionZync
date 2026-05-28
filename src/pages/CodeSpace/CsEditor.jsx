// ============================================================
// CsEditor.jsx  –  Monaco Editor wrapper with full IDE features
// ============================================================
import { useEffect, useRef, useCallback } from 'react'
import { getMonacoLang } from './cs-filesystem.js'

const MONACO_CDN = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min'

let monacoLoaded   = false
let monacoLoading  = null
let monacoInstance = null

function loadMonaco() {
  if (monacoInstance) return Promise.resolve(monacoInstance)
  if (monacoLoading)  return monacoLoading
  monacoLoading = new Promise((resolve, reject) => {
    if (window.monaco) { monacoInstance = window.monaco; resolve(monacoInstance); return }
    const loader = document.createElement('script')
    loader.src   = `${MONACO_CDN}/vs/loader.js`
    loader.onload = () => {
      window.require.config({ paths: { vs: `${MONACO_CDN}/vs` } })
      window.require(['vs/editor/editor.main'], (m) => {
        monacoInstance = window.monaco
        monacoLoaded   = true
        setupMonacoThemes()
        resolve(monacoInstance)
      })
    }
    loader.onerror = reject
    document.head.appendChild(loader)
  })
  return monacoLoading
}

function setupMonacoThemes() {
  const m = window.monaco
  m.editor.defineTheme('cs-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment',       foreground: '6b7280', fontStyle: 'italic' },
      { token: 'keyword',       foreground: 'a78bfa', fontStyle: 'bold' },
      { token: 'string',        foreground: '86efac' },
      { token: 'number',        foreground: 'fb923c' },
      { token: 'type',          foreground: '67e8f9' },
      { token: 'function',      foreground: 'fbbf24' },
      { token: 'variable',      foreground: 'e2e8f0' },
      { token: 'tag',           foreground: 'f87171' },
      { token: 'attribute.name',foreground: 'fbbf24' },
      { token: 'attribute.value',foreground: '86efac' },
    ],
    colors: {
      'editor.background':           '#0d0d14',
      'editor.foreground':           '#e2e8f0',
      'editor.lineHighlightBackground': '#ffffff08',
      'editor.selectionBackground':  '#7c3aed40',
      'editor.inactiveSelectionBackground': '#7c3aed20',
      'editorLineNumber.foreground': '#374151',
      'editorLineNumber.activeForeground': '#6b7280',
      'editorCursor.foreground':     '#a78bfa',
      'editorWhitespace.foreground': '#1f2937',
      'editorIndentGuide.background':'#1f2937',
      'editorIndentGuide.activeBackground': '#374151',
      'editorGutter.background':     '#0d0d14',
      'scrollbarSlider.background':  '#374151aa',
      'scrollbarSlider.hoverBackground': '#4b5563aa',
      'scrollbarSlider.activeBackground': '#6b7280aa',
      'minimap.background':          '#0a0a10',
      'editorWidget.background':     '#161622',
      'editorWidget.border':         '#2d2d3d',
      'input.background':            '#1e1e2e',
      'input.border':                '#374151',
      'focusBorder':                 '#7c3aed',
      'list.hoverBackground':        '#ffffff08',
      'list.activeSelectionBackground': '#7c3aed30',
    }
  })

  m.editor.defineTheme('cs-light', {
    base: 'vs',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#fafafa',
      'editor.foreground': '#1e1e2e',
    }
  })
}

export default function CsEditor({
  value,
  filename,
  onChange,
  onSave,
  theme = 'cs-dark',
  fontSize = 14,
  wordWrap = 'off',
  minimap = true,
  readOnly = false,
  onCursorChange,
  diffMode = false,
  originalValue = '',
  className = '',
}) {
  const containerRef = useRef(null)
  const editorRef    = useRef(null)
  const diffEditorRef = useRef(null)
  const valueRef     = useRef(value)
  const onChangeRef  = useRef(onChange)
  const onSaveRef    = useRef(onSave)

  useEffect(() => { valueRef.current   = value },    [value])
  useEffect(() => { onChangeRef.current = onChange }, [onChange])
  useEffect(() => { onSaveRef.current   = onSave },   [onSave])

  // Mount editor
  useEffect(() => {
    let cancelled = false
    loadMonaco().then(monaco => {
      if (cancelled || !containerRef.current) return
      const lang = getMonacoLang(filename || 'untitled.js')

      if (diffMode) {
        const de = monaco.editor.createDiffEditor(containerRef.current, {
          theme,
          fontSize,
          readOnly: true,
          renderSideBySide: true,
          automaticLayout: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
          fontLigatures: true,
        })
        de.setModel({
          original: monaco.editor.createModel(originalValue, lang),
          modified: monaco.editor.createModel(value, lang),
        })
        diffEditorRef.current = de
      } else {
        const ed = monaco.editor.create(containerRef.current, {
          value: valueRef.current,
          language: lang,
          theme,
          fontSize,
          wordWrap,
          minimap:               { enabled: minimap },
          readOnly,
          automaticLayout:       true,
          scrollBeyondLastLine:  false,
          smoothScrolling:       true,
          cursorBlinking:        'smooth',
          cursorSmoothCaretAnimation: 'on',
          fontFamily:            "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
          fontLigatures:         true,
          bracketPairColorization: { enabled: true },
          guides: {
            bracketPairs:      true,
            indentation:       true,
          },
          renderLineHighlight:   'gutter',
          renderWhitespace:      'selection',
          occurrencesHighlight:  true,
          codeLens:              true,
          folding:               true,
          foldingHighlight:      true,
          showFoldingControls:   'mouseover',
          suggest: {
            showKeywords:  true,
            showSnippets:  true,
            showClasses:   true,
            showFunctions: true,
            showVariables: true,
            preview:       true,
          },
          quickSuggestions:      true,
          parameterHints:        { enabled: true },
          hover:                 { enabled: true },
          contextmenu:           true,
          mouseWheelZoom:        true,
          formatOnPaste:         true,
          formatOnType:          true,
          autoIndent:            'full',
          tabSize:               2,
          insertSpaces:          true,
          detectIndentation:     true,
          scrollbar: {
            verticalScrollbarSize:   8,
            horizontalScrollbarSize: 8,
            useShadows:              false,
          },
          padding: { top: 12, bottom: 12 },
          lineNumbers:           'on',
          glyphMargin:           true,
          lineDecorationsWidth:  10,
          lineNumbersMinChars:   3,
          overviewRulerLanes:    3,
        })

        // Change event
        ed.onDidChangeModelContent(() => {
          const v = ed.getValue()
          if (v !== valueRef.current) onChangeRef.current?.(v)
        })

        // Cursor position
        ed.onDidChangeCursorPosition(e => {
          onCursorChange?.({ line: e.position.lineNumber, col: e.position.column })
        })

        // Ctrl+S = save
        ed.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
          onSaveRef.current?.()
        })

        // Ctrl+Shift+F = format
        ed.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF, () => {
          ed.getAction('editor.action.formatDocument')?.run()
        })

        editorRef.current = ed
      }
    })

    return () => {
      cancelled = true
      editorRef.current?.dispose()
      diffEditorRef.current?.dispose()
      editorRef.current    = null
      diffEditorRef.current = null
    }
  }, [filename, diffMode])

  // Sync value from outside without resetting cursor
  useEffect(() => {
    const ed = editorRef.current
    if (!ed) return
    const current = ed.getValue()
    if (current !== value) {
      const pos   = ed.getPosition()
      const state = ed.saveViewState()
      ed.setValue(value)
      if (pos)   ed.setPosition(pos)
      if (state) ed.restoreViewState(state)
    }
  }, [value])

  // Theme change
  useEffect(() => {
    if (window.monaco && monacoLoaded) {
      window.monaco.editor.setTheme(theme)
    }
  }, [theme])

  // Font size
  useEffect(() => {
    editorRef.current?.updateOptions({ fontSize })
  }, [fontSize])

  // Word wrap
  useEffect(() => {
    editorRef.current?.updateOptions({ wordWrap })
  }, [wordWrap])

  // Minimap
  useEffect(() => {
    editorRef.current?.updateOptions({ minimap: { enabled: minimap } })
  }, [minimap])

  return (
    <div
      ref={containerRef}
      className={`cs-monaco-container ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  )
}
