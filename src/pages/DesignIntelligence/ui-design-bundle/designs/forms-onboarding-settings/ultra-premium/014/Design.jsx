/**
 * ultra-forms-onboarding-settings-014 — Account profile settings — Alert-first Advanced
 * Category: forms-onboarding-settings | Tier: Ultra Premium+ | Layout: map-geo
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, FLOATINGNODES} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-forms-onboarding-settings-014 mz-density--default" data-motion="purposeful-reduced-motion-aware">
      <div className="mz-nav mz-nav--floating" role="toolbar" aria-label="Tools">
                <button type="button" className="mz-toolbtn" aria-label="Pan">Pan</button>
        <button type="button" className="mz-toolbtn" aria-label="Annotate">Annotate</button>
        <button type="button" className="mz-toolbtn" aria-label="Select">Select</button>
        <button type="button" className="mz-toolbtn" aria-label="Undo">Undo</button>
      </div>
      <main className="mz-main">
        <div className="mz-canvas" role="application" aria-label="Account profile settings — Alert-first Advanced canvas">
          <div className="mz-canvas__hint">Canvas area — keyboard: arrows to pan, +/- to zoom</div>
          <FLOATINGNODES seed="ultra-forms-onboarding-settings-014" />
        </div>
        <aside className="mz-canvaspanel" aria-label="Inspector">
          <h2>Account profile settings — Alert-first Advanced</h2>
          <CARDS2 seed="ultra-forms-onboarding-settings-014" />
        </aside>
        <div className="mz-alert" role="status">
          <strong>Attention:</strong> two records failed validation and were quarantined (sample).
        </div>
      </main>
    </div>
  );
}
