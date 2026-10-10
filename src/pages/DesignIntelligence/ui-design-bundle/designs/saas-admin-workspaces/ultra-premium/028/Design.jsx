/**
 * ultra-saas-admin-workspaces-028 — Project kanban workspace — Collaborative Advanced
 * Category: saas-admin-workspaces | Tier: Ultra Premium+ | Layout: playful-story
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {PARAGRAPHS} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-saas-admin-workspaces-028 mz-density--default" data-motion="purposeful-reduced-motion-aware">
      <header className="mz-nav mz-nav--minimal">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <button type="button" className="mz-btn mz-btn--ghost">Menu</button>
      </header>
      <main className="mz-main">
        <article className="mz-article">
          <header><p className="mz-kicker">Deep dive</p><h2>Project kanban workspace — Collaborative Advanced</h2></header>
          <p className="mz-lede">A considered take on the topic, written for readers first.</p>
          <PARAGRAPHS seed="ultra-saas-admin-workspaces-028" />
        </article>
        <div className="mz-presence" aria-label="People online">
          <span className="mz-avatar" aria-hidden="true">AR</span><span className="mz-avatar" aria-hidden="true">JO</span><span className="mz-avatar" aria-hidden="true">MC</span><span>9 collaborators online</span>
        </div>
        <aside className="mz-activity" aria-label="Recent activity">
          <h3>Activity</h3>
          <ul>            <li><strong>T. Berg (sample)</strong> closed a task <time>2h ago</time></li>
            <li><strong>L. Haddad (sample)</strong> added a file <time>2h ago</time></li>
            <li><strong>J. Okafor (sample)</strong> commented on a record <time>2h ago</time></li></ul>
        </aside>
      </main>
    </div>
  );
}
