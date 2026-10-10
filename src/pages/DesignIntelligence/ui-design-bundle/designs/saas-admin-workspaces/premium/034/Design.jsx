/**
 * premium-saas-admin-workspaces-034 — CRM contact 360 — Alert-first Full-Bleed
 * Category: saas-admin-workspaces | Tier: Premium | Layout: canvas-first
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, FLOATINGNODES} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-saas-admin-workspaces-034 mz-density--default" data-motion="purposeful-reduced-motion-aware">
      <div className="mz-nav mz-nav--floating" role="toolbar" aria-label="Tools">
                <button type="button" className="mz-toolbtn" aria-label="Layers">Layers</button>
        <button type="button" className="mz-toolbtn" aria-label="Select">Select</button>
        <button type="button" className="mz-toolbtn" aria-label="Zoom">Zoom</button>
        <button type="button" className="mz-toolbtn" aria-label="Annotate">Annotate</button>
      </div>
      <main className="mz-main">
        <div className="mz-canvas" role="application" aria-label="CRM contact 360 — Alert-first Full-Bleed canvas">
          <div className="mz-canvas__hint">Canvas area — keyboard: arrows to pan, +/- to zoom</div>
          <FLOATINGNODES seed="premium-saas-admin-workspaces-034" />
        </div>
        <aside className="mz-canvaspanel" aria-label="Inspector">
          <h2>CRM contact 360 — Alert-first Full-Bleed</h2>
          <CARDS2 seed="premium-saas-admin-workspaces-034" />
        </aside>
        <div className="mz-alert" role="status">
          <strong>Attention:</strong> two records failed validation and were quarantined (sample).
        </div>
      </main>
    </div>
  );
}
