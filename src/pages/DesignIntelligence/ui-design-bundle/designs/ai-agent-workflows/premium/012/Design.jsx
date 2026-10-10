/**
 * premium-ai-agent-workflows-012 — Agent builder node canvas — Compact Geographic/Schematic
 * Category: ai-agent-workflows | Tier: Premium | Layout: map-geo
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, FLOATINGNODES} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-ai-agent-workflows-012 mz-density--compact" data-motion="none">
      <div className="mz-nav mz-nav--floating" role="toolbar" aria-label="Tools">
                <button type="button" className="mz-toolbtn" aria-label="Zoom">Zoom</button>
        <button type="button" className="mz-toolbtn" aria-label="Pan">Pan</button>
        <button type="button" className="mz-toolbtn" aria-label="Layers">Layers</button>
        <button type="button" className="mz-toolbtn" aria-label="Snap">Snap</button>
      </div>
      <main className="mz-main">
        <div className="mz-canvas" role="application" aria-label="Agent builder node canvas — Compact Geographic/Schematic canvas">
          <div className="mz-canvas__hint">Canvas area — keyboard: arrows to pan, +/- to zoom</div>
          <FLOATINGNODES seed="premium-ai-agent-workflows-012" />
        </div>
        <aside className="mz-canvaspanel" aria-label="Inspector">
          <h2>Agent builder node canvas — Compact Geographic/Schematic</h2>
          <CARDS2 seed="premium-ai-agent-workflows-012" />
        </aside>
        <div className="mz-chips" role="group" aria-label="Filters">
                    <button type="button" className="mz-chip" aria-pressed="true">Archived</button>
          <button type="button" className="mz-chip" aria-pressed="false">Active</button>
          <button type="button" className="mz-chip" aria-pressed="false">All</button>
          <button type="button" className="mz-chip" aria-pressed="false">This week</button>
        </div>
      </main>
    </div>
  );
}
