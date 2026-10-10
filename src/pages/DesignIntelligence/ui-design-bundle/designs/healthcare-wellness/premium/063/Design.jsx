/**
 * premium-healthcare-wellness-063 — Telehealth waiting room — Expanded Immersive
 * Category: healthcare-wellness | Tier: Premium | Layout: immersive-stage
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, FLOATINGNODES} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-healthcare-wellness-063 mz-density--roomy" data-motion="purposeful-reduced-motion-aware">
      <div className="mz-nav mz-nav--floating" role="toolbar" aria-label="Tools">
                <button type="button" className="mz-toolbtn" aria-label="Select">Select</button>
        <button type="button" className="mz-toolbtn" aria-label="Annotate">Annotate</button>
        <button type="button" className="mz-toolbtn" aria-label="Pan">Pan</button>
        <button type="button" className="mz-toolbtn" aria-label="Measure">Measure</button>
      </div>
      <main className="mz-main">
        <div className="mz-canvas" role="application" aria-label="Telehealth waiting room — Expanded Immersive canvas">
          <div className="mz-canvas__hint">Canvas area — keyboard: arrows to pan, +/- to zoom</div>
          <FLOATINGNODES seed="premium-healthcare-wellness-063" />
        </div>
        <aside className="mz-canvaspanel" aria-label="Inspector">
          <h2>Telehealth waiting room — Expanded Immersive</h2>
          <CARDS2 seed="premium-healthcare-wellness-063" />
        </aside>
        <aside className="mz-insight" aria-label="Insight">
          <h3>Key insight</h3>
          <p>Three items need review before the weekly sync.</p>
        </aside>
      </main>
    </div>
  );
}
