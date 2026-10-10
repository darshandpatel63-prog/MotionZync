/**
 * premium-media-creative-tools-022 — Audio mixing desk — Compact Immersive
 * Category: media-creative-tools | Tier: Premium | Layout: immersive-stage
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, FLOATINGNODES} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-media-creative-tools-022 mz-density--compact" data-motion="none">
      <div className="mz-nav mz-nav--floating" role="toolbar" aria-label="Tools">
                <button type="button" className="mz-toolbtn" aria-label="Zoom">Zoom</button>
        <button type="button" className="mz-toolbtn" aria-label="Measure">Measure</button>
        <button type="button" className="mz-toolbtn" aria-label="Layers">Layers</button>
        <button type="button" className="mz-toolbtn" aria-label="Annotate">Annotate</button>
      </div>
      <main className="mz-main">
        <div className="mz-canvas" role="application" aria-label="Audio mixing desk — Compact Immersive canvas">
          <div className="mz-canvas__hint">Canvas area — keyboard: arrows to pan, +/- to zoom</div>
          <FLOATINGNODES seed="premium-media-creative-tools-022" />
        </div>
        <aside className="mz-canvaspanel" aria-label="Inspector">
          <h2>Audio mixing desk — Compact Immersive</h2>
          <CARDS2 seed="premium-media-creative-tools-022" />
        </aside>
        <div className="mz-chips" role="group" aria-label="Filters">
                    <button type="button" className="mz-chip" aria-pressed="true">Archived</button>
          <button type="button" className="mz-chip" aria-pressed="false">Mine</button>
          <button type="button" className="mz-chip" aria-pressed="false">Flagged</button>
          <button type="button" className="mz-chip" aria-pressed="false">Active</button>
        </div>
      </main>
    </div>
  );
}
