/**
 * premium-ai-agent-workflows-052 — Evaluation run dashboard — Compact Full-Bleed
 * Category: ai-agent-workflows | Tier: Premium | Layout: canvas-first
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, FLOATINGNODES} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-ai-agent-workflows-052 mz-density--compact" data-motion="none">
      <div className="mz-nav mz-nav--floating" role="toolbar" aria-label="Tools">
                <button type="button" className="mz-toolbtn" aria-label="Measure">Measure</button>
        <button type="button" className="mz-toolbtn" aria-label="Undo">Undo</button>
        <button type="button" className="mz-toolbtn" aria-label="Layers">Layers</button>
        <button type="button" className="mz-toolbtn" aria-label="Snap">Snap</button>
      </div>
      <main className="mz-main">
        <div className="mz-canvas" role="application" aria-label="Evaluation run dashboard — Compact Full-Bleed canvas">
          <div className="mz-canvas__hint">Canvas area — keyboard: arrows to pan, +/- to zoom</div>
          <FLOATINGNODES seed="premium-ai-agent-workflows-052" />
        </div>
        <aside className="mz-canvaspanel" aria-label="Inspector">
          <h2>Evaluation run dashboard — Compact Full-Bleed</h2>
          <CARDS2 seed="premium-ai-agent-workflows-052" />
        </aside>
        <div className="mz-chips" role="group" aria-label="Filters">
                    <button type="button" className="mz-chip" aria-pressed="true">This week</button>
          <button type="button" className="mz-chip" aria-pressed="false">Active</button>
          <button type="button" className="mz-chip" aria-pressed="false">Mine</button>
          <button type="button" className="mz-chip" aria-pressed="false">Flagged</button>
        </div>
      </main>
    </div>
  );
}
