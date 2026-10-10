/**
 * premium-finance-fintech-035 — Portfolio holdings analyzer — Compare Full-Bleed
 * Category: finance-fintech | Tier: Premium | Layout: canvas-first
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, FLOATINGNODES} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-finance-fintech-035 mz-density--default" data-motion="purposeful-reduced-motion-aware">
      <div className="mz-nav mz-nav--floating" role="toolbar" aria-label="Tools">
                <button type="button" className="mz-toolbtn" aria-label="Annotate">Annotate</button>
        <button type="button" className="mz-toolbtn" aria-label="Undo">Undo</button>
        <button type="button" className="mz-toolbtn" aria-label="Snap">Snap</button>
        <button type="button" className="mz-toolbtn" aria-label="Measure">Measure</button>
      </div>
      <main className="mz-main">
        <div className="mz-canvas" role="application" aria-label="Portfolio holdings analyzer — Compare Full-Bleed canvas">
          <div className="mz-canvas__hint">Canvas area — keyboard: arrows to pan, +/- to zoom</div>
          <FLOATINGNODES seed="premium-finance-fintech-035" />
        </div>
        <aside className="mz-canvaspanel" aria-label="Inspector">
          <h2>Portfolio holdings analyzer — Compare Full-Bleed</h2>
          <CARDS2 seed="premium-finance-fintech-035" />
        </aside>
        <section className="mz-compare" aria-label="Comparison">
                    <div className="mz-compare__card"><h4>Option A</h4><p className="mz-metric">84%</p></div>
          <div className="mz-compare__card"><h4>Option B</h4><p className="mz-metric">96%</p></div>
        </section>
      </main>
    </div>
  );
}
