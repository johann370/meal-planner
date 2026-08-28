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

9. **Bug fix — shared recipe state.** Lift `recipes` state up out of
   `RecipeManager` and into `App`, the one place that already owns it,
   so both components read/write the same data instead of two separate
   copies that drift apart.
   *Deliverable: creating/editing a recipe shows up immediately in the
   day-assignment dropdown, no page refresh needed.*
   - [x] 9.1 Update `App.jsx`: pass `recipes` and `setRecipes` down into
         `<RecipeManager>` as props (`App` already owns this state).
   - [x] 9.2 Update `RecipeManager.jsx`: receive `recipes`/`setRecipes` as
         props instead of keeping its own copy — remove its own
         `useState`, `fetchRecipes` `useEffect`, and the now-redundant
         fetch, since `App` already fetches recipes on login.
   - [x] 9.3 Confirm locally: create a recipe in Manage Recipes and check
         the day-assignment dropdown updates immediately, no refresh.
   - [x] 9.4 Commit and push; confirm the same fix works on the live
         deployed site (Render auto-redeploys the frontend from GitHub).

10. **Structured ingredients + grocery list.** Replace each recipe's single
    free-text `ingredients` string with a real list of individual
    ingredient rows (quantity + unit + name), then generate a grocery
    list for the current week by combining matching ingredients across
    all of that week's assigned recipes.
    *Deliverable: a grocery list page that shows one real combined list
    ("Eggs — 5") for whatever's assigned this week, not just recipes'
    ingredients pasted one after another.*
    - [x] 10.1 Design + create a new `ingredients` table (`recipe_id`
          foreign key, `quantity`, `unit`, `name`); confirm with a test
          insert + a `JOIN` back to an existing recipe in `psql`.
    - [x] 10.2 Migrate the existing recipes' free-text `ingredients`
          strings into rows in the new table; confirm every recipe still
          has its ingredients, now structured, via a `SELECT`.
    - [x] 10.3 Backend: update the recipe CRUD routes so ingredients are
          read/written as a real list of `{quantity, unit, name}` objects
          instead of one string; confirm via `curl`.
          **Completed 2026-08-27.** `PUT /api/recipes/:id` finished:
          updates the recipe's own columns, then deletes its existing
          `ingredients` rows and inserts the new set fresh — same
          wipe-and-replace shape as `POST`/`DELETE`. Confirmed live via
          `curl` (including a real "does it actually wipe, not just add"
          check: 1 ingredient → 2 different ones, old row gone, ids
          fresh). Two real regressions surfaced and fixed while
          confirming with the automated suite, both predating today:
          (1) `meal_planner_test` was still missing the `ingredients`
          table entirely — task 10.1's `CREATE TABLE` only ever ran
          against the dev database; (2) `app.test.js`'s own test data
          still sent `ingredients` as a plain string, stale since
          `POST`/`GET`/`DELETE` were converted earlier in this task. Fixing
          both surfaced a third, pre-existing issue: Monday's `week_meal`
          row had a NULL `recipe_id` and 5 orphaned junk recipes
          (`Test Recipe` ×4, `Test Assignment Recipe`) were sitting in
          the test database — leftovers from some earlier test run that
          crashed before reaching its own cleanup code. All fixed by
          hand; full suite (6/6) passes clean as of this task's close.
    - [x] 10.4 Frontend: rewrite the recipe form's single ingredients text
          box into a repeatable list of quantity/unit/name rows (add/
          remove an ingredient row); creating a recipe sends the array.
          **Completed 2026-08-28.** `RecipeManager.jsx`'s create form
          rewritten — `ingredients` state is now an array of
          `{name, quantity, unit}` objects (starts as one blank row),
          rendered via `.map()` into one `Fragment`-keyed group of 3
          inputs per row, each wired to immutably update just its own
          field. "Add Ingredient" appends a blank row (spread pattern);
          "Delete Ingredient" removes one row via `.filter()` by index.
          Both create/edit success-callback resets updated to the new
          array shape. End-to-end deliverable confirmed live: created a
          real 2-ingredient recipe (Flour/2/cups, Sugar/1/cup) through the
          actual form — cleared correctly, new recipe appeared in the
          list. Bonus discovery: clicking Edit on it correctly loaded
          *both* ingredient rows back into the form, with no code written
          for that in this task — because `GET /api/recipes` (task 10.3)
          already returns `ingredients` as an array of
          `{name, quantity, unit}` objects, the exact shape the form's
          `.map()` expects, so `handleEditClick`'s
          `setIngredients(recipe.ingredients)` needed no translation and
          just worked. The earlier note below (task 10.5) assuming
          edit-load was broken was wrong — revised accordingly.
    - [x] 10.5 Frontend: fix display + editing everywhere ingredients show
          up, so an existing recipe's structured ingredients load back
          into the form correctly for editing.
          **Scope revised 2026-08-28:** the edit-load half of this already
          works (confirmed in task 10.4 — `handleEditClick` correctly
          populates all ingredient rows, no fix needed). What's actually
          still missing: the recipe `<li>` in the list (`RecipeManager.jsx`
          line ~68-74) renders only `recipe.title` — no ingredients shown
          anywhere except by clicking Edit. This task's real remaining
          scope is adding a read-only ingredients display to that list.
          **Completed 2026-08-28.** Added a nested `<ul>` inside each
          recipe's `<li>`, mapping over `recipe.ingredients` — the first
          list-inside-a-list in the app. Self-authored both blanks: the
          `key` (`ingredient.id`, a real database id — a step up from the
          index-based keys used everywhere else so far) and the display
          template literal (`` `${quantity} ${unit} ${name}` ``).
          Correctly predicted, unprompted, that the choice of `key` has
          zero visual effect — confirmed live, every recipe's ingredients
          now list correctly under its title.
    - [x] 10.6 Backend: a `GET /api/grocery-list` route that joins the
          current week's assigned recipes to their ingredients and
          combines matching ones (same name/unit → quantities added
          together); confirm via `curl`.
          **Completed 2026-08-28.** New route added right after
          `/api/week`: same 3-way `JOIN` shape (`week_meal` → `recipes` →
          `ingredients`) extended with `GROUP BY ingredients.name,
          ingredients.unit` + `SUM(ingredients.quantity)` — first use of
          SQL aggregation in the project. Query demonstrated live in
          `psql` first (21 raw rows → 14 grouped rows, `chicken breast`
          collapsing 4 separate "1 pound" rows into one "4 pounds" row);
          correctly predicted the collapsed row count and exact chicken-
          breast total *before* seeing it run, then self-authored wiring
          that same query into the route's `TODO(you)` blank, correct on
          the first try. Hit two real, already-understood gaps live on
          the way to confirming via `curl`: the running backend needed a
          restart to pick up the new route at all (Node doesn't
          file-watch like Vite), and that restart wiped the in-memory
          session store, requiring a fresh login before the route would
          respond. Final `curl` confirmed the exact predicted output: 14
          items, `chicken breast` at `4`.
    - [x] 10.7 Frontend: a new "Grocery List" page/view that fetches and
          displays that combined list; commit and push.
          **Completed 2026-08-28.** New `GroceryList.jsx` component,
          mirroring `RecipeManager.jsx`'s shape (own `useState` +
          `useEffect` + `fetch`) but read-only — self-authored all three
          blanks: the fetch URL, the `key`, and the display line. First
          attempt at the `key` used `item.name` alone; correctly
          predicted (once asked) that two same-named-different-unit
          ingredients would make React "silently misbehave, not crash"
          — a real latent bug, not yet triggered by today's data, since
          `GROUP BY` only guarantees `name`+`unit` unique together, not
          `name` alone. Two more attempts before landing the fix: swapped
          to `name`+`quantity` (still wrong — `quantity` is the `SUM()`
          result, not a grouped column, so it carries no uniqueness
          guarantee at all) before correctly landing on `name`+`unit`,
          matching the query's actual `GROUP BY` clause. Design decision
          made independently, correctly, before any code was written:
          unlike `recipes`, the grocery list only has one reader, so it
          correctly stays local component state — no lifting needed,
          reasoning precisely from Section 9's stale-dropdown bug (two
          components sharing data is what caused *that* bug). Confirmed
          live in the browser: 14 items rendered under the recipe list,
          no manual refresh needed.

