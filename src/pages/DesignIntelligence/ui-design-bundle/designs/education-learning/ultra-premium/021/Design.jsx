/**
 * ultra-education-learning-021 — Lesson player workspace — Standard Advanced
 * Category: education-learning | Tier: Ultra Premium+ | Layout: immersive-stage
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, FLOATINGNODES} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-education-learning-021 mz-density--default" data-motion="purposeful-reduced-motion-aware">
      <div className="mz-nav mz-nav--floating" role="toolbar" aria-label="Tools">
                <button type="button" className="mz-toolbtn" aria-label="Annotate">Annotate</button>
        <button type="button" className="mz-toolbtn" aria-label="Select">Select</button>
        <button type="button" className="mz-toolbtn" aria-label="Layers">Layers</button>
        <button type="button" className="mz-toolbtn" aria-label="Pan">Pan</button>
      </div>
      <main className="mz-main">
        <div className="mz-canvas" role="application" aria-label="Lesson player workspace — Standard Advanced canvas">
          <div className="mz-canvas__hint">Canvas area — keyboard: arrows to pan, +/- to zoom</div>
          <FLOATINGNODES seed="ultra-education-learning-021" />
        </div>
        <aside className="mz-canvaspanel" aria-label="Inspector">
          <h2>Lesson player workspace — Standard Advanced</h2>
          <CARDS2 seed="ultra-education-learning-021" />
        </aside>

      </main>
    </div>
  );
}
