# JobFlow — Modern Job Search & Application Tracker

A responsive, **frontend-only** job search and application management website built with **HTML5, CSS3 and vanilla JavaScript (ES6 modules)**. JobFlow demonstrates a SaaS-style interface using dynamically rendered mock jobs and browser-based storage—**no backend, database, API keys or build step required**.

> **Demo project:** Job listings, company details, statistics, and testimonials are sample content. Tracking an application does **not** submit it to an actual employer.

## Features

| View | What you can do |
| --- | --- |
| **Home** (`index.html`) | Explore the landing page, featured jobs and companies, statistics, testimonials, and search bar. |
| **Find Jobs** (`jobs.html`) | Search roles; filter by location, salary, experience and job type; sort listings; load more results. |
| **Job Details** (`job-details.html?id=1`) | Read a role's description and requirements, view salary and location, save the job, or add it to your tracker. |
| **Application Tracker** (`applications.html`) | Create, view, edit and delete applications; move cards through Applied, Screening, Interview, Offer and Rejected using drag-and-drop or mobile controls; export CSV. |
| **Dashboard** (`dashboard.html`) | Review application metrics, weekly trends, pipeline stages, recent activity and interview countdowns. |
| **Profile** (`profile.html`) | Edit profile details, skills and social links; see profile completion; select a resume file. |
| **Settings** (`settings.html`) | Switch light/dark mode, import/export JSON data, clear local data and compare resume keywords with a job description. |

Other interface features include responsive navigation, loading skeletons, empty states, feedback toasts and a **Ctrl+K / Cmd+K** command palette.

## Tech stack

- **HTML5** — semantic page structure
- **CSS3** — CSS variables, Grid, Flexbox, transitions, responsive breakpoints and themes
- **JavaScript (ES6+)** — modules, dynamic DOM rendering, events, array methods, URL parameters, filtering, sorting, debouncing, validation, CRUD and drag-and-drop
- **localStorage** — local persistence of saved jobs, applications and user preferences

## Project structure

```text
jobflow/
├── index.html
├── jobs.html
├── job-details.html
├── applications.html
├── dashboard.html
├── profile.html
├── settings.html
├── css/
│   ├── style.css
│   ├── components.css
│   └── responsive.css
├── js/
│   ├── app.js
│   ├── jobs.js
│   ├── dashboard.js
│   ├── storage.js
│   ├── filters.js
│   └── components.js
├── assets/
│   └── icons/
└── README.md
```

## Run locally

**Option A: VS Code Live Server (recommended)**

1. Clone this repository or download its source files.
2. Open the `jobflow` folder in VS Code (the folder containing `index.html`).
3. Install/enable the **Live Server** extension if needed.
4. Open `index.html` and click **Go Live**, or right-click and choose **Open with Live Server**.
5. Your browser will open an address such as `http://127.0.0.1:5500/index.html` (the port may differ).

**Option B: Python static server**

From the folder containing `index.html`, run:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/`.

**Important:** Serve this website over HTTP rather than opening the HTML file via `file://`, because it uses JavaScript modules.

## Application workflow

1. Start on the **Home** page and search for a job title or skill.
2. Browse **Jobs**; apply search, filters and sorting.
3. Open **Job Details** to review requirements and save a role.
4. Choose **Track application** to add a job to the **Application Tracker**.
5. Change stages as the hiring process progresses; edit or delete entries when needed.
6. See updated stats and recent activity on the **Dashboard**.
7. Update your **Profile** and configure appearance/data options in **Settings**.
8. Refresh the website: data stored in your browser persists.

## Browser storage and privacy

The project stores app data in the browser's **localStorage**, using the `jobflow-v1` key. Data is **not synchronized between devices** and can be deleted when browser/site data is cleared. The resume picker records the **filename only**; no resume file is uploaded or stored. Avoid entering sensitive personal information into this demonstration. Use the JSON export option to back up your local data.

## Limitations

- No real job API, company authentication, email integration or backend database.
- **Apply/Track** means managing a demo application record, not sending it to an employer.
- Resume keyword matching is a basic text comparison, **not** an official ATS assessment.
- Local browser data is device- and browser-specific; exported JSON backups must be kept separately.

## Project purpose

Created as a frontend development assignment for **VhBuyio Academy**, showcasing practical HTML, CSS, JavaScript and responsive user-interface development.