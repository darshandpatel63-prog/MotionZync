/**
 * ultra-healthcare-wellness-061 — Telehealth waiting room — Standard Advanced
 * Category: healthcare-wellness | Tier: Ultra Premium+ | Layout: immersive-stage
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, FLOATINGNODES} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-healthcare-wellness-061 mz-density--default" data-motion="purposeful-reduced-motion-aware">
      <div className="mz-nav mz-nav--floating" role="toolbar" aria-label="Tools">
                <button type="button" className="mz-toolbtn" aria-label="Layers">Layers</button>
        <button type="button" className="mz-toolbtn" aria-label="Zoom">Zoom</button>
        <button type="button" className="mz-toolbtn" aria-label="Snap">Snap</button>
        <button type="button" className="mz-toolbtn" aria-label="Pan">Pan</button>
      </div>
      <main className="mz-main">
        <div className="mz-canvas" role="application" aria-label="Telehealth waiting room — Standard Advanced canvas">
          <div className="mz-canvas__hint">Canvas area — keyboard: arrows to pan, +/- to zoom</div>
          <FLOATINGNODES seed="ultra-healthcare-wellness-061" />
        </div>
        <aside className="mz-canvaspanel" aria-label="Inspector">
          <h2>Telehealth waiting room — Standard Advanced</h2>
          <CARDS2 seed="ultra-healthcare-wellness-061" />
        </aside>

      </main>
    </div>
  );
}
