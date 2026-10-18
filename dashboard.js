import { read } from "./storage.js";
import { icon, escapeHTML } from "./components.js";
export function metrics() {
  const s = read(),
    a = s.applications;
  const now = new Date();
  const thisMonth = a.filter((x) => {
    const d = new Date(x.appliedAt);
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  });
  const interviews = a.filter((x) => ["Interview", "Offer"].includes(x.status));
  return [
    {
      label: "Applications this month",
      value: thisMonth.length,
      ico: "briefcase",
      note: "Submitted this month",
    },
    {
      label: "Interviews",
      value: interviews.length,
      ico: "calendar",
      note: "Interview stage or beyond",
    },
    {
      label: "Saved jobs",
      value: s.saved.length,
      ico: "bookmark",
      note: "Opportunities bookmarked",
    },
    {
      label: "Success rate",
      value: `${a.length ? Math.round((a.filter((x) => x.status === "Offer").length / a.length) * 100) : 0}%`,
      ico: "chart",
      note: "Offers / total applications",
    },
  ];
}
export function metricCards() {
  return `<div class="metric-grid">${metrics()
    .map(
      (m, i) =>
        `<article class="metric-card"><div class="metric-top"><span>${m.label}</span><div class="metric-icon metric-${i}">${icon(m.ico)}</div></div><strong>${m.value}</strong><small>${m.note}</small></article>`,
    )
    .join("")}</div>`;
}
export function weekBars() {
  const a = read().applications;
  const day = 24 * 60 * 60 * 1000;
  const today = new Date();
  const counts = Array.from({ length: 7 }, (_, index) => {
    const start = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - ((6 - index) * 7 + 6),
    );
    const end = new Date(start.getTime() + 7 * day);
    return {
      label: `W${index + 1}`,
      value: a.filter((v) => {
        const d = new Date(v.appliedAt);
        return d >= start && d < end;
      }).length,
    };
  });
  const max = Math.max(1, ...counts.map((c) => c.value));
  return `<div class="bars" role="img" aria-label="Weekly applications: ${counts.map((c) => c.value).join(", ")}">${counts.map((c) => `<div class="bar-col"><b>${c.value}</b><div class="bar-track"><div class="bar-fill" style="height:${Math.max(3, (c.value / max) * 100)}%"></div></div><span>${c.label}</span></div>`).join("")}</div>`;
}
export function statusBreakdown() {
  const a = read().applications;
  const statuses = ["Applied", "Screening", "Interview", "Offer", "Rejected"];
  return `<div class="breakdown">${statuses
    .map((st) => {
      const n = a.filter((x) => x.status === st).length,
        p = a.length ? Math.round((n / a.length) * 100) : 0;
      return `<div class="breakdown-row"><div><span>${st}</span><strong>${n}</strong></div><div class="progress"><div style="width:${p}%" class="progress-${st.toLowerCase()}"></div></div></div>`;
    })
    .join("")}</div>`;
}
export function activity() {
  const items = read().activities.slice(0, 6);
  return items.length
    ? `<div class="activity-list">${items.map((x) => `<div class="activity-item"><span class="activity-dot"></span><div><strong>${escapeHTML(x.text)}</strong><small>${new Date(x.at).toLocaleString()}</small></div></div>`).join("")}</div>`
    : `<div class="empty-mini">${icon("clock", 25)}<p>No activity yet. Save or apply to a job to get started.</p></div>`;
}
