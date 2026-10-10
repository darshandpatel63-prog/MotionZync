/**
 * PreviewShell — safe, static renderer for a chosen design + theme.
 * - No eval / new Function / remote scripts / dangerouslySetInnerHTML.
 * - Designs are plain React function components imported statically.
 * - Theme switching sets data-theme on the wrapper; tokens come from shared/tokens.css.
 */
import React from "react";
import "../tokens.css";

export default function PreviewShell({ title, theme = "light", children }) {
  return (
    <div data-theme={theme} style={{ background: "var(--mz-surface)", minHeight: "100vh" }}>
      <header style={{ display: "flex", gap: "1rem", padding: "0.5rem 1rem", borderBottom: "1px solid var(--mz-border)", alignItems: "center" }}>
        <strong>{title}</strong>
        <span style={{ color: "var(--mz-text-muted)", fontSize: "0.8125rem" }}>Theme: {theme} · sample data only</span>
      </header>
      {children}
    </div>
  );
}
