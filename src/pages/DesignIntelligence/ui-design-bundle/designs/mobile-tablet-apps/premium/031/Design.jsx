/**
 * premium-mobile-tablet-apps-031 — Fitness tracker rings — Standard Full-Bleed
 * Category: mobile-tablet-apps | Tier: Premium | Layout: canvas-first
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, FLOATINGNODES} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-mobile-tablet-apps-031 mz-density--default" data-motion="none">
      <div className="mz-nav mz-nav--floating" role="toolbar" aria-label="Tools">
                <button type="button" className="mz-toolbtn" aria-label="Pan">Pan</button>
        <button type="button" className="mz-toolbtn" aria-label="Snap">Snap</button>
        <button type="button" className="mz-toolbtn" aria-label="Measure">Measure</button>
        <button type="button" className="mz-toolbtn" aria-label="Zoom">Zoom</button>
      </div>
      <main className="mz-main">
        <div className="mz-canvas" role="application" aria-label="Fitness tracker rings — Standard Full-Bleed canvas">
          <div className="mz-canvas__hint">Canvas area — keyboard: arrows to pan, +/- to zoom</div>
          <FLOATINGNODES seed="premium-mobile-tablet-apps-031" />
        </div>
        <aside className="mz-canvaspanel" aria-label="Inspector">
          <h2>Fitness tracker rings — Standard Full-Bleed</h2>
          <CARDS2 seed="premium-mobile-tablet-apps-031" />
        </aside>

      </main>
    </div>
  );
}
