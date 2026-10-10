/**
 * premium-data-viz-monitoring-067 — SLO burn-down board — Focus-mode Immersive
 * Category: data-viz-monitoring | Tier: Premium | Layout: immersive-stage
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, FLOATINGNODES} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-data-viz-monitoring-067 mz-density--compact" data-motion="purposeful-reduced-motion-aware">
      <div className="mz-nav mz-nav--floating" role="toolbar" aria-label="Tools">
                <button type="button" className="mz-toolbtn" aria-label="Pan">Pan</button>
        <button type="button" className="mz-toolbtn" aria-label="Annotate">Annotate</button>
        <button type="button" className="mz-toolbtn" aria-label="Measure">Measure</button>
        <button type="button" className="mz-toolbtn" aria-label="Undo">Undo</button>
      </div>
      <main className="mz-main">
        <div className="mz-canvas" role="application" aria-label="SLO burn-down board — Focus-mode Immersive canvas">
          <div className="mz-canvas__hint">Canvas area — keyboard: arrows to pan, +/- to zoom</div>
          <FLOATINGNODES seed="premium-data-viz-monitoring-067" />
        </div>
        <aside className="mz-canvaspanel" aria-label="Inspector">
          <h2>SLO burn-down board — Focus-mode Immersive</h2>
          <CARDS2 seed="premium-data-viz-monitoring-067" />
        </aside>
        <aside className="mz-focusrail" aria-label="Focus tools">
                    <button type="button" className="mz-toolbtn">Timer</button>
          <button type="button" className="mz-toolbtn">Notes</button>
          <button type="button" className="mz-toolbtn">Hide panels</button>
        </aside>
      </main>
    </div>
  );
}
