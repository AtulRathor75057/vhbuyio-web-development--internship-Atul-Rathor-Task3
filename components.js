import { read, mutate, log } from "./storage.js";
import { initials, salaryText } from "./jobs.js";
export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [
  ...root.querySelectorAll(selector),
];
export function escapeHTML(v) {
  return String(v ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
}
export function icon(name, size = 20) {
  const paths = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    briefcase:
      '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    chart: '<path d="M4 20V10m6 10V4m6 16v-7m4 7V8"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    settings:
      '<circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3M4.9 4.9 7 7m10 10 2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1"/>',
    bookmark: '<path d="M6 4h12v17l-6-4-6 4z"/>',
    pin: '<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="2.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/>',
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41m0-14.14-1.41 1.41M6.34 17.66l-1.41 1.41"/>',
    moon: '<path d="M20 15.5A8.5 8.5 0 0 1 8.5 4a8.5 8.5 0 1 0 11.5 11.5z"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    close: '<path d="M5 5l14 14M19 5 5 19"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    check: '<path d="m4 12 5 5L20 6"/>',
    download: '<path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"/>',
    upload: '<path d="M12 17V5m-5 5 5-5 5 5M4 17v4h16v-4"/>',
    calendar:
      '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/>',
    spark:
      '<path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3m3 0-1 14H7L6 7M10 11v6m4-6v6"/>',
    chevron: '<path d="m7 10 5 5 5-5"/>',
    external: '<path d="M13 4h7v7M20 4l-9 9M20 14v6H4V4h6"/>',
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.spark}</svg>`;
}
const nav = [
  ["jobs.html", "Find Jobs", "search"],
  ["applications.html", "Applications", "briefcase"],
  ["dashboard.html", "Dashboard", "chart"],
  ["profile.html", "Profile", "user"],
];
export function shell(content, page) {
  const s = read();
  const home = page === "home";
  return `<header class="topbar"><div class="nav-inner"><a href="index.html" class="brand"><span class="brand-symbol">${icon("spark", 21)}</span>Job<span>Flow</span></a><nav class="top-links" aria-label="Main navigation">${nav.map(([href, label]) => `<a class="${page === href.replace(".html", "") ? "active" : ""}" href="${href}">${label}</a>`).join("")}</nav><div class="nav-actions"><button class="icon-btn" id="themeBtn" aria-label="Toggle dark mode" title="Toggle theme">${icon(s.theme === "dark" ? "sun" : "moon")}</button><button class="kbd-btn" id="cmdBtn" title="Search and navigate (Ctrl+K)">${icon("search", 16)} <span>Search</span> <kbd>⌘ K</kbd></button><a href="profile.html" class="avatar" aria-label="My profile">${escapeHTML(initials(s.profile.name || "User"))}</a><button class="icon-btn mobile-menu" id="menuBtn" aria-label="Toggle menu">${icon("menu")}</button></div></div><nav class="mobile-nav" id="mobileNav" aria-label="Mobile navigation">${nav.map(([href, label, ico]) => `<a href="${href}">${icon(ico)} ${label}</a>`).join("")}<a href="settings.html">${icon("settings")} Settings</a></nav></header>${home ? "" : `<div class="workspace-bar"><div class="container workspace-inner"><span class="workspace-label">YOUR WORKSPACE</span><a href="jobs.html">${icon("search", 16)} Job board</a><a href="applications.html">${icon("grid", 16)} Tracker</a><a href="dashboard.html">${icon("chart", 16)} Analytics</a><a href="settings.html">${icon("settings", 16)} Settings</a></div></div>`}<main>${content}</main><footer class="footer"><div class="container footer-inner"><span class="brand brand-small"><span class="brand-symbol">${icon("spark", 16)}</span>Job<span>Flow</span></span><span>Find your next opportunity. Keep every application on track.</span><span>© ${new Date().getFullYear()} JobFlow · Demo project</span></div></footer><div id="toastArea" class="toast-area" aria-live="polite"></div><dialog id="modal" class="modal"><div class="modal-inner"><div class="modal-heading"><h3 id="modalTitle"></h3><button id="modalClose" class="icon-btn" aria-label="Close">${icon("close")}</button></div><div id="modalBody"></div></div></dialog><dialog id="palette" class="palette"><div class="palette-search">${icon("search")}<input id="paletteInput" placeholder="Search pages and jobs..." aria-label="Search commands" autocomplete="off"><kbd>ESC</kbd></div><div id="paletteResults" class="palette-results"></div></dialog>`;
}
export function toast(message, type = "success") {
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.innerHTML = `${icon(type === "error" ? "close" : "check", 17)} <span>${escapeHTML(message)}</span>`;
  $("#toastArea").append(el);
  setTimeout(() => el.remove(), 3600);
}
export function showModal(title, html) {
  $("#modalTitle").textContent = title;
  $("#modalBody").innerHTML = html;
  $("#modal").showModal();
}
export function closeModal() {
  $("#modal").close();
}
export function jobCard(j) {
  const saved = read().saved.includes(j.id);
  return `<article class="job-card"><div class="job-header"><span class="company-icon company-${j.id % 6}">${escapeHTML(initials(j.company))}</span><div class="job-company"><strong>${escapeHTML(j.company)}</strong><span>${j.postedDays === 0 ? "Posted today" : `Posted ${j.postedDays}d ago`}</span></div><button class="icon-btn save-btn ${saved ? "is-saved" : ""}" data-save="${j.id}" aria-label="${saved ? "Unsave" : "Save"} ${escapeHTML(j.title)}" aria-pressed="${saved}">${icon("bookmark", 20)}</button></div><h3><a href="job-details.html?id=${j.id}">${escapeHTML(j.title)}</a></h3><div class="job-meta"><span>${icon("pin", 15)} ${escapeHTML(j.location)}</span><span>${icon("briefcase", 15)} ${escapeHTML(j.type)}</span></div><div class="tags">${j.skills
    .slice(0, 3)
    .map((sk) => `<span class="tag">${escapeHTML(sk)}</span>`)
    .join(
      "",
    )}</div><div class="job-footer"><div><strong>${salaryText(j)}</strong><small>Estimated salary</small></div><a href="job-details.html?id=${j.id}" class="outline-btn">View details ${icon("arrow", 15)}</a></div></article>`;
}
export function toggleSaved(id) {
  let added = false;
  mutate((s) => {
    if (s.saved.includes(id)) s.saved = s.saved.filter((n) => n !== id);
    else {
      s.saved.push(id);
      added = true;
    }
  });
  log(added ? "Saved a job" : "Removed a saved job");
  toast(added ? "Job added to saved list" : "Job removed from saved list");
  return added;
}
export function bindSaves(refresh) {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-save]");
    if (!btn) return;
    e.preventDefault();
    toggleSaved(Number(btn.dataset.save));
    if (refresh) refresh();
    else {
      btn.classList.toggle("is-saved");
      btn.setAttribute(
        "aria-pressed",
        String(btn.classList.contains("is-saved")),
      );
    }
  });
}
export function download(name, text, type = "text/plain") {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
