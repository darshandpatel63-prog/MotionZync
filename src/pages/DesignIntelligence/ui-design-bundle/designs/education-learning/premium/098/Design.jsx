/**
 * premium-education-learning-098 — Curriculum roadmap map — Collaborative Playful
 * Category: education-learning | Tier: Premium | Layout: playful-story
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {PARAGRAPHS} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-education-learning-098 mz-density--default" data-motion="purposeful-reduced-motion-aware">
      <header className="mz-nav mz-nav--minimal">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <button type="button" className="mz-btn mz-btn--ghost">Menu</button>
      </header>
      <main className="mz-main">
        <article className="mz-article">
          <header><p className="mz-kicker">Guide</p><h2>Curriculum roadmap map — Collaborative Playful</h2></header>
          <p className="mz-lede">Designed for long, comfortable reading sessions.</p>
          <PARAGRAPHS seed="premium-education-learning-098" />
        </article>
        <div className="mz-presence" aria-label="People online">
          <span className="mz-avatar" aria-hidden="true">AR</span><span className="mz-avatar" aria-hidden="true">JO</span><span className="mz-avatar" aria-hidden="true">MC</span><span>2 collaborators online</span>
        </div>
        <aside className="mz-activity" aria-label="Recent activity">
          <h3>Activity</h3>
          <ul>            <li><strong>T. Berg (sample)</strong> approved a change <time>2h ago</time></li>
            <li><strong>L. Haddad (sample)</strong> commented on a record <time>2h ago</time></li>
            <li><strong>L. Haddad (sample)</strong> closed a task <time>2h ago</time></li></ul>
        </aside>
      </main>
    </div>
  );
}
