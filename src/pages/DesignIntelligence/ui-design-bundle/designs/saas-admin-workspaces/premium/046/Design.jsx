/**
 * premium-saas-admin-workspaces-046 — Billing and plan console — Empty-state Tabbed
 * Category: saas-admin-workspaces | Tier: Premium | Layout: tabbed-workspace
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {BENTO} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-saas-admin-workspaces-046 mz-density--roomy" data-motion="none">
      <header className="mz-nav mz-nav--tabs">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <div role="tablist" aria-label="Views">        <button role="tab" aria-selected="true" className="mz-tab">Members</button>
        <button role="tab" aria-selected="false" className="mz-tab">Settings</button>
        <button role="tab" aria-selected="false" className="mz-tab">History</button></div>
      </header>
      <main className="mz-main">
        <section className="mz-panel mz-panel--hero" aria-labelledby="t1">
          <h2 id="t1">Billing and plan console — Empty-state Tabbed</h2>
          <p>Primary content zone with strong hierarchy.</p>
          <button type="button" className="mz-btn mz-btn--primary">Primary action</button>
        </section>
        <section className="mz-bento" aria-label="Modules"><BENTO seed="premium-saas-admin-workspaces-046" /></section>
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
