import { jobs, getJob, salaryText, initials } from "./jobs.js";
import {
  read,
  mutate,
  log,
  exportJSON,
  importJSON,
  statusList,
} from "./storage.js";
import { filterJobs, debounce } from "./filters.js";
import {
  shell,
  $,
  $$,
  icon,
  escapeHTML,
  jobCard,
  toast,
  showModal,
  closeModal,
  bindSaves,
  download,
} from "./components.js";
import {
  metricCards,
  weekBars,
  statusBreakdown,
  activity,
} from "./dashboard.js";
const page = document.body.dataset.page;
const app = $("#app");
const h = escapeHTML;
const locations = [...new Set(jobs.map((j) => j.location))].sort();
const types = [...new Set(jobs.map((j) => j.type))];
const experiences = [...new Set(jobs.map((j) => j.experience))];
const heading = (eyebrow, title, sub) =>
  `<div class="page-heading"><div><span class="eyebrow">${eyebrow}</span><h1>${title}</h1><p>${sub}</p></div></div>`;
function empty(title, description, href = "jobs.html", label = "Explore jobs") {
  return `<div class="empty-state"><div class="empty-art">${icon("briefcase", 30)}</div><h3>${title}</h3><p>${description}</p><a class="btn btn-primary" href="${href}">${label} ${icon("arrow", 16)}</a></div>`;
}
function renderHome() {
  return `<section class="hero"><div class="container hero-grid"><div class="hero-content"><span class="hero-badge">${icon("spark", 16)} THE SMARTER WAY TO JOB HUNT</span><h1>Find your next move.<br><span>Own your journey.</span></h1><p>Discover opportunities that fit you, organize every application, and turn your career ambitions into your next big thing.</p><form id="heroSearch" class="hero-search"><span>${icon("search", 20)}</span><input name="q" aria-label="Job title or skill" placeholder="Job title, skills, or company..." required><button class="btn btn-primary">Find jobs ${icon("arrow", 18)}</button></form><div class="hero-proof"><div class="mini-avatars"><span>AK</span><span>RS</span><span>MP</span></div><span><strong>Built for ambitious job seekers</strong><br>Everything you need, in one place</span></div></div><div class="hero-visual"><div class="visual-glow"></div><div class="mock-window"><div class="mock-top"><span class="mock-dot"></span><span class="mock-dot"></span><span class="mock-dot"></span><b>JobFlow / Overview</b></div><div class="mock-content"><div class="mock-label">Your job search at a glance</div><div class="mock-tiles"><div><small>Applications</small><strong>12</strong><span class="positive">↗ On track</span></div><div><small>Interviews</small><strong>03</strong><span class="positive">↗ Great progress</span></div></div><div class="mock-chart"><span>Activity this week</span><div class="mock-bars">${[35, 65, 50, 90, 70, 100, 80].map((v) => `<i style="height:${v}%"></i>`).join("")}</div></div><div class="mock-list"><span class="mock-avatar">N</span><div><b>Frontend Developer</b><small>NovaStack · Interview</small></div><span class="mock-pill">In progress</span></div></div></div><div class="float-card">${icon("check", 20)} <div><strong>You're making moves!</strong><span>Your journey starts here</span></div></div></div></div></section><section class="stats-band"><div class="container stats-grid"><div><strong>${jobs.length}+</strong><span>Curated demo jobs</span></div><div><strong>${new Set(jobs.map((j) => j.company)).size}+</strong><span>Featured companies</span></div><div><strong>5</strong><span>Tracker stages</span></div><div><strong>100%</strong><span>Free to explore</span></div></div></section><section class="section container"><div class="section-top"><div><span class="eyebrow">HANDPICKED FOR YOU</span><h2>Featured opportunities</h2><p>Good things start with the right opportunity.</p></div><a href="jobs.html" class="text-link">See all jobs ${icon("arrow", 18)}</a></div><div class="job-grid">${jobs.slice(0, 3).map(jobCard).join("")}</div></section><section class="section feature-section"><div class="container"><div class="section-center"><span class="eyebrow">YOUR CAREER CO-PILOT</span><h2>Less chaos. More progress.</h2><p>A calmer, smarter way to manage your job search.</p></div><div class="feature-grid"><div class="feature-card"><span class="feature-icon">${icon("search", 24)}</span><h3>Discover your fit</h3><p>Search and filter roles by salary, experience, location, and job type.</p></div><div class="feature-card"><span class="feature-icon">${icon("grid", 24)}</span><h3>Track every step</h3><p>Move applications across a visual Kanban board from applied to offer.</p></div><div class="feature-card"><span class="feature-icon">${icon("chart", 24)}</span><h3>See your progress</h3><p>Get clarity on applications, interviews, and weekly momentum.</p></div></div></div></section><section class="section container"><div class="section-center"><span class="eyebrow">COMPANIES WORTH WATCHING</span><h2>Meet your next team</h2><p>Explore a few of the teams in our sample job board.</p></div><div class="company-grid">${jobs
    .slice(0, 6)
    .map(
      (j) =>
        `<a class="company-tile" href="job-details.html?id=${j.id}"><span class="company-icon company-${j.id % 6}">${initials(j.company)}</span><strong>${j.company}</strong><small>View opening ${icon("arrow", 13)}</small></a>`,
    )
    .join(
      "",
    )}</div></section><section class="section testimonials"><div class="container"><div class="section-center"><span class="eyebrow">THE JOBFLOW EXPERIENCE</span><h2>Made for the moments that matter</h2><p>What job seekers value most in their search.</p></div><div class="quote-grid"><blockquote>“Finally, a place to see all my applications without digging through emails.”<footer><span class="quote-face">PS</span><span>Priya S. <small>Illustrative testimonial</small></span></footer></blockquote><blockquote>“The Kanban tracker makes it so much easier to stay organized and follow up.”<footer><span class="quote-face">RM</span><span>Rahul M. <small>Illustrative testimonial</small></span></footer></blockquote><blockquote>“Filtering by experience helped me focus on roles that actually fit.”<footer><span class="quote-face">AN</span><span>Ananya N. <small>Illustrative testimonial</small></span></footer></blockquote></div></div></section><section class="container"><div class="cta-panel"><div><span class="eyebrow">READY FOR WHAT'S NEXT?</span><h2>Your next opportunity is waiting.</h2><p>Make every application count. Start exploring today.</p></div><a href="jobs.html" class="btn btn-white">Explore opportunities ${icon("arrow", 18)}</a></div></section>`;
}
let filters = {};
let visible = 6;
function renderJobs() {
  return `<section class="container page-section">${heading("EXPLORE OPPORTUNITIES", "Find your perfect fit", "Browse curated demo opportunities and discover your next big move.")}<div class="jobs-layout"><aside class="filter-panel"><div class="filter-title"><h3>Filters</h3><button id="clearFilters" class="link-btn">Clear all</button></div><label for="fLocation">Location</label><select id="fLocation"><option value="">All locations</option>${locations.map((x) => `<option>${x}</option>`).join("")}</select><label for="fSalary">Minimum salary</label><select id="fSalary"><option value="">Any salary</option>${[5, 8, 10, 12].map((x) => `<option value="${x}">₹${x} LPA+</option>`).join("")}</select><label for="fExperience">Experience</label><select id="fExperience"><option value="">All levels</option>${experiences.map((x) => `<option>${x}</option>`).join("")}</select><label for="fType">Job type</label><select id="fType"><option value="">All types</option>${types.map((x) => `<option>${x}</option>`).join("")}</select><div class="filter-help">${icon("spark", 20)} <p>Tip: Save interesting jobs to come back to them later.</p></div></aside><div class="jobs-main"><div class="jobs-toolbar"><div class="input-icon">${icon("search", 19)}<input id="fQuery" placeholder="Search job title, company, skills..." aria-label="Search jobs"></div><select id="fSort" aria-label="Sort jobs"><option value="newest">Newest first</option><option value="salary-high">Highest salary</option><option value="salary-low">Lowest salary</option></select></div><div class="results-info"><strong id="resultsCount">${jobs.length} opportunities</strong><span>Updated regularly · Demo listings</span></div><div class="job-grid jobs-results" id="jobResults">${Array.from({ length: 3 }, () => '<div class="skeleton-card"></div>').join("")}</div><div id="loadWrap" class="load-wrap"><button id="loadMore" class="btn btn-outline">Load more jobs ${icon("arrow", 17)}</button></div></div></div></section>`;
}
function updateJobs() {
  filters = {
    query: $("#fQuery").value,
    location: $("#fLocation").value,
    salary: $("#fSalary").value,
    experience: $("#fExperience").value,
    type: $("#fType").value,
    sort: $("#fSort").value,
  };
  const filtered = filterJobs(jobs, filters);
  $("#resultsCount").textContent =
    `${filtered.length} opportunit${filtered.length === 1 ? "y" : "ies"}`;
  $("#jobResults").innerHTML = filtered.length
    ? filtered.slice(0, visible).map(jobCard).join("")
    : empty(
        "No matching jobs",
        "Try adjusting your filters or searching a different skill.",
      );
  $("#loadWrap").hidden = filtered.length <= visible;
}
function jobDetail() {
  const j = getJob(new URLSearchParams(location.search).get("id"));
  if (!j)
    return `<section class="container page-section">${empty("Job not found", "That opportunity is not available in this demo.")}</section>`;
  return `<section class="container page-section"><a class="back-link" href="jobs.html">← Back to jobs</a><div class="detail-grid"><article class="detail-main panel"><div class="detail-intro"><span class="company-icon company-${j.id % 6} big-icon">${initials(j.company)}</span><div><span class="eyebrow">${h(j.company)}</span><h1>${h(j.title)}</h1><div class="detail-tags"><span>${icon("pin", 16)} ${h(j.location)}</span><span>${icon("briefcase", 16)} ${h(j.type)}</span><span>${icon("clock", 16)} ${j.experience}</span></div></div></div><div class="detail-body"><h2>About the role</h2><p>${h(j.description)}</p><h2>What you'll do</h2><ul>${j.responsibilities.map((x) => `<li>${h(x)}</li>`).join("")}</ul><h2>What we're looking for</h2><ul>${j.requirements.map((x) => `<li>${h(x)}</li>`).join("")}</ul><h2>Skills you'll use</h2><div class="tags">${j.skills.map((sk) => `<span class="tag">${h(sk)}</span>`).join("")}</div><h2>About ${h(j.company)}</h2><p>${h(j.about)}</p></div></article><aside class="detail-side"><div class="panel detail-action"><span class="eyebrow">COMPENSATION</span><h2>${salaryText(j)}</h2><p>Per year · Estimated</p><button class="btn btn-primary btn-full" id="applyJob" data-id="${j.id}">Track application ${icon("arrow", 16)}</button><button class="btn btn-outline btn-full" data-save="${j.id}">${icon("bookmark", 17)} ${read().saved.includes(j.id) ? "Unsave job" : "Save for later"}</button><small>Demo position. Applying adds it to your tracker; no external application is submitted.</small></div><div class="panel quick-info"><h3>Job overview</h3><div><span>Location</span><strong>${h(j.location)}</strong></div><div><span>Experience</span><strong>${h(j.experience)}</strong></div><div><span>Job type</span><strong>${h(j.type)}</strong></div><div><span>Posted</span><strong>${j.postedDays ? `${j.postedDays} days ago` : "Today"}</strong></div></div></aside></div></section>`;
}
function applyModal(j) {
  showModal(
    "Add to application tracker",
    `<form id="applicationForm" class="form-stack"><p class="muted">Track your application to <strong>${h(j.title)}</strong> at <strong>${h(j.company)}</strong>. This is not a submission to the employer.</p><label>Application date<input type="date" name="date" value="${new Date().toLocaleDateString("en-CA")}" required></label><label>Status<select name="status">${statusList.map((x) => `<option>${x}</option>`).join("")}</select></label><label>Notes<textarea name="notes" rows="3" maxlength="1000" placeholder="Add notes about your application..."></textarea></label><button class="btn btn-primary btn-full">Save application</button></form>`,
  );
  $("#applicationForm").onsubmit = (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    mutate((s) => {
      const existing = s.applications.find((x) => x.jobId === j.id);
      if (existing) {
        existing.status = f.get("status");
        existing.notes = f.get("notes");
        existing.appliedAt = new Date(
          `${f.get("date")}T12:00:00`,
        ).toISOString();
      } else
        s.applications.unshift({
          id: crypto.randomUUID(),
          jobId: j.id,
          title: j.title,
          company: j.company,
          location: j.location,
          status: f.get("status"),
          notes: f.get("notes"),
          appliedAt: new Date(`${f.get("date")}T12:00:00`).toISOString(),
          interviewAt: "",
        });
    });
    log(`Tracked ${j.title} at ${j.company}`);
    closeModal();
    toast("Application saved to tracker");
    if (page === "applications") updateKanban();
  };
}
function renderApplications() {
  return `<section class="container page-section">${heading("STAY ORGANIZED", "Application tracker", "Every opportunity, every stage, all in one place.")}<div class="tracker-toolbar"><div><span class="eyebrow">YOUR PIPELINE</span><p id="trackerCount" class="muted">Move cards between columns to change status.</p></div><div class="toolbar-actions"><button id="exportCsv" class="btn btn-outline">${icon("download", 17)} Export CSV</button><button id="addManual" class="btn btn-primary">${icon("plus", 17)} Add application</button></div></div><div class="kanban" id="kanban"></div><div class="mobile-hint">On mobile, use the status dropdown on each card to change stages.</div></section>`;
}
function updateKanban() {
  const a = read().applications;
  $("#trackerCount").textContent =
    `${a.length} tracked application${a.length !== 1 ? "s" : ""} · Drag cards to update status`;
  $("#kanban").innerHTML = statusList
    .map(
      (st) =>
        `<section class="kanban-col" data-status="${st}"><div class="kanban-heading"><span class="status-dot dot-${st.toLowerCase()}"></span><h3>${st}</h3><span class="count-pill">${a.filter((x) => x.status === st).length}</span></div><div class="kanban-cards" data-drop="${st}">${
          a
            .filter((x) => x.status === st)
            .map(
              (x) =>
                `<article class="application-card" draggable="true" data-id="${h(x.id)}"><div class="application-top"><span class="company-icon company-${(x.jobId || 1) % 6}">${initials(x.company)}</span><button class="icon-btn" data-edit="${h(x.id)}" aria-label="Edit application">•••</button></div><h4>${h(x.title)}</h4><p>${h(x.company)}</p><small>${icon("calendar", 14)} ${new Date(x.appliedAt).toLocaleDateString()}</small><select class="mobile-status" data-move="${h(x.id)}" aria-label="Change application status">${statusList.map((s) => `<option ${s === x.status ? "selected" : ""}>${s}</option>`).join("")}</select></article>`,
            )
            .join("") ||
          '<div class="kanban-empty">Drop applications here</div>'
        }</div></section>`,
    )
    .join("");
  $$('[draggable="true"]').forEach((card) => {
    card.ondragstart = (e) => {
      e.dataTransfer.setData("text/plain", card.dataset.id);
      card.classList.add("dragging");
    };
    card.ondragend = () => card.classList.remove("dragging");
  });
  $$("[data-drop]").forEach((col) => {
    col.ondragover = (e) => {
      e.preventDefault();
      col.classList.add("drop-active");
    };
    col.ondragleave = () => col.classList.remove("drop-active");
    col.ondrop = (e) => {
      e.preventDefault();
      col.classList.remove("drop-active");
      moveApplication(e.dataTransfer.getData("text/plain"), col.dataset.drop);
    };
  });
}
function moveApplication(id, status) {
  if (!statusList.includes(status)) return;
  mutate((s) => {
    const a = s.applications.find((x) => x.id === id);
    if (a) a.status = status;
  });
  log(`Moved application to ${status}`);
  updateKanban();
  toast(`Moved to ${status}`);
}
function editApplication(id) {
  const a = read().applications.find((x) => x.id === id);
  if (!a) return;
  showModal(
    "Edit application",
    `<form id="editForm" class="form-stack"><label>Job title<input name="title" required maxlength="100" value="${h(a.title)}"></label><label>Company<input name="company" required maxlength="100" value="${h(a.company)}"></label><label>Location<input name="location" maxlength="100" value="${h(a.location || "")}"></label><label>Status<select name="status">${statusList.map((st) => `<option ${st === a.status ? "selected" : ""}>${st}</option>`).join("")}</select></label><label>Interview date and time (optional)<input name="interviewAt" type="datetime-local" value="${h(a.interviewAt || "")}"></label><label>Notes<textarea name="notes" maxlength="1000" rows="3">${h(a.notes || "")}</textarea></label><div class="form-actions"><button type="button" class="btn btn-danger" id="deleteApplication">${icon("trash", 16)} Delete</button><button class="btn btn-primary">Save changes</button></div></form>`,
  );
  $("#editForm").onsubmit = (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    mutate((s) => {
      Object.assign(
        s.applications.find((x) => x.id === id),
        {
          title: f.get("title").trim(),
          company: f.get("company").trim(),
          location: f.get("location").trim(),
          status: f.get("status"),
          notes: f.get("notes"),
          interviewAt: f.get("interviewAt"),
        },
      );
    });
    closeModal();
    updateKanban();
    toast("Application updated");
  };
  $("#deleteApplication").onclick = () => {
    if (!confirm("Delete this application?")) return;
    mutate((s) => (s.applications = s.applications.filter((x) => x.id !== id)));
    closeModal();
    updateKanban();
    toast("Application deleted");
  };
}
function manualApplication() {
  showModal(
    "Add an application",
    `<form id="manualForm" class="form-stack"><label>Job title<input name="title" required maxlength="100" placeholder="e.g. Frontend Developer"></label><label>Company<input name="company" required maxlength="100" placeholder="e.g. Acme Inc."></label><label>Location<input name="location" maxlength="100" placeholder="e.g. Remote"></label><label>Stage<select name="status">${statusList.map((st) => `<option>${st}</option>`).join("")}</select></label><label>Notes<textarea name="notes" rows="3" maxlength="1000"></textarea></label><button class="btn btn-primary btn-full">Add application</button></form>`,
  );
  $("#manualForm").onsubmit = (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    mutate((s) =>
      s.applications.unshift({
        id: crypto.randomUUID(),
        jobId: null,
        title: f.get("title").trim(),
        company: f.get("company").trim(),
        location: f.get("location").trim(),
        status: f.get("status"),
        notes: f.get("notes"),
        appliedAt: new Date().toISOString(),
        interviewAt: "",
      }),
    );
    log(`Added application at ${f.get("company")}`);
    closeModal();
    updateKanban();
    toast("Application added");
  };
}
function renderDashboard() {
  const a = read().applications;
  const next = a
    .filter((x) => x.interviewAt && new Date(x.interviewAt) > new Date())
    .sort((a, b) => new Date(a.interviewAt) - new Date(b.interviewAt))[0];
  return `<section class="container page-section">${heading("YOUR OVERVIEW", "Your career dashboard", "A clear picture of your progress. Keep the momentum going.")}<div class="dash-welcome"><div><h2>Keep moving forward ✨</h2><p>Every application is a step closer to your next opportunity.</p></div><a href="jobs.html" class="btn btn-primary">Explore jobs ${icon("arrow", 16)}</a></div>${metricCards()}<div class="dashboard-grid"><section class="panel chart-panel"><div class="panel-title"><div><h3>Application activity</h3><p>Last 7 weeks</p></div><span class="chip">Weekly</span></div>${weekBars()}</section><section class="panel chart-panel"><div class="panel-title"><div><h3>Pipeline breakdown</h3><p>Applications by stage</p></div></div>${statusBreakdown()}</section><section class="panel"><div class="panel-title"><div><h3>Recent activity</h3><p>Your latest actions</p></div></div>${activity()}</section><section class="panel"><div class="panel-title"><div><h3>Upcoming interview</h3><p>Stay prepared for what's next</p></div></div>${next ? `<div class="interview-card"><strong>${h(next.title)}</strong><span>${h(next.company)}</span><div class="countdown" data-time="${h(next.interviewAt)}">Calculating...</div><small>${new Date(next.interviewAt).toLocaleString()}</small></div>` : empty("No interviews scheduled", "Edit a tracked application to add an interview date.", "applications.html", "Open tracker")}</section></div></section>`;
}
function renderProfile() {
  const p = read().profile;
  const fields = [
    "name",
    "email",
    "role",
    "location",
    "bio",
    "skills",
    "linkedin",
    "github",
    "website",
    "resumeName",
  ];
  const completion = Math.round(
    (fields.filter((x) => (x === "skills" ? p.skills.length : !!p[x])).length /
      fields.length) *
      100,
  );
  return `<section class="container page-section">${heading("YOUR PERSONAL BRAND", "My profile", "Keep your details up to date as your career grows.")}<div class="profile-grid"><aside class="panel profile-summary"><div class="profile-avatar">${h(initials(p.name || "User"))}</div><h2>${h(p.name)}</h2><p>${h(p.role)}</p><span class="muted">${icon("pin", 16)} ${h(p.location)}</span><div class="completion-header"><strong>Profile completion</strong><span>${completion}%</span></div><div class="progress"><div style="width:${completion}%"></div></div><p class="muted help-text">Add skills, links and resume details to complete your profile.</p></aside><div class="panel profile-form-panel"><form id="profileForm" class="form-stack"><h3>Personal information</h3><div class="form-row"><label>Full name<input name="name" required maxlength="80" value="${h(p.name)}"></label><label>Email address<input name="email" type="email" required value="${h(p.email)}"></label></div><div class="form-row"><label>Professional headline<input name="role" maxlength="90" value="${h(p.role)}"></label><label>Location<input name="location" maxlength="90" value="${h(p.location)}"></label></div><label>About me<textarea name="bio" rows="3" maxlength="500">${h(p.bio)}</textarea></label><h3>Skills & expertise</h3><label>Skills <small>(comma-separated)</small><input name="skills" value="${h(p.skills.join(", "))}" placeholder="HTML, CSS, JavaScript"></label><h3>Links</h3><div class="form-row"><label>LinkedIn<input name="linkedin" type="url" placeholder="https://linkedin.com/in/you" value="${h(p.linkedin)}"></label><label>GitHub<input name="github" type="url" placeholder="https://github.com/you" value="${h(p.github)}"></label></div><label>Portfolio website<input name="website" type="url" placeholder="https://yourportfolio.com" value="${h(p.website)}"></label><h3>Resume</h3><div class="resume-box">${icon("upload", 22)}<div><strong id="resumeLabel">${h(p.resumeName || "No resume selected")}</strong><p>Save your resume filename for reference (file content is not uploaded or stored).</p></div><input type="file" id="resumeFile" accept=".pdf,.doc,.docx" aria-label="Select resume"></div><button class="btn btn-primary">Save profile ${icon("check", 16)}</button></form></div></div></section>`;
}
function renderSettings() {
  return `<section class="container page-section">${heading("MAKE IT YOURS", "Settings", "Personalize your workspace and manage your local data.")}<div class="settings-stack"><section class="panel settings-card"><div><h3>Appearance</h3><p>Choose a theme for your JobFlow workspace.</p></div><select id="themeSelect" aria-label="Appearance"><option value="light" ${read().theme === "light" ? "selected" : ""}>Light</option><option value="dark" ${read().theme === "dark" ? "selected" : ""}>Dark</option></select></section><section class="panel settings-card"><div><h3>Export your data</h3><p>Download a backup of saved jobs, applications, and your profile as JSON.</p></div><button id="backupExport" class="btn btn-outline">${icon("download", 17)} Export JSON</button></section><section class="panel settings-card"><div><h3>Import a backup</h3><p>Restore an earlier JobFlow JSON backup. This replaces existing local data.</p></div><label class="btn btn-outline file-button">${icon("upload", 17)} Import JSON <input id="backupImport" type="file" accept="application/json,.json" hidden></label></section><section class="panel settings-card"><div><h3>Resume keyword analyzer</h3><p>Compare resume text against a job description to spot matching keywords.</p></div><button id="analyzerOpen" class="btn btn-primary">${icon("spark", 17)} Analyze match</button></section><section class="panel settings-card"><div><h3>Delete local data</h3><p>Clear all JobFlow data stored in this browser. This cannot be undone.</p></div><button id="clearData" class="btn btn-danger">${icon("trash", 17)} Clear data</button></section><div class="notice">${icon("spark", 18)} This is a frontend-only demo. Listings and testimonials are illustrative, and data is stored only in this browser using localStorage.</div></div></section>`;
}
function analyzer() {
  showModal(
    "Resume keyword analyzer",
    `<form id="analyzeForm" class="form-stack"><p class="muted">Paste your resume and a job description to see shared terms. This is a simple keyword heuristic, not an ATS score.</p><label>Resume text<textarea name="resume" rows="5" required minlength="30" placeholder="Paste resume text here..."></textarea></label><label>Job description<textarea name="description" rows="5" required minlength="30" placeholder="Paste the job description here..."></textarea></label><button class="btn btn-primary btn-full">Analyze keywords</button><div id="analyzerResult" aria-live="polite"></div></form>`,
  );
  $("#analyzeForm").onsubmit = (e) => {
    e.preventDefault();
    const f = new FormData(e.target),
      stop = new Set(
        "the and with that this from have you will are for our your their about into work team role job using ability experience excellent strong good looking some more most other technical skills skill must preferred years year knowledge understanding develop build working we they was were can not use required as an is to of in a on it at by or be if all do".split(
          " ",
        ),
      );
    const tokenize = (t) =>
      [
        ...new Set(
          String(t)
            .toLowerCase()
            .match(/[a-z][a-z+#.]{1,}/g) || [],
        ),
      ].filter((w) => !stop.has(w) && w.length > 2);
    const keywords = tokenize(f.get("description"));
    const have = new Set(tokenize(f.get("resume")));
    const matched = keywords.filter((k) => have.has(k)),
      missing = keywords.filter((k) => !have.has(k));
    const percent = keywords.length
      ? Math.round((matched.length / keywords.length) * 100)
      : 0;
    $("#analyzerResult").innerHTML =
      `<div class="analysis-result"><h3>Keyword overlap: ${percent}%</h3><div class="progress"><div style="width:${percent}%"></div></div><p><strong>${matched.length}</strong> matching of <strong>${keywords.length}</strong> unique keywords</p><h4>Found in your resume</h4><div class="tags">${
        matched
          .slice(0, 25)
          .map((w) => `<span class="tag tag-green">${h(w)}</span>`)
          .join("") || '<span class="muted">None found</span>'
      }</div><h4>Not found in your resume</h4><div class="tags">${
        missing
          .slice(0, 25)
          .map((w) => `<span class="tag">${h(w)}</span>`)
          .join("") || '<span class="muted">None</span>'
      }</div><small class="muted">Only add skills you genuinely possess. Keyword frequency and context are not evaluated.</small></div>`;
  };
}
function setupPalette() {
  const dialog = $("#palette");
  function draw(q = "") {
    const links = [
      ["jobs.html", "Find jobs"],
      ["applications.html", "Application tracker"],
      ["dashboard.html", "Dashboard"],
      ["profile.html", "My profile"],
      ["settings.html", "Settings"],
    ];
    const entries = [
      ...links.map(([url, title]) => ({ url, title, kind: "Page" })),
      ...jobs.map((j) => ({
        url: `job-details.html?id=${j.id}`,
        title: `${j.title} · ${j.company}`,
        kind: "Job",
      })),
    ]
      .filter((x) => x.title.toLowerCase().includes(q.toLowerCase()))
      .slice(0, 9);
    $("#paletteResults").innerHTML =
      entries
        .map(
          (x) =>
            `<a href="${x.url}"><span>${h(x.title)}<small>${x.kind}</small></span>${icon("arrow", 16)}</a>`,
        )
        .join("") || '<p class="palette-empty">No results found.</p>';
  }
  function open() {
    draw();
    dialog.showModal();
    $("#paletteInput").value = "";
    $("#paletteInput").focus();
  }
  $("#cmdBtn").onclick = open;
  $("#paletteInput").oninput = (e) => draw(e.target.value);
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      dialog.open ? dialog.close() : open();
    }
  });
  dialog.onclick = (e) => {
    if (e.target === dialog) dialog.close();
  };
}
function setup() {
  document.documentElement.dataset.theme = read().theme;
  $("#themeBtn").onclick = () => {
    mutate((s) => (s.theme = s.theme === "dark" ? "light" : "dark"));
    document.documentElement.dataset.theme = read().theme;
    $("#themeBtn").innerHTML = icon(read().theme === "dark" ? "sun" : "moon");
    toast(`${read().theme === "dark" ? "Dark" : "Light"} theme enabled`);
  };
  $("#menuBtn").onclick = () => $("#mobileNav").classList.toggle("open");
  $("#modalClose").onclick = closeModal;
  $("#modal").onclick = (e) => {
    if (e.target.id === "modal") closeModal();
  };
  setupPalette();
  bindSaves(() => {
    if (page === "jobs") updateJobs();
    else if (page === "home")
      app
        .querySelectorAll("[data-save]")
        .forEach((b) =>
          b.classList.toggle(
            "is-saved",
            read().saved.includes(Number(b.dataset.save)),
          ),
        );
    else if (page === "job-details") {
      const btn = $("[data-save]");
      if (btn)
        btn.innerHTML = `${icon("bookmark", 17)} ${read().saved.includes(Number(btn.dataset.save)) ? "Unsave job" : "Save for later"}`;
    }
  });
}
const renderers = {
  home: renderHome,
  jobs: renderJobs,
  "job-details": jobDetail,
  applications: renderApplications,
  dashboard: renderDashboard,
  profile: renderProfile,
  settings: renderSettings,
};
app.innerHTML = shell((renderers[page] || renderHome)(), page);
setup();
if (page === "home") {
  $("#heroSearch").onsubmit = (e) => {
    e.preventDefault();
    location.href = `jobs.html?q=${encodeURIComponent(new FormData(e.target).get("q"))}`;
  };
}
if (page === "jobs") {
  const q = new URLSearchParams(location.search).get("q") || "";
  $("#fQuery").value = q;
  const redraw = () => {
    visible = 6;
    updateJobs();
  };
  $("#fQuery").addEventListener("input", debounce(redraw, 250));
  ["fLocation", "fSalary", "fExperience", "fType", "fSort"].forEach((id) =>
    $(`#${id}`).addEventListener("change", redraw),
  );
  $("#clearFilters").onclick = () => {
    $("#fQuery").value = "";
    ["fLocation", "fSalary", "fExperience", "fType"].forEach(
      (id) => ($(`#${id}`).value = ""),
    );
    $("#fSort").value = "newest";
    redraw();
  };
  $("#loadMore").onclick = () => {
    visible += 6;
    updateJobs();
  };
  setTimeout(updateJobs, 220);
}
if (page === "job-details") {
  const j = getJob(new URLSearchParams(location.search).get("id"));
  if (j) $("#applyJob").onclick = () => applyModal(j);
}
if (page === "applications") {
  updateKanban();
  $("#addManual").onclick = manualApplication;
  $("#kanban").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-edit]");
    if (btn) editApplication(btn.dataset.edit);
  });
  $("#kanban").addEventListener("change", (e) => {
    if (e.target.matches("[data-move]"))
      moveApplication(e.target.dataset.move, e.target.value);
  });
  $("#exportCsv").onclick = () => {
    const a = read().applications;
    const rows = [
      [
        "Title",
        "Company",
        "Location",
        "Status",
        "Applied At",
        "Interview At",
        "Notes",
      ],
      ...a.map((x) => [
        x.title,
        x.company,
        x.location,
        x.status,
        x.appliedAt,
        x.interviewAt,
        x.notes,
      ]),
    ];
    download(
      "jobflow-applications.csv",
      "\ufeff" +
        rows
          .map((row) =>
            row
              .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
              .join(","),
          )
          .join("\r\n"),
      "text/csv;charset=utf-8",
    );
    toast("CSV exported");
  };
}
if (page === "dashboard") {
  function tick() {
    const el = $("[data-time]");
    if (!el) return;
    const ms = new Date(el.dataset.time) - new Date();
    if (ms <= 0) {
      el.textContent = "Interview time reached";
      return;
    }
    const d = Math.floor(ms / 86400000),
      hours = Math.floor((ms % 86400000) / 3600000),
      min = Math.floor((ms % 3600000) / 60000);
    el.textContent = `${d}d ${hours}h ${min}m remaining`;
  }
  tick();
  setInterval(tick, 60000);
}
if (page === "profile") {
  $("#resumeFile").onchange = (e) => {
    $("#resumeLabel").textContent =
      e.target.files[0]?.name || "No resume selected";
  };
  $("#profileForm").onsubmit = (e) => {
    e.preventDefault();
    if (!e.target.reportValidity()) return;
    const f = new FormData(e.target);
    mutate((s) => {
      for (const key of [
        "name",
        "email",
        "role",
        "location",
        "bio",
        "linkedin",
        "github",
        "website",
      ])
        s.profile[key] = String(f.get(key)).trim();
      s.profile.skills = String(f.get("skills"))
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
      if ($("#resumeFile").files[0])
        s.profile.resumeName = $("#resumeFile").files[0].name;
    });
    log("Updated profile");
    toast("Profile updated successfully");
    setTimeout(() => location.reload(), 450);
  };
}
if (page === "settings") {
  $("#themeSelect").onchange = (e) => {
    mutate((s) => (s.theme = e.target.value));
    location.reload();
  };
  $("#backupExport").onclick = () => {
    download("jobflow-backup.json", exportJSON(), "application/json");
    toast("Backup downloaded");
  };
  $("#backupImport").onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const raw = await file.text();
      if (!confirm("Replace existing JobFlow data with this backup?")) return;
      importJSON(raw);
      toast("Data imported");
      setTimeout(() => location.reload(), 500);
    } catch (err) {
      toast(err.message, "error");
    }
    e.target.value = "";
  };
  $("#clearData").onclick = () => {
    if (
      !confirm(
        "Delete all saved jobs, applications, activities, and profile changes?",
      )
    )
      return;
    localStorage.removeItem("jobflow-v1");
    toast("Local data cleared");
    setTimeout(() => location.reload(), 500);
  };
  $("#analyzerOpen").onclick = analyzer;
}
