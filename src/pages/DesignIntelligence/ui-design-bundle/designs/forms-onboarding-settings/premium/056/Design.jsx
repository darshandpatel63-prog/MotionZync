/**
 * premium-forms-onboarding-settings-056 — KYC verification steps — Empty-state Full-Bleed
 * Category: forms-onboarding-settings | Tier: Premium | Layout: canvas-first
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, FLOATINGNODES} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-forms-onboarding-settings-056 mz-density--roomy" data-motion="none">
      <div className="mz-nav mz-nav--floating" role="toolbar" aria-label="Tools">
                <button type="button" className="mz-toolbtn" aria-label="Zoom">Zoom</button>
        <button type="button" className="mz-toolbtn" aria-label="Select">Select</button>
        <button type="button" className="mz-toolbtn" aria-label="Pan">Pan</button>
        <button type="button" className="mz-toolbtn" aria-label="Annotate">Annotate</button>
      </div>
      <main className="mz-main">
        <div className="mz-canvas" role="application" aria-label="KYC verification steps — Empty-state Full-Bleed canvas">
          <div className="mz-canvas__hint">Canvas area — keyboard: arrows to pan, +/- to zoom</div>
          <FLOATINGNODES seed="premium-forms-onboarding-settings-056" />
        </div>
        <aside className="mz-canvaspanel" aria-label="Inspector">
          <h2>KYC verification steps — Empty-state Full-Bleed</h2>
          <CARDS2 seed="premium-forms-onboarding-settings-056" />
        </aside>
        <div className="mz-empty">
          <div className="mz-empty__art" aria-hidden="true"></div>
          <h3>Nothing here yet</h3>
          <p>Add your first item to see this view come alive. All data shown is fictional.</p>
          <button type="button" className="mz-btn mz-btn--primary">Get started</button>
        </div>
      </main>
    </div>
  );
}
