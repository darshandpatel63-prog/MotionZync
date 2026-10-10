/**
 * premium-finance-fintech-033 — Portfolio holdings analyzer — Expanded Full-Bleed
 * Category: finance-fintech | Tier: Premium | Layout: canvas-first
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, FLOATINGNODES} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-finance-fintech-033 mz-density--roomy" data-motion="purposeful-reduced-motion-aware">
      <div className="mz-nav mz-nav--floating" role="toolbar" aria-label="Tools">
                <button type="button" className="mz-toolbtn" aria-label="Pan">Pan</button>
        <button type="button" className="mz-toolbtn" aria-label="Measure">Measure</button>
        <button type="button" className="mz-toolbtn" aria-label="Snap">Snap</button>
        <button type="button" className="mz-toolbtn" aria-label="Layers">Layers</button>
      </div>
      <main className="mz-main">
        <div className="mz-canvas" role="application" aria-label="Portfolio holdings analyzer — Expanded Full-Bleed canvas">
          <div className="mz-canvas__hint">Canvas area — keyboard: arrows to pan, +/- to zoom</div>
          <FLOATINGNODES seed="premium-finance-fintech-033" />
        </div>
        <aside className="mz-canvaspanel" aria-label="Inspector">
          <h2>Portfolio holdings analyzer — Expanded Full-Bleed</h2>
          <CARDS2 seed="premium-finance-fintech-033" />
        </aside>
        <aside className="mz-insight" aria-label="Insight">
          <h3>Key insight</h3>
          <p>Three items need review before the weekly sync.</p>
        </aside>
      </main>
    </div>
  );
}
