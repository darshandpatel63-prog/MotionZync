/**
 * premium-ai-agent-workflows-027 — Multi-agent orchestration map — Focus-mode Top
 * Category: ai-agent-workflows | Tier: Premium | Layout: topbar-flow
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {BENTO} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-ai-agent-workflows-027 mz-density--compact" data-motion="none">
      <header className="mz-nav mz-nav--topbar">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <ul aria-label="Primary">          <li><a href="#" className="mz-navlink is-active">Activity</a></li>
          <li><a href="#" className="mz-navlink">Settings</a></li>
          <li><a href="#" className="mz-navlink">Reports</a></li>
          <li><a href="#" className="mz-navlink">Archive</a></li></ul>
        <button type="button" className="mz-btn mz-btn--primary">Create</button>
      </header>
      <main className="mz-main">
        <section className="mz-panel mz-panel--hero" aria-labelledby="t1">
          <h2 id="t1">Multi-agent orchestration map — Focus-mode Top</h2>
          <p>Hero surface summarising the current context.</p>
          <button type="button" className="mz-btn mz-btn--primary">Primary action</button>
        </section>
        <section className="mz-bento" aria-label="Modules"><BENTO seed="premium-ai-agent-workflows-027" /></section>
        <aside className="mz-focusrail" aria-label="Focus tools">
                    <button type="button" className="mz-toolbtn">Timer</button>
          <button type="button" className="mz-toolbtn">Notes</button>
          <button type="button" className="mz-toolbtn">Hide panels</button>
        </aside>
      </main>
    </div>
  );
}
