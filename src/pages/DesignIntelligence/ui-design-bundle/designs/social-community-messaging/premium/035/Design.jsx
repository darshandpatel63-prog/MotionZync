/**
 * premium-social-community-messaging-035 — Event RSVP board — Compare Master-Detail
 * Category: social-community-messaging | Tier: Premium | Layout: split-pane
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, ROWS5} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-social-community-messaging-035 mz-density--default" data-motion="none">
      <nav className="mz-nav mz-nav--sidebar" aria-label="Primary">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <ul>          <li><a href="#" className="mz-navlink is-active">Saved</a></li>
          <li><a href="#" className="mz-navlink">Archive</a></li>
          <li><a href="#" className="mz-navlink">Settings</a></li>
          <li><a href="#" className="mz-navlink">Library</a></li></ul>
      </nav>
      <main className="mz-main">
        <div className="mz-split">
          <section className="mz-split__list" aria-label="List"><ROWS5 seed="premium-social-community-messaging-035" /></section>
          <section className="mz-split__detail" aria-label="Detail">
            <h2>Event RSVP board — Compare Master-Detail</h2>
            <p>Detail view with actions and history.</p>
            <CARDS2 seed="premium-social-community-messaging-035" />
          </section>
        </div>
        <section className="mz-compare" aria-label="Comparison">
                    <div className="mz-compare__card"><h4>Option A</h4><p className="mz-metric">46%</p></div>
          <div className="mz-compare__card"><h4>Option B</h4><p className="mz-metric">24%</p></div>
        </section>
      </main>
    </div>
  );
}
