/**
 * premium-mobile-tablet-apps-028 — Mobile wallet passbook — Collaborative Playful
 * Category: mobile-tablet-apps | Tier: Premium | Layout: playful-story
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {PARAGRAPHS} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-mobile-tablet-apps-028 mz-density--default" data-motion="none">
      <header className="mz-nav mz-nav--minimal">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <button type="button" className="mz-btn mz-btn--ghost">Menu</button>
      </header>
      <main className="mz-main">
        <article className="mz-article">
          <header><p className="mz-kicker">Feature</p><h2>Mobile wallet passbook — Collaborative Playful</h2></header>
          <p className="mz-lede">A considered take on the topic, written for readers first.</p>
          <PARAGRAPHS seed="premium-mobile-tablet-apps-028" />
        </article>
        <div className="mz-presence" aria-label="People online">
          <span className="mz-avatar" aria-hidden="true">AR</span><span className="mz-avatar" aria-hidden="true">JO</span><span className="mz-avatar" aria-hidden="true">MC</span><span>6 collaborators online</span>
        </div>
        <aside className="mz-activity" aria-label="Recent activity">
          <h3>Activity</h3>
          <ul>            <li><strong>J. Okafor (sample)</strong> commented on a record <time>2h ago</time></li>
            <li><strong>T. Berg (sample)</strong> added a file <time>2h ago</time></li>
            <li><strong>S. Novak (sample)</strong> approved a change <time>2h ago</time></li></ul>
        </aside>
      </main>
    </div>
  );
}
