/**
 * premium-healthcare-wellness-061 — Telehealth waiting room — Standard Immersive
 * Category: healthcare-wellness | Tier: Premium | Layout: immersive-stage
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, FLOATINGNODES} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-healthcare-wellness-061 mz-density--default" data-motion="purposeful-reduced-motion-aware">
      <div className="mz-nav mz-nav--floating" role="toolbar" aria-label="Tools">
                <button type="button" className="mz-toolbtn" aria-label="Select">Select</button>
        <button type="button" className="mz-toolbtn" aria-label="Undo">Undo</button>
        <button type="button" className="mz-toolbtn" aria-label="Layers">Layers</button>
        <button type="button" className="mz-toolbtn" aria-label="Zoom">Zoom</button>
      </div>
      <main className="mz-main">
        <div className="mz-canvas" role="application" aria-label="Telehealth waiting room — Standard Immersive canvas">
          <div className="mz-canvas__hint">Canvas area — keyboard: arrows to pan, +/- to zoom</div>
          <FLOATINGNODES seed="premium-healthcare-wellness-061" />
        </div>
        <aside className="mz-canvaspanel" aria-label="Inspector">
          <h2>Telehealth waiting room — Standard Immersive</h2>
          <CARDS2 seed="premium-healthcare-wellness-061" />
        </aside>

      </main>
    </div>
  );
}
