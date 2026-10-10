/**
 * ultra-3d-configurator-immersive-048 — Scene lighting console — Collaborative Advanced
 * Category: 3d-configurator-immersive | Tier: Ultra Premium+ | Layout: tabbed-workspace
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {BENTO} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-3d-configurator-immersive-048 mz-density--default" data-motion="purposeful-reduced-motion-aware">
      <header className="mz-nav mz-nav--tabs">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <div role="tablist" aria-label="Views">        <button role="tab" aria-selected="true" className="mz-tab">Overview</button>
        <button role="tab" aria-selected="false" className="mz-tab">History</button>
        <button role="tab" aria-selected="false" className="mz-tab">Details</button></div>
      </header>
      <main className="mz-main">
        <section className="mz-panel mz-panel--hero" aria-labelledby="t1">
          <h2 id="t1">Scene lighting console — Collaborative Advanced</h2>
          <p>Primary content zone with strong hierarchy.</p>
          <button type="button" className="mz-btn mz-btn--primary">Primary action</button>
        </section>
        <section className="mz-bento" aria-label="Modules"><BENTO seed="ultra-3d-configurator-immersive-048" /></section>
        <div className="mz-presence" aria-label="People online">
          <span className="mz-avatar" aria-hidden="true">AR</span><span className="mz-avatar" aria-hidden="true">JO</span><span className="mz-avatar" aria-hidden="true">MC</span><span>7 collaborators online</span>
        </div>
        <aside className="mz-activity" aria-label="Recent activity">
          <h3>Activity</h3>
          <ul>            <li><strong>M. Chen (sample)</strong> added a file <time>2h ago</time></li>
            <li><strong>L. Haddad (sample)</strong> approved a change <time>2h ago</time></li>
            <li><strong>J. Okafor (sample)</strong> closed a task <time>2h ago</time></li></ul>
        </aside>
      </main>
    </div>
  );
}