## Dev tooling improvements

Ad hoc, outside the numbered build plan — real changes to the project,
requested directly rather than as a plan task, recorded the same way.

- [x] **Auto-reload the backend on save.** 2026-08-28: installed
      `nodemon` as a devDependency; added `"dev": "nodemon index.js"` to
      `backend/package.json`'s scripts, used instead of `node index.js`
      for local development. Confirmed live: saving a backend file now
      triggers an automatic restart, no more manual Ctrl+C/rerun.
- [x] **Skip the login gate automatically in local dev.** 2026-08-28:
      `requireAuth` (`backend/app.js`) now bypasses the auth check when
      `!process.env.DATABASE_URL && process.env.NODE_ENV !== 'test'` —
      reusing the exact "are we on Render" signal `poolConfig` already
      uses, with Jest explicitly excluded so the real 401/login tests
      keep exercising real auth. Self-authored, confirmed via a direct
      request with no session cookie succeeding locally, and the full
      6-test suite still passing unchanged. Known, accepted gap: the
      frontend's `loggedIn` state still defaults to `false`, so a full
      page refresh still shows the login form once — only mid-session
      401s after a backend restart are what this fixes; left as-is by
      choice rather than also patching the frontend.

## Not yet broken down

- **Unit-name case sensitivity in `/api/grocery-list`'s `GROUP BY`.**
  Flagged 2026-08-28 during task 10.6: `GROUP BY` matches text exactly,
  so "Pound" (Spaghetti's unit) and "pound" (everything else) stayed
  separate rows instead of combining — a real data-quality gap, not a
  query bug. Not in task 10.6's scope (case-insensitive matching was
  never asked for) and not yet turned into a task.
