import React from "react";

const COPY = [
  { label: "Active workspace", value: "2,480", delta: "+12.8%", status: "On track" },
  { label: "Completion rate", value: "86.4%", delta: "+4.2%", status: "Improving" },
  { label: "Response time", value: "248 ms", delta: "−8.1%", status: "Healthy" },
  { label: "Open tasks", value: "124", delta: "−3.6%", status: "In progress" },
  { label: "Quality score", value: "94.8", delta: "+2.4%", status: "Strong" },
  { label: "New activity", value: "368", delta: "+9.7%", status: "Updated" },
];
const TASKS = [
  ["Review weekly activity", "Updated just now", "In review"],
  ["Confirm workspace access", "Updated 8 min ago", "Ready"],
  ["Resolve open requests", "Updated 18 min ago", "In progress"],
  ["Prepare quality summary", "Updated 32 min ago", "Queued"],
  ["Publish the next report", "Updated 1 hour ago", "Scheduled"],
];
const TIMELINE = [
  ["09:15", "Collection refreshed", "The latest sample records are available."],
  ["10:30", "Review completed", "Quality checks reached the target range."],
  ["11:45", "Team update", "Owners confirmed the next action."],
  ["13:20", "Snapshot captured", "The current view is ready for comparison."],
];
const FIELDS = [
  ["Workspace name", "Workspace Alpha"],
  ["Owner email", "owner@example.test"],
  ["Review notes", "Check the latest sample data"],
];
function seedIndex(seed = "motionzync") {
  let value = 0;
  for (const char of String(seed)) value = (value * 31 + char.charCodeAt(0)) >>> 0;
  return value;
}
function itemAt(items, seed, index) { return items[(seedIndex(seed) + index) % items.length]; }
function safeId(seed) { return String(seed || "sample").toLowerCase().replace(/[^a-z0-9_-]+/g, "-").slice(0, 64); }
function Badge({ children, kind = "info" }) { return <span className={"mz-badge mz-badge--" + kind}>{children}</span>; }
function MetricCard({ seed, index = 0, wide = false }) {
  const item = itemAt(COPY, seed, index);
  return <article className={"mz-card" + (wide ? " mz-bento__cell--md" : "")}>
    <span className="mz-kicker">{item.label}</span>
    <strong className="mz-metric">{item.value}</strong>
    <p className="mz-note">{item.delta} against the previous sample period</p>
    <Badge kind={index % 3 === 0 ? "ok" : index % 3 === 1 ? "info" : "warn"}>{item.status}</Badge>
  </article>;
}
export function BENTO({ seed = "sample" }) {
  return <>
    <article className="mz-bento__cell mz-bento__cell--lg"><span className="mz-kicker">Performance overview</span><strong className="mz-metric">{itemAt(COPY, seed, 0).value}</strong><p className="mz-note">A focused view of the most important signals.</p><div className="mz-sparks" aria-label="Sample trend">{[42,65,52,84,71,92,76,98].map((height, i) => <span className="mz-spark" key={i} style={{ "--h": String(height) }} />)}</div></article>
    <article className="mz-bento__cell"><span className="mz-kicker">Completed</span><strong className="mz-metric">86.4%</strong><p className="mz-note">+4.2% this period</p></article>
    <article className="mz-bento__cell"><span className="mz-kicker">In progress</span><strong className="mz-metric">124</strong><p className="mz-note">Across active work</p></article>
    <article className="mz-bento__cell mz-bento__cell--md"><span className="mz-kicker">Next recommended step</span><h3>Review the latest change set</h3><p className="mz-note">Compare recent activity before publishing the next update.</p></article>
    <article className="mz-bento__cell"><span className="mz-kicker">Reliability</span><strong className="mz-metric">99.2%</strong><p className="mz-note">Within target range</p></article>
  </>;
}
export function ROWS5({ seed = "sample" }) {
  return <>{TASKS.map((task, i) => {
    const current = itemAt(TASKS, seed, i);
    return <div className="mz-row" key={String(seed) + "-row-" + i}><div><strong>{current[0]}</strong><p className="mz-note">{current[1]}</p></div><Badge kind={i % 3 === 0 ? "ok" : i % 3 === 1 ? "info" : "warn"}>{current[2]}</Badge></div>;
  })}</>;
}
export function CARDS2({ seed = "sample" }) { return <><MetricCard seed={seed} index={0} wide /><MetricCard seed={seed} index={1} /></>; }
export function CARDS4({ seed = "sample" }) { return <>{[0,1,2,3].map(i => <MetricCard key={String(seed) + "-card-" + i} seed={seed} index={i} />)}</>; }
export function CARDS6({ seed = "sample" }) { return <>{[0,1,2,3,4,5].map(i => <MetricCard key={String(seed) + "-card-" + i} seed={seed} index={i} />)}</>; }
export function FLOATINGNODES({ seed = "sample" }) {
  const nodes = [
    { x: 12, y: 18, title: "Input", detail: "Validated" },
    { x: 47, y: 12, title: "Process", detail: "Running" },
    { x: 30, y: 47, title: "Review", detail: "Needs attention" },
    { x: 66, y: 54, title: "Output", detail: "Ready" },
  ];
  const offset = seedIndex(seed) % 5;
  return <>{nodes.map((node, i) => <article className="mz-node" key={String(seed) + "-node-" + i} style={{ "--x": String((node.x + offset + i * 2) % 82), "--y": String((node.y + offset) % 76) }}><strong>{node.title}</strong><span>{node.detail}</span></article>)}</>;
}
export function PARAGRAPHS({ seed = "sample" }) {
  const first = itemAt(COPY, seed, 0);
  const second = itemAt(COPY, seed, 3);
  return <><p>The current snapshot tracks <strong>{first.label.toLowerCase()}</strong> at {first.value}. This sample narrative places the most relevant context close to the key result.</p><p>The latest comparison is {first.delta} for this period. Read it alongside {second.label.toLowerCase()} ({second.value}) instead of judging a single metric in isolation.</p><p className="mz-note">Sample guidance: confirm the underlying records and owners before turning this observation into an operational decision.</p></>;
}
export function TIMELINEITEMS({ seed = "sample" }) {
  return <>{TIMELINE.map((item, i) => <li className="mz-tl-item" key={String(seed) + "-timeline-" + i}><time dateTime={"2026-01-" + String(i + 5).padStart(2, "0") + "T" + item[0] + ":00"}>{item[0]}</time><strong>{item[1]}</strong><p className="mz-note">{item[2]}</p></li>)}</>;
}
export function FORMFIELDS({ seed = "sample" }) {
  const id = safeId(seed);
  return <>{FIELDS.map(([label, value], i) => {
    const fieldId = id + "-field-" + (i + 1);
    return <div className="mz-field" key={fieldId}><label htmlFor={fieldId}>{label}</label><input id={fieldId} className="mz-input" type={i === 1 ? "email" : "text"} defaultValue={value} autoComplete="off" /></div>;
  })}</>;
}
export function TABLEROWS({ seed = "sample" }) {
  return <>{TASKS.map((task, i) => {
    const item = itemAt(TASKS, seed, i);
    return <tr key={String(seed) + "-table-" + i}><th scope="row">{item[0]}</th><td>{item[2]}</td><td>{item[1]}</td></tr>;
  })}</>;
}
