/**
 * premium-3d-configurator-immersive-034 — Jewelry material viewer — Alert-first Full-Bleed
 * Category: 3d-configurator-immersive | Tier: Premium | Layout: canvas-first
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, FLOATINGNODES} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-3d-configurator-immersive-034 mz-density--default" data-motion="purposeful-reduced-motion-aware">
      <div className="mz-nav mz-nav--floating" role="toolbar" aria-label="Tools">
                <button type="button" className="mz-toolbtn" aria-label="Undo">Undo</button>
        <button type="button" className="mz-toolbtn" aria-label="Zoom">Zoom</button>
        <button type="button" className="mz-toolbtn" aria-label="Pan">Pan</button>
        <button type="button" className="mz-toolbtn" aria-label="Snap">Snap</button>
      </div>
      <main className="mz-main">
        <div className="mz-canvas" role="application" aria-label="Jewelry material viewer — Alert-first Full-Bleed canvas">
          <div className="mz-canvas__hint">Canvas area — keyboard: arrows to pan, +/- to zoom</div>
          <FLOATINGNODES seed="premium-3d-configurator-immersive-034" />
        </div>
        <aside className="mz-canvaspanel" aria-label="Inspector">
          <h2>Jewelry material viewer — Alert-first Full-Bleed</h2>
          <CARDS2 seed="premium-3d-configurator-immersive-034" />
        </aside>
        <div className="mz-alert" role="status">
          <strong>Attention:</strong> usage is at 82% of the current plan limit (fictional).
        </div>
      </main>
    </div>
  );
}
