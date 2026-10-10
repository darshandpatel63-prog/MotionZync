/**
 * premium-games-hud-menus-088 — Crafting recipe bench — Collaborative Single-Task
 * Category: games-hud-menus | Tier: Premium | Layout: single-task
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {FORMFIELDS} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-games-hud-menus-088 mz-density--default" data-motion="none">
      <header className="mz-nav mz-nav--minimal">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <button type="button" className="mz-btn mz-btn--ghost">Menu</button>
      </header>
      <main className="mz-main">
        <section className="mz-task" aria-labelledby="task-t">
          <p className="mz-kicker">Step 2 of 5</p>
          <h2 id="task-t">Crafting recipe bench — Collaborative Single-Task</h2>
          <p>Focused single-task surface with a clear primary action.</p>
          <FORMFIELDS seed="premium-games-hud-menus-088" />
          <div className="mz-task__actions">
            <button type="button" className="mz-btn mz-btn--ghost">Back</button>
            <button type="button" className="mz-btn mz-btn--primary">Continue</button>
          </div>
        </section>
        <div className="mz-presence" aria-label="People online">
          <span className="mz-avatar" aria-hidden="true">AR</span><span className="mz-avatar" aria-hidden="true">JO</span><span className="mz-avatar" aria-hidden="true">MC</span><span>5 collaborators online</span>
        </div>
        <aside className="mz-activity" aria-label="Recent activity">
          <h3>Activity</h3>
          <ul>            <li><strong>L. Haddad (sample)</strong> closed a task <time>2h ago</time></li>
            <li><strong>S. Novak (sample)</strong> approved a change <time>2h ago</time></li>
            <li><strong>T. Berg (sample)</strong> added a file <time>2h ago</time></li></ul>
        </aside>
      </main>
    </div>
  );
}
