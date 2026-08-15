# meal-planner — build plan

Learning is the primary objective here, not speed. Every decision below was
picked for being the popular/boring/best-documented choice, and locked in
only after explaining back why it fit. See `learning/project.md` for who
this is for and what's in/out of scope.

Goal by the end: be able to explain how this app works end to end — not
just that it works.

## Locked decisions

1. **Language: JavaScript** (both frontend and backend, via Node.js) — the
   browser only runs JS regardless, so using it for the backend too means
   one language for the whole stack instead of two at once.
2. **Frontend: plain HTML/CSS/JS for the very first deliverable, then
   React** from the styling/interactivity section onward — a quick refresher
   on raw page/DOM basics first, then React (already familiar, and
   job-relevant) for everything after.
3. **Backend: Express.js** — minimal, huge beginner documentation, and
   keeps the backend clearly separate from the frontend (unlike Next.js),
   which matters for seeing the API as its own distinct layer.
4. **Database: PostgreSQL** — relational, and this project's actual data
   (recipes linked to days of the week) is a relational shape; SQL is also
   broadly transferable beyond this project.
5. **Hosting: Render** — free tier, deploys straight from GitHub, none of
   the infrastructure complexity of AWS. AWS was considered (industry
   standard, job-relevant) and deliberately deferred: a past AWS deploy
   didn't stick specifically because infrastructure complexity crowded out
   understanding the app itself — the same risk here. AWS redeploy of this
   already-understood app is a good *future* exercise, not part of this one.

## Build plan (sections)

Each section ends in something concrete you can see working. Source control
is set up in Section 1, before any app code, and used throughout.

1. **Foundations — Git + a static page.** Initialize Git, connect to
   GitHub, first commits pushed. Build one static HTML page (plain
   HTML/CSS/JS) showing a hardcoded fake week of recipes.
   *Deliverable: a real, version-controlled page that opens in a browser.*
   - [x] 1.1 Initialize a Git repository in the project folder.
   - [x] 1.2 Add a `.gitignore` so junk/local-only files never get tracked.
   - [x] 1.3 Make the first commit (the existing `learning/` files + `.gitignore`).
   - [x] 1.4 Create a GitHub repo, connect it as the remote, and push.
   - [x] 1.5 Build `index.html` — a static page with a hardcoded fake week of recipes.
   - [x] 1.6 Commit and push the new page.
2. **Styling + interactivity, switch to React.** Rebuild the same page in
   React, styled properly, with basic interactivity (e.g. clicking a day
   highlights it). Still hardcoded fake data, no server involved.
   *Deliverable: a page that looks and behaves like an app, nothing real
   wired up yet.*
   - [x] 2.1 Scaffold a new React project with Vite (the standard modern
         tool for this) inside the repo.
   - [x] 2.2 Replace the starter content with the hardcoded week of
         recipes, rendered via a React component.
   - [x] 2.3 Style the page properly (real CSS, not browser defaults).
   - [x] 2.4 Add click interactivity — clicking a day highlights it
         (first use of React state).
   - [x] 2.5 Commit and push the React app.
3. **A simple local server.** Stand up an Express server locally that
   responds to a request with a basic message or piece of JSON.
   *Deliverable: frontend and backend both running, as two separate things,
   for the first time.*
   - [x] 3.1 Set up a `backend/` folder with its own `package.json`
         (`npm init`), alongside `frontend/`.
   - [x] 3.2 Install Express as a dependency.
   - [x] 3.3 Write a minimal server with one route that responds with a
         basic message or JSON.
   - [x] 3.4 Run it locally and confirm the response (with the React dev
         server also still running — two separate things at once).
   - [x] 3.5 Commit and push the backend.
4. **APIs — connect frontend to backend.** The React app fetches its week
   data from the Express server instead of local hardcoded data (server
   still uses fake/in-memory data, no database yet).
   *Deliverable: the first real conversation between frontend and backend
   over HTTP.*
   - [x] 4.1 Move the hardcoded week data into `backend/index.js` as an
         in-memory array; add a `GET /api/week` route returning it as JSON.
   - [x] 4.2 In `App.jsx`, refactor the 7 hardcoded `<li>` elements into a
         `.map()` over a local array (still local data — first use of
         `.map()`/`key` in JSX).
   - [x] 4.3 Fetch the week data from the backend (`fetch` + `useEffect` +
         state) instead of the local array.
   - [x] 4.4 Fix whatever breaks on the first real cross-origin request
         (likely CORS) so the fetch actually succeeds.
   - [x] 4.5 Confirm the loop end-to-end: change the backend's fake data
         and see it reflected in the browser on refresh.
   - [x] 4.6 Commit and push.
5. **The database.** Set up PostgreSQL locally, create a recipes table,
   have the backend read real data from it instead of memory.
   *Deliverable: data that survives a server restart.*
   - [x] 5.1 Install PostgreSQL, start the service, confirm it's running.
   - [x] 5.2 Create a database and a `recipes` table, insert the fake
         week as seed rows (via `psql`).
   - [x] 5.3 Install `pg` (Node's Postgres client) in `backend/`, connect
         to the database from Express.
   - [x] 5.4 Change `/api/week` to query the database instead of the
         in-memory array.
   - [x] 5.5 Confirm the deliverable: restart the server and confirm the
         data is still there.
   - [ ] 5.6 Commit and push.
6. **Core features + the login gate.** Full create/edit/delete of recipes
   and assigning them to days of the week, through the actual UI, end to
   end — plus the minimal single-login gate from the MVP.
   *Deliverable: the whole MVP feature set working locally, behind a login.*
7. **Tests.** Automated tests covering core backend behavior (create a
   recipe, assign it to a day, fetch a week) as a safety net before
   deploying.
   *Deliverable: a test suite that passes and would catch a real break.*
8. **Live deployment.** Deploy frontend, backend, and database to Render,
   reachable at a real public URL.
   *Deliverable: the MVP bar from `project.md` — live, on the real
   internet, behind a login.*

## Not yet broken down

This is sections only, by design — no task-level steps inside each section
yet. Break a section into tasks when you're about to start it, not before.
