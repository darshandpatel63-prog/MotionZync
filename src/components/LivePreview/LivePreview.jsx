import './LivePreview.css'

/**
 * LivePreview - User na code nu secure sandbox preview
 * Props:
 *   cssCode: string
 *   jsCode: string
 */
function LivePreview({ cssCode, jsCode }) {
  const html = buildSandboxHTML(cssCode, jsCode)

  return (
    <div className="live-preview">
      <div className="preview-header">
        <span className="preview-dot red" />
        <span className="preview-dot yellow" />
        <span className="preview-dot green" />
        <span className="preview-label">Live Preview</span>
      </div>
      <iframe
        className="preview-iframe"
        sandbox="allow-scripts"
        title="Live animation preview"
        srcDoc={html}
      />
    </div>
  )
}

/**
 * User na CSS + JS ne secure sandbox HTML ma wrap karo
 * sandbox="allow-scripts" - sirf scripts chale, baaki sab blocked
 */
function buildSandboxHTML(css = '', js = '') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background: #0a0a0f;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  #container { width: 100%; height: 100%; position: relative; }
  /* ---- User CSS Start ---- */
  ${css}
  /* ---- User CSS End ---- */
</style>
</head>
<body>
<div id="container"></div>
<script>
(function() {
  'use strict';
  try {
    ${js}
  } catch (err) {
    document.body.innerHTML =
      '<div style="color:#ef4444;font-family:monospace;padding:1rem;font-size:13px;">' +
      '❌ Error: ' + err.message +
      '</div>';
  }
})();
</script>
</body>
</html>`
}

export default LivePreview