- **Database migrations.** Flagged 2026-08-27 after task 10.3 revealed
  `meal_planner_test` was still missing the `ingredients` table — task
  10.1's `CREATE TABLE` only ever ran by hand against the dev database,
  and nothing kept the two in sync. A real migration tool (e.g.
  `node-pg-migrate`) would replace "remember to run this SQL against
  every database" with versioned scripts + one command that applies
  whatever a given database is missing. Not yet turned into tasks.
- **Refactor backend routes from `.then()` chains to `async`/`await`.**
  Flagged 2026-08-27 during task 10.3: the `PUT /api/recipes/:id` route's
  three chained `.then()`s directly caused that task's `updatedRecipe`
  block-scoping bug (declared inside one `.then()` callback, invisible
  in a later sibling callback) — a class of bug flat, sequential
  `async`/`await` code avoids outright. Not yet started.

## Known issues (fixed)

- **Task 10.5's edit-load half was already fixed by 10.4, not broken.**
  `plan.md` originally flagged `handleEditClick`'s
  `setIngredients(recipe.ingredients)` as known-broken and explicitly
  deferred to task 10.5. Testing task 10.4's own deliverable (2026-08-28)
  showed it actually works correctly with zero extra code — `GET
  /api/recipes` (task 10.3) already returns `ingredients` as an array of
  `{name, quantity, unit}` objects, the same shape the form expects, so
  no translation was ever needed. Task 10.5's scope narrowed to just the
  recipe list's missing ingredients display.

- **Stale recipe list in the day-assignment dropdown.** Found by the user
  2026-08-18. `App.jsx` and `RecipeManager.jsx` each kept their *own*
  independent `recipes` state, fetched separately. `App.jsx` only fetched
  once, in a `useEffect` keyed on `[loggedIn]` — so creating/editing a
  recipe in `RecipeManager` updated *its* local state (and its own list
  rendered correctly) but had no way to tell `App.jsx` to refetch, so the
  `<select>` dropdown used for assigning a recipe to a day kept showing
  stale data until a full page refresh. Fixed 2026-08-19 (Section 9,
  tasks 9.1–9.4): lifted the `recipes` state up into `App.jsx` alone, and
  passed both `recipes` and `setRecipes` down into `RecipeManager` as
  props. No change was needed to `RecipeManager`'s existing create/edit/
  delete handlers — they already called `setRecipes(...)` with the
  correct immutable updates (`[...recipes, newRecipe]`, `.filter(...)`,
  `.map(...)`); only *where* that state lived changed, from two separate
  copies to one shared one. Confirmed fixed both locally and on the live
  Render site.
