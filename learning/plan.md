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
   - [x] 5.6 Commit and push.
6. **Core features + the login gate.** Full create/edit/delete of recipes
   and assigning them to days of the week, through the actual UI, end to
   end — plus the minimal single-login gate from the MVP.
   *Deliverable: the whole MVP feature set working locally, behind a login.*
   - [x] 6.1 Redesign the schema: split into a `recipes` table
         (title/ingredients/instructions) and a `week_meal` table (day +
         a foreign key to `recipes`); migrate existing data; confirm with
         a `JOIN` query in `psql`.
   - [x] 6.2 Backend: full CRUD routes for recipes (`GET`/`POST`/`PUT`/
         `DELETE /api/recipes`), plus a route to assign a recipe to a day.
   - [x] 6.3 Frontend: a "manage recipes" UI — create/edit/delete recipes
         through real forms and buttons, wired to the new routes.
   - [x] 6.4 Frontend: assign a recipe to a day through the UI, persisted
         and visible on refresh.
   - [x] 6.5 Backend: the login gate — single hardcoded credential check
         (hashed password) blocking the API until authenticated.
   - [x] 6.6 Frontend: a login page gating access to the whole app.
   - [x] 6.7 Commit and push.
7. **Tests.** Automated tests covering core backend behavior (create a
   recipe, assign it to a day, fetch a week) as a safety net before
   deploying.
   *Deliverable: a test suite that passes and would catch a real break.*
   - [x] 7.1 Refactor: split the Express app out of `backend/index.js` into
         its own `backend/app.js` (exported, no `app.listen`) so tests can
         use it directly without a real server; confirm the app still runs
         and responds identically afterward.
   - [x] 7.2 Install Jest + Supertest; write one real test — an
         unauthenticated request to a protected route returns 401 — and
         see it pass.
   - [x] 7.3 Test the login route: correct password succeeds (and unlocks
         a protected route afterward); wrong password is rejected.
   - [x] 7.4 Test `GET /api/week` returns the expected shape once logged in.
   - [x] 7.5 Test `POST /api/recipes` actually creates a recipe.
   - [x] 7.6 Test `PUT /api/week/:day` actually assigns a recipe to a day.
   - [x] 7.7 Set up a separate PostgreSQL test database so tests can never
         corrupt real app data — including the case where a test fails or
         crashes partway through, before its own cleanup code runs. Point
         the test suite at it via environment config; confirm the existing
         6 tests still pass against it.
   - [x] 7.8 Commit and push.
8. **Live deployment.** Deploy frontend, backend, and database to Render,
   reachable at a real public URL.
   *Deliverable: the MVP bar from `project.md` — live, on the real
   internet, behind a login.*
   - [x] 8.1 Replace every hardcoded `http://localhost:3000` fetch URL
         (frontend) and the hardcoded CORS origin (backend) with
         environment-variable-driven config, so the same code works
         locally today and in production later without edits.
   - [x] 8.2 Create a Render PostgreSQL database; migrate the schema +
         seed data onto it via `psql`; confirm connectivity from the
         local machine.
   - [x] 8.3 Deploy the Express backend as a Render Web Service, wired to
         the new Postgres database via environment variables; confirm a
         live API route responds over its public URL.
   - [x] 8.4 Deploy the React frontend as a Render Static Site, pointed at
         the deployed backend's URL; confirm the live page loads.
   - [x] 8.5 Fix cross-origin cookies/CORS for the real HTTPS deployment
         (CORS origin + cookie settings for the live frontend URL);
         confirm logging in and loading the week works on the live site.
   - [x] 8.6 Confirm the full MVP end-to-end on the public URL: log in,
         create a recipe, assign it to a day, refresh and see it
         persisted; commit and push any final changes.

## Not yet broken down

Nothing currently — every section has task-level steps.

## Known issues (found, not yet fixed)

- **Stale recipe list in the day-assignment dropdown.** Found by the user
  2026-08-18. `App.jsx` and `RecipeManager.jsx` each keep their *own*
  independent `recipes` state, fetched separately. `App.jsx` only fetches
  once, in a `useEffect` keyed on `[loggedIn]` — so creating/editing a
  recipe in `RecipeManager` updates *its* local state (and its own list
  renders correctly) but has no way to tell `App.jsx` to refetch, so the
  `<select>` dropdown used for assigning a recipe to a day keeps showing
  stale data until a full page refresh. Fix (worked out 2026-08-18, not yet
  applied): lift the `recipes` state up into `App.jsx` alone, and pass both
  `recipes` and `setRecipes` down into `RecipeManager` as props. No change
  needed to `RecipeManager`'s existing create/edit/delete handlers — they
  already call `setRecipes(...)` with the correct immutable updates
  (`[...recipes, newRecipe]`, `.filter(...)`, `.map(...)`); only *where*
  that state lives changes, from two separate copies to one shared one.
