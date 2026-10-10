/**
 * ultra-data-viz-monitoring-082 — Schema lineage graph — Compact Advanced
 * Category: data-viz-monitoring | Tier: Ultra Premium+ | Layout: single-task
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {FORMFIELDS} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-data-viz-monitoring-082 mz-density--compact" data-motion="purposeful-reduced-motion-aware">
      <header className="mz-nav mz-nav--minimal">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <button type="button" className="mz-btn mz-btn--ghost">Menu</button>
      </header>
      <main className="mz-main">
        <section className="mz-task" aria-labelledby="task-t">
          <p className="mz-kicker">Step 2 of 5</p>
          <h2 id="task-t">Schema lineage graph — Compact Advanced</h2>
          <p>Reduced chrome so the task stays center stage.</p>
          <FORMFIELDS seed="ultra-data-viz-monitoring-082" />
          <div className="mz-task__actions">
            <button type="button" className="mz-btn mz-btn--ghost">Back</button>
            <button type="button" className="mz-btn mz-btn--primary">Continue</button>
          </div>
        </section>
        <div className="mz-chips" role="group" aria-label="Filters">
                    <button type="button" className="mz-chip" aria-pressed="true">Mine</button>
          <button type="button" className="mz-chip" aria-pressed="false">All</button>
          <button type="button" className="mz-chip" aria-pressed="false">This week</button>
          <button type="button" className="mz-chip" aria-pressed="false">Active</button>
        </div>
      </main>
    </div>
  );
}
