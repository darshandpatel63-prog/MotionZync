/**
 * premium-education-learning-023 — Lesson player workspace — Expanded Immersive
 * Category: education-learning | Tier: Premium | Layout: immersive-stage
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, FLOATINGNODES} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-education-learning-023 mz-density--roomy" data-motion="none">
      <div className="mz-nav mz-nav--floating" role="toolbar" aria-label="Tools">
                <button type="button" className="mz-toolbtn" aria-label="Annotate">Annotate</button>
        <button type="button" className="mz-toolbtn" aria-label="Measure">Measure</button>
        <button type="button" className="mz-toolbtn" aria-label="Layers">Layers</button>
        <button type="button" className="mz-toolbtn" aria-label="Select">Select</button>
      </div>
      <main className="mz-main">
        <div className="mz-canvas" role="application" aria-label="Lesson player workspace — Expanded Immersive canvas">
          <div className="mz-canvas__hint">Canvas area — keyboard: arrows to pan, +/- to zoom</div>
          <FLOATINGNODES seed="premium-education-learning-023" />
        </div>
        <aside className="mz-canvaspanel" aria-label="Inspector">
          <h2>Lesson player workspace — Expanded Immersive</h2>
          <CARDS2 seed="premium-education-learning-023" />
        </aside>
        <aside className="mz-insight" aria-label="Insight">
          <h3>Key insight</h3>
          <p>The north region outperforms forecast by 12% (demo).</p>
        </aside>
      </main>
    </div>
  );
}
