/**
 * premium-ai-agent-workflows-055 — Evaluation run dashboard — Compare Full-Bleed
 * Category: ai-agent-workflows | Tier: Premium | Layout: canvas-first
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, FLOATINGNODES} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-ai-agent-workflows-055 mz-density--default" data-motion="none">
      <div className="mz-nav mz-nav--floating" role="toolbar" aria-label="Tools">
                <button type="button" className="mz-toolbtn" aria-label="Annotate">Annotate</button>
        <button type="button" className="mz-toolbtn" aria-label="Measure">Measure</button>
        <button type="button" className="mz-toolbtn" aria-label="Zoom">Zoom</button>
        <button type="button" className="mz-toolbtn" aria-label="Snap">Snap</button>
      </div>
      <main className="mz-main">
        <div className="mz-canvas" role="application" aria-label="Evaluation run dashboard — Compare Full-Bleed canvas">
          <div className="mz-canvas__hint">Canvas area — keyboard: arrows to pan, +/- to zoom</div>
          <FLOATINGNODES seed="premium-ai-agent-workflows-055" />
        </div>
        <aside className="mz-canvaspanel" aria-label="Inspector">
          <h2>Evaluation run dashboard — Compare Full-Bleed</h2>
          <CARDS2 seed="premium-ai-agent-workflows-055" />
        </aside>
        <section className="mz-compare" aria-label="Comparison">
                    <div className="mz-compare__card"><h4>Option A</h4><p className="mz-metric">22%</p></div>
          <div className="mz-compare__card"><h4>Option B</h4><p className="mz-metric">30%</p></div>
        </section>
      </main>
    </div>
  );
}
