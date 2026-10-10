// Example: render one design in the shell (Vite/CRA-style entry).
import React from "react";
import PreviewShell from "./PreviewShell";
import Design from "../../designs/dashboards-analytics/premium/001/Design";

export default function App() {
  return (
    <PreviewShell title="premium-dashboards-analytics-001" theme="colorful">
      <Design />
    </PreviewShell>
  );
}
