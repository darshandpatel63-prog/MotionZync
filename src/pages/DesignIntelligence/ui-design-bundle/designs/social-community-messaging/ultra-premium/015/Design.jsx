/**
 * ultra-social-community-messaging-015 — Group chat threads — Compare Advanced
 * Category: social-community-messaging | Tier: Ultra Premium+ | Layout: timeline-first
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {TIMELINEITEMS} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-social-community-messaging-015 mz-density--default" data-motion="purposeful-reduced-motion-aware">
      <header className="mz-nav mz-nav--minimal">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <button type="button" className="mz-btn mz-btn--ghost">Menu</button>
      </header>
      <main className="mz-main">
        <h2 className="mz-timeline-title">Group chat threads — Compare Advanced</h2>
        <ol className="mz-timeline"><TIMELINEITEMS seed="ultra-social-community-messaging-015" /></ol>
        <section className="mz-compare" aria-label="Comparison">
                    <div className="mz-compare__card"><h4>Option A</h4><p className="mz-metric">93%</p></div>
          <div className="mz-compare__card"><h4>Option B</h4><p className="mz-metric">25%</p></div>
        </section>
      </main>
    </div>
  );
}
