/**
 * ultra-3d-configurator-immersive-037 — Jewelry material viewer — Focus-mode Advanced
 * Category: 3d-configurator-immersive | Tier: Ultra Premium+ | Layout: canvas-first
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, FLOATINGNODES} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-3d-configurator-immersive-037 mz-density--compact" data-motion="purposeful-reduced-motion-aware">
      <div className="mz-nav mz-nav--floating" role="toolbar" aria-label="Tools">
                <button type="button" className="mz-toolbtn" aria-label="Zoom">Zoom</button>
        <button type="button" className="mz-toolbtn" aria-label="Layers">Layers</button>
        <button type="button" className="mz-toolbtn" aria-label="Measure">Measure</button>
        <button type="button" className="mz-toolbtn" aria-label="Snap">Snap</button>
      </div>
      <main className="mz-main">
        <div className="mz-canvas" role="application" aria-label="Jewelry material viewer — Focus-mode Advanced canvas">
          <div className="mz-canvas__hint">Canvas area — keyboard: arrows to pan, +/- to zoom</div>
          <FLOATINGNODES seed="ultra-3d-configurator-immersive-037" />
        </div>
        <aside className="mz-canvaspanel" aria-label="Inspector">
          <h2>Jewelry material viewer — Focus-mode Advanced</h2>
          <CARDS2 seed="ultra-3d-configurator-immersive-037" />
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
