# JobFlow — Modern Job Search & Application Tracker

A responsive frontend-only multi-page SaaS-style demonstration built with **HTML, CSS, and vanilla JavaScript**. There is no server, authentication, or external API.

## Running locally

1. Extract the ZIP and open a terminal in the `jobflow` folder.
2. Start a static web server (ES modules require HTTP; opening HTML with `file://` may fail):
   ```bash
   python -m http.server 8000
   ```
3. Visit `http://localhost:8000/` in a browser.

Alternatively, use the **Live Server** extension in VS Code on `index.html`.

## Pages and features

| Page | Features |
|---|---|
| `index.html` | Landing hero, job search, featured roles/companies, stats, testimonial examples |
| `jobs.html` | Dynamic job cards, debounced search, 4 filters, sorting, Load More, skeleton cards, empty states |
| `job-details.html?id=1` | Details, skills, salary, company, bookmarking, track application modal; URL query parameter |
| `applications.html` | Manual add/edit/delete, Kanban drag/drop, mobile status dropdown, CSV export |
| `dashboard.html` | Live metrics, weekly chart, stage bars, activity log, upcoming interview countdown |
| `profile.html` | Validated edit form, skills, social URLs, completion meter, resume filename selector |
| `settings.html` | Theme, JSON backup/import, delete local data, resume/job keyword analyzer |

**Global functionality:** Ctrl+K (or Cmd+K) opens an accessible command search modal. Keyboard users can navigate links and buttons. User actions show toast messages. Nav is responsive. Mock listings are generated from JavaScript arrays.

## Data persistence

All changes are stored under the `jobflow-v1` localStorage key in the current browser. JSON export/import backs up the stored values. The resume file itself is **not** stored or uploaded; only its filename is retained. This is intentionally a frontend-only sample, and browser storage is not a secure home for sensitive information.

## Try it

1. Search for a role on the landing page and filter by location or salary in Jobs.
2. Save a few roles, then view them on the Dashboard.
3. Open a role, choose **Track application**, and save it.
4. Drag the resulting card from Applied to Interview in the tracker (or use the card's dropdown on mobile).
5. Open the card's `•••` menu and enter an interview date to see the Dashboard countdown.
6. Update your Profile. Reload pages and verify the changes persist.
7. Open Settings to export a backup or try the keyword analyzer.

## Structure

```
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
├── assets/icons/
└── README.md
```

## JavaScript techniques demonstrated

ES modules, map/filter/sort/find, document DOM updates, delegated event handling, form validation, HTML dialogs, URLSearchParams, CSS variables, theme switching, keyboard commands, debouncing, drag/drop events, CRUD, localStorage, JSON import/export, CSV file creation, conditional rendering, responsive layouts, timer logic and basic text analysis.

## Notes and limitations

* Job data, salary ranges, company names, testimonial names, and posting dates are **fictional demo content**, not live vacancies.
* “Track application” does **not** send an application to an employer.
* The analyzer is an approximate unique-word overlap tool, not an authoritative ATS score.
* Browser localStorage is isolated by browser and origin and may be cleared; export JSON backups regularly.
* Static hosting works on GitHub Pages, Netlify, Vercel, and similar platforms after deployment.

## Deployment

Push the extracted directory to a GitHub repository and enable GitHub Pages for the repository root. No build step is needed.
