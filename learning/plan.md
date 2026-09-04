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

11. **Cookbook-style recipe view.** Chosen 2026-08-28 from `project.md`'s
    rated parking lot (Low difficulty, Medium importance — pure
    frontend/CSS on data that already exists, no new backend concepts).
    Display a recipe's instructions as a proper readable page
    (title/ingredients/steps laid out like a cookbook), not just a raw
    list in the management form.
    *Deliverable: clicking a recipe opens a real, readable cookbook page
    for it — not the edit form — that you could actually cook from.*
    - [x] 11.1 Frontend: new read-only `RecipeView.jsx` component — takes
          a `recipe` prop, displays its title, ingredients, and
          instructions in a clean layout (basic markup first, not styled
          yet).
          **Completed 2026-08-28.** First component in the app with zero
          hooks — pure presentational, all data arrives via props. Both
          `TODO(you)` blanks self-authored correct on the first try:
          `ingredient.id` as the key (correctly distinguishing this
          dataset — real recipe rows from `GET /api/recipes` — from
          task 10.7's grouped, id-less grocery-list data) and the
          familiar quantity/unit/name display line.
    - [x] 11.2 Frontend: wire it into `RecipeManager.jsx` — clicking a
          recipe's title opens its cookbook view (a new `viewingRecipe`
          state), with a way to close it back to the list.
          **Completed 2026-08-28.** Structural wiring (state, the
          `if (viewingRecipe) return <RecipeView .../>` early-return
          pattern, echoing `App.jsx`'s own `if (!loggedIn)` gate)
          guide-authored; the one self-authored blank (the title's
          `onClick`) initially passed `true` instead of `recipe` —
          self-spotted and fixed *before* ever running it, once asked to
          trace what `RecipeView` would do with a boolean instead of a
          real recipe object (`true.ingredients.map(...)` → a real
          crash, not silent failure). Confirmed live: click opens the
          view, Close returns to the list.
    - [x] 11.3 Frontend: style `RecipeView` properly (real cookbook-page
          CSS — heading, a clear ingredient list, a readable instructions
          block).
          **Completed 2026-08-28.** Scope question raised and answered
          first: instructions are still a single-line `<input>` (HTML
          text inputs can't hold line breaks), so multi-line "steps"
          styling was explicitly out of scope for this task, kept tight
          on request rather than silently expanded. Self-authored
          `.recipe-view`'s `border`/`max-width`/`padding`, mirroring the
          existing `.day` class. Hit a real gap live: `max-width: 80%`
          alone didn't center the block — correctly reasoned, when
          asked, that a block element defaults to the *left* side; once
          pointed at `margin` as the actual positioning property, landed
          on `margin: 0 auto` (the explicit, more idiomatic form, after
          confirming the shorthand `margin: auto` also worked).
    - [x] 11.4 Confirm the deliverable end-to-end: click into a recipe,
          see a real readable cookbook page, close it, back to managing
          recipes.
          **Completed 2026-08-28.** Confirmed live: styled, centered
          cookbook card renders on click, Close returns cleanly to the
          recipe list.
    - [x] 11.5 Commit and push. **Done 2026-08-28** — pushed as `cef49e8`.

12. **Bug fix — stale grocery list.** Found by the user 2026-08-28.
    `GroceryList.jsx` fetches `/api/grocery-list` in a `useEffect` with
    an empty dependency array — runs once, on mount, and never again.
    Since `GroceryList` mounts once (when `App` first renders after
    login) and never unmounts, reassigning a day's recipe elsewhere in
    the app (`handleAssign` in `App.jsx`) never triggers a refetch, so
    the grocery list silently goes stale the moment any assignment
    changes after initial load. Root cause correctly self-diagnosed
    unprompted, reasoning directly from the already-understood
    `useEffect([])` mechanic (task 4.3) applied to a case that hadn't
    been tested that way before.
    *Deliverable: reassigning a day's recipe updates the grocery list
    immediately, no page refresh needed.*
    - [x] 12.1 `App.jsx`: pass `week` down into `<GroceryList>` as a prop
          (`App` already owns this state, and it changes exactly when
          the grocery list needs to refresh).
    - [x] 12.2 `GroceryList.jsx`: receive `week` as a prop and add it to
          the `useEffect` dependency array, so the fetch reruns whenever
          `week` changes — not just once on mount.
          **Completed 2026-08-28** (12.1 and 12.2 done together, slightly
          out of order — `GroceryList`'s `({week})` signature and the
          `[week]` dependency array were self-authored first, before
          `App.jsx` was actually updated to pass the prop down; both
          gaps self-closed once named explicitly). Root cause correctly
          self-diagnosed unprompted, reasoning precisely from the
          already-understood `useEffect([])` mechanic: "an empty
          dependency array means it only runs once."
    - [x] 12.3 Confirm locally: reassign a day's recipe and check the
          grocery list updates immediately, no refresh.
          **Completed 2026-08-28.** Correctly predicted, unprompted, that
          it would update automatically "since week is in the dependency
          array, any time it is updated, the useEffect will run again" —
          confirmed live.
    - [x] 12.4 Commit and push. **Done 2026-08-28** — pushed as `1039aa6`.

13. **Recipe parser from a URL.** Chosen 2026-08-28 from `project.md`'s
    rated parking lot (Medium difficulty, Medium-High importance).
    Paste a recipe website's URL, auto-fill title/ingredients/
    instructions instead of typing them by hand. Most recipe sites embed
    a standard, machine-readable `schema.org` Recipe format specifically
    so tools like this can read them — scoping to that format keeps this
    a fetch-and-parse job, not a general web scraper.
    *Deliverable: paste a real recipe URL, click Import, and see a real
    new recipe appear with correct title/ingredients/instructions —
    saved into the actual database, not just previewed.*
    - [x] 13.1 Backend: install `cheerio` (HTML parsing); using a real
          recipe URL, fetch its HTML and extract the raw
          `<script type="application/ld+json">` tag's content — confirm
          via `console.log`/`curl` that it's really there.
          **Completed 2026-08-28.** New `POST /api/recipes/import-from-url`
          route (using a real, pre-verified test URL — a Budget Bytes
          recipe). Self-authored the one blank
          (`$('script[type="application/ld+json"]').first().html()`)
          past a real, self-caught-before-testing bug: `.first` written
          without its parentheses (correctly identified when asked to
          compare against `.map()`/`.filter()`, always called with
          parens elsewhere in the codebase). Confirmed live via `curl`:
          real JSON comes back, but not just the recipe — a `"@graph"`
          array of 8 different schema.org entity types (`Article`,
          `WebPage`, `Recipe`, ...), setting up task 13.2's actual job
          (finding the right one).
    - [x] 13.2 Backend: parse that JSON-LD into `{title, ingredientsRaw,
          instructions}` — pulling `name`, `recipeIngredient`, and
          `recipeInstructions` out of the schema.org Recipe object;
          confirm the extracted fields look right for a real test URL.
          **Completed 2026-08-28.** Self-authored both blanks correct on
          the first try: `jsonLd['@graph'].find(item => item['@type']
          === 'Recipe')` (first self-authored `.find()` — previously
          only seen guide-authored, task 7.5) and
          `recipeData.recipeInstructions.map(i => i.text).join('\n')`
          (first use of `.join()` in the project). Mispredicted
          `ingredientsRaw`'s length as 1 "since its an array" — corrected
          once asked to actually recount the real snippet shown moments
          earlier; confirmed live via `curl`: title exact match, 10 real
          ingredient strings, instructions correctly newline-joined.
    - [x] 13.3 Backend: parse each raw ingredient line (e.g. "2 cups
          flour") into `{quantity, unit, name}` via a simple regex-based
          parser; confirm it handles a handful of real ingredient lines
          correctly.
          **Completed 2026-08-28.** First regex ever written in this
          project, built in three small pieces against real data (10
          actual ingredient lines from the Budget Bytes test recipe):
          (1) `stripTrailingParenthetical` strips a trailing "($0.98)"-
          style note — first attempt wrote `[^*]` (one non-`*`
          character) instead of `[^)]*` (any run of non-`)` characters);
          correctly predicted, once asked to compare the two, that it
          wouldn't match a multi-character parenthetical, confirmed live.
          (2) Quantity/unit/name split via `.split(/\s+/)` (destructuring
          + rest, applied to a string split for the first time) — a real
          double-space in the source data ("1  bulb garlic") broke a
          naive `.split(' ')` first; correctly predicted the exact
          failure (`unit` coming out empty) before it was run, fixed by
          switching to a `\s+` regex. (3) Unicode fraction quantities
          (¼, ½) converted to real decimals via a small lookup table and
          a ternary fallback to `parseFloat` — since the `ingredients`
          table's `quantity` column is `numeric` and would reject the
          raw fraction characters otherwise. All 10 lines confirmed
          correct, with genuine `number`-typed quantities. Extended on
          request right after: `fractionMap` now also covers `⅛` (a
          fourth glyph) plus a `"N/D"` text form (`'1/4'`, `'1/2'`,
          `'3/4'`, `'1/8'`) for all four, in case a site writes fractions
          as plain text instead of a Unicode glyph — both forms
          confirmed working via a live test.
    - [x] 13.4 Backend: new `POST /api/recipes/import-from-url` route —
          fetch, parse, then reuse the existing recipe-creation logic to
          actually save it; confirm via `curl` with a real URL.
          **Completed 2026-08-28.** Extracted `POST /api/recipes`'s
          existing insert logic into a shared `createRecipe()` function
          (guide-authored relocation, preserving the student's own
          original logic unchanged) so both routes reuse the exact same
          save path instead of duplicating it — same "name the shared
          logic" instinct already practiced on the frontend
          (`fetchWeek`/`fetchRecipes`), now applied on the backend too.
          Self-authored both call sites past one real, meaningful async
          bug: `POST /api/recipes` first wrote
          `const newRecipe = createRecipe(req.body); res.json(newRecipe)`
          — correctly predicted, when asked, that `createRecipe(...)`
          returns a `Promise` synchronously, not the actual recipe data;
          self-fixed to the proper `.then()` chain. Confirmed via `npm
          test` (all 6 tests still pass — the refactor didn't break
          anything) and a real, correctly-predicted end-to-end `curl`
          import: `201 Created`, a genuine saved recipe (10 correctly
          parsed ingredients) now permanently in the dev database — kept
          on request, a real usable recipe, not just test output.
          **Extended on request right after:** tested against a second,
          different site (Cookie and Kate's guacamole recipe) and found
          a real, new failure mode — that site encodes fractions as HTML
          entities (`&frac12;`) instead of a Unicode glyph or plain
          text, producing `NaN` quantities. Fixed by extending
          `fractionMap` with the entity forms for all four fractions,
          same pattern as the earlier `⅛`/`"1/8"` addition. Confirmed
          live: re-imported cleanly with correct decimal quantities.
          Aside: manually running both a `curl -i | head -1` status
          check *and* a full body-display `curl` back-to-back against a
          `POST` route silently creates two real rows, not one — caused
          3 duplicate/broken "Best Guacamole" recipes, cleaned up by
          hand back down to one correct copy.
          **Extended again on request:** tested a third real site
          (Allrecipes) and hit a genuine `500` with a confusing raw
          error (`Cannot read properties of null (reading '@graph')`).
          Root-caused correctly, on the student's own machine (not just
          the sandbox) via a raw `curl` + `grep` check: that site's
          initial HTML genuinely has no `application/ld+json` tag at
          all — its structured data is added client-side by JavaScript
          after page load, which a plain `fetch()` never runs. A real
          architectural limitation, not a parser bug, and out of scope
          to fix (would need a headless browser). Self-authored a guard
          — `if (!jsonLdText) throw new Error('Could not get recipe
          data')` — so unsupported sites fail with a clear message
          instead of a confusing crash; a thrown error inside a `.then()`
          becomes a rejected promise automatically, so it still reaches
          the route's existing `.catch()` unchanged. Confirmed live.
          **Real-world coverage check, requested by the user:** tested
          10 popular recipe sites total (Food Network, Bon Appétit,
          Epicurious, Food.com, Pioneer Woman, Skinnytaste, Half Baked
          Harvest, Smitten Kitchen, King Arthur Baking, Damn Delicious).
          Roughly a third worked cleanly (King Arthur Baking joined
          Budget Bytes and Cookie and Kate); the rest failed for a few
          genuinely different reasons — no JSON-LD at all (most of the
          big media-owned sites, JS-rendered like Allrecipes), or
          JSON-LD present but with no `Recipe` type in it at all
          (Skinnytaste, Half Baked Harvest — their recipe data comes
          from some other, unexamined mechanism entirely). Each is a
          bigger undertaking than this section's scope; documented as
          real, known coverage limits rather than chased further.
    - [x] 13.5 Frontend: a small "Import from URL" form in
          `RecipeManager.jsx` (a URL input + button), posting to the new
          route and adding the returned recipe to the shared `recipes`
          state.
          **Completed 2026-08-28.** Correctly reasoned, unprompted before
          any code was written, that this control belongs *outside* the
          existing create-recipe `<form>` — a direct callback to task
          10.4's real "button defaults to type=submit" bug. Self-authored
          `handleImport` past a real, self-caught syntax bug: a stray
          comma split `fetch(url, {...})` into two disconnected pieces
          (`fetch(url)` — a bare, option-less GET — and a dangling object
          literal with `.then()` chained onto it, which would have
          thrown `TypeError: {...}.then is not a function`); self-fixed
          once asked to compare it against every other `fetch(...)` call
          in the file. Confirmed live end-to-end through the real UI
          against King Arthur Baking (kept, on request).

          **Real bug found and fixed along the way:** `handleImport` had
          no check for an error response — importing an unsupported site
          (The Kitchn) pushed the backend's `{error: "..."}` object
          straight into `recipes` as if it were a real recipe, and
          rendering it crashed the whole page (`recipe.ingredients.map`
          on an object with no `ingredients`) — reproduced and confirmed
          live, a real blank-page crash, not hypothetical. Self-authored
          an `if (newRecipe.error) { alert(...); return; }` guard,
          correctly on the second pass (first pass silently swallowed
          the error with no user feedback at all; added the `alert()`
          once asked whether that was intended). Confirmed live: The
          Kitchn now shows a clean alert instead of crashing.

          **Backend hardened further along the way:** testing surfaced a
          new site (The Kitchn) whose only `ld+json` tag has no `@graph`
          wrapper at all (just a bare `WebPage` object) — a different
          shape than any site seen before. Fixed with
          `(jsonLd['@graph'] || [])` (fallback to an empty array so
          `.find()` never crashes on `undefined`) plus a self-authored
          `if (!recipeData) throw new Error(...)` guard mirroring the
          existing `jsonLdText` guard from task 13.4 — the same "throw
          inside `.then()` becomes a rejected promise" mechanic applied
          a second time, unprompted recognition of the parallel. Testing
          Minimalist Baker afterward hit the *same* already-fixed
          category (JSON-LD present, no `Recipe` type) — confirming the
          fix generalizes rather than being one-site-specific.
          `SUPPORTED_SITES.md` corrected: Minimalist Baker and The Kitchn
          moved from a misleading "not yet tested" note to their real,
          confirmed "doesn't work" result.
          **Extended once more, a real bug found unprompted:** importing
          `https://www.budgetbytes.com/chicken-broccoli-casserole/`
          showed a price leaking into an ingredient name —
          `"cheddar cheese (shredded, (1 cup) $0.97****)"` has a
          parenthetical *inside* a parenthetical, which
          `stripTrailingParenthetical`'s `[^)]*` (can never cross *any*
          `)`, including an inner one) couldn't reach past. Correctly
          predicted the fix's effect before running it — swapping to
          greedy `.*` would "get rid of everything at the end" — refined
          into the precise mechanic (greedy match, then backtrack only
          as far as the *last* `)` in the string) and self-authored the
          one-character change. Confirmed live: the casserole imports
          cleanly now, and every previously-tested ingredient line still
          parses identically — no regressions.
    - [x] 13.6 Confirm the deliverable end-to-end: paste a real recipe
          URL, click Import, see the new recipe appear correctly in the
          app.
          **Completed 2026-08-28.** A dedicated, clean confirmation pass
          (beyond the extensive testing already done across 13.4/13.5):
          imported a fresh, not-yet-used Budget Bytes recipe
          (Scallion Herb Chickpea Salad) through the real UI — appeared
          at the bottom of the recipe list, and clicking into it opened
          a correct `RecipeView` cookbook page (Section 11), confirming
          the two features work together end-to-end, not just in
          isolation.
    - [x] 13.7 Commit and push. **Done 2026-08-28** — pushed as `285f7f0`.

14. **Code cleanup / organization.** Requested 2026-08-28: stale
    `TODO(you)` comments never got removed after being filled in,
    `backend/app.js` has grown into one large file mixing config,
    middleware, helper functions, and every route together in
    whatever order they were historically added, and the frontend's
    components all sit flat in `frontend/src/` with no folder
    structure.
    *Deliverable: the same app, behaving identically, but easier to
    find your way around — no stale comments, backend concerns split
    into their own files, frontend components grouped in a folder.*
    - [x] 14.1 Backend: remove the 3 stale `TODO(you)` comments in
          `app.js`/`index.js` that were already filled in and resolved
          long ago (confirm each one's corresponding code is correct
          before removing its comment).
          **Completed 2026-08-28.** All 3 verified correct and complete
          before removal: `index.js`'s `PORT`-vs-3000 branch (task 8.3),
          `app.js`'s `poolConfig` branch (task 8.3), and `requireAuth`'s
          local-dev bypass (ad hoc dev tooling). Confirmed nothing broke:
          all 6 tests still pass, and a live `curl` against the running
          server still returns real data.
    - [x] 14.2 Backend: extract the recipe-import helpers
          (`stripTrailingParenthetical`, `fractionMap`,
          `parseIngredient`) into their own new file, imported back
          into `app.js`.
          **Completed 2026-08-28.** New `backend/recipeParser.js`
          (guide-authored relocation, same shape as task 7.1's split),
          exporting only `parseIngredient` — its two helpers stay
          private, since nothing outside the file calls them directly.
          Self-authored wiring it back into `app.js` past one real,
          correctly-diagnosed bug: first attempt wrote
          `require('recipeParser')` (no `./`) — Node would have looked
          for an installed *package* by that name instead of the local
          file, throwing "Cannot find module." Correctly predicted this,
          unprompted, once asked to compare it against `require('cheerio')`
          — a real npm package — versus the frontend's `./`-prefixed
          local requires. Confirmed nothing broke: all 6 tests pass, and
          both `parseIngredient` directly and `app.js` as a whole load
          and produce identical results to before the split.
          **Extended right after, on request:** moved into a new
          `backend/lib/` folder (asked unprompted, connecting it to the
          same "organize the frontend into folders" goal) —
          `recipeParser.js` → `lib/recipeParser.js`, `app.js`'s require
          updated to match. Confirmed via `npm test`, all 6 still
          passing.
    - [x] 14.3 Backend: extract the route handlers into a `routes/`
          folder (matching `recipeParser.js`'s new home in `lib/`),
          leaving `app.js` as just setup/middleware/mounting.
          **Completed 2026-08-28.** The biggest refactor in this
          section: `app.js` shrank from ~200 lines to ~55. Introduced
          `express.Router()` — a self-contained, mountable mini-version
          of `app` — plus a factory-function pattern (`module.exports =
          (pool) => {...}`) so each route file gets the shared DB
          connection without a global variable. Four new files:
          `routes/auth.js`, `routes/week.js`, `routes/groceryList.js`,
          `routes/recipes.js` (guide-authored relocation of the
          student's own existing route logic, unchanged). The one real
          architectural constraint carried over carefully: `/api/login`
          stays mounted *before* `requireAuth`, everything else *after*
          — same ordering rule as before, just now spanning multiple
          `app.use('/api', require('./routes/X')(...))` lines instead
          of inline route definitions. Self-authored both blanks
          (the auth mount, and the other three) correct on the first
          try. Correctly predicted, unprompted, that all 6 tests would
          still pass — "all the logic is the same" — confirmed, plus a
          full live smoke test across all 4 route groups (`/api/week`,
          `/api/grocery-list`, `/api/recipes`, `/api/login`), all
          responding with the expected status codes.
          **Extended right after, on request:** `requireAuth` moved into
          a new `backend/middleware/` folder too — this one entirely
          self-authored, start to finish, no scaffolding (function body,
          `module.exports = {requireAuth}`, and the `app.js` wiring).
          One self-caught bug: first attempt wrote
          `require('/middleware/requireAuth.js')` — a *leading* `/`
          with no `.` before it, which correctly identified, unprompted,
          as "the filesystem root" rather than relative to `app.js` —
          fixed to `./middleware/requireAuth.js`. Confirmed via all 6
          tests plus a live check.
          **Extended once more, on request:** the `Pool`/`poolConfig`
          setup moved to `backend/lib/db.js` too, entirely self-authored.
          A real design distinction was explained first — route files
          export a *factory function* (need `pool` handed in from
          outside), but `db.js` is where `pool` itself comes from, so it
          exports the value directly. Two real, self-caught bugs, each
          correctly diagnosed once asked to trace it: (1)
          `module.exports(pool)` — *calling* `module.exports` (a plain
          object by default, not callable) instead of assigning to it,
          a `TypeError` waiting to happen; (2) `require('express-session')`
          got carried along into `db.js` by mistake (unused there), which
          silently deleted it from `app.js`, where the actual
          `app.use(session(...))` call still needed it — correctly
          predicted the resulting `ReferenceError` before running.
          Confirmed via all 6 tests plus live checks on two different
          routes.
          **Extended a final time, on request:** `app.js` reorganized so
          every `require()` sits together at the top (pulling the
          previously-inline route requires, e.g.
          `require('./routes/auth')`, out into named constants) and
          every `app.use()` call sits together right after `const app =
          express()`, instead of interspersed. One real constraint
          explained and preserved: the `app.use()` calls themselves
          couldn't be freely reordered — `cors`/`json`/`session` before
          any route needing them, the auth route before `requireAuth`,
          `requireAuth` before the protected routes — grouping only
          moved the *requires* out, not the relative order of the
          `app.use()` calls. Confirmed via all 6 tests plus a full live
          check across every route group.
    - [x] 14.4 Frontend: create a `components/` folder and move
          `RecipeManager.jsx`, `RecipeView.jsx`, `GroceryList.jsx`, and
          `Login.jsx` into it, updating every import that points to
          them.
          **Completed 2026-08-28.** Entirely self-authored, mirroring
          the backend's `lib/`/`routes/`/`middleware/` moves. One real,
          initially-wrong prediction, corrected through reasoning: first
          guessed `RecipeManager.jsx`'s own `import RecipeView from
          './RecipeView.jsx'` would need to change too — corrected once
          asked to think about relative paths as describing the
          relationship *between* two files, not an absolute location;
          since both files move into `components/` *together*, nothing
          about their relationship to each other changes. Confirmed
          correct: that internal import needed zero changes.
          `App.jsx`'s three imports needed the actual fix (staying in
          `src/` while the components moved away from it) — two
          self-caught bugs in a row: first left `App.jsx` completely
          unchanged, then a typo (`.components/...`, missing the `/`
          after the `.`) — both self-diagnosed once asked to compare
          against the correct `./` form used everywhere else. Confirmed
          live in the browser: login, recipe manager, and grocery list
          all render correctly.
    - [x] 14.5 Confirm everything still works after the reorganization
          — run the test suite, then click through the whole app
          locally (login, manage recipes, grocery list, cookbook view,
          import-from-url).
          **Completed 2026-08-28.** All 6 tests passing, and every real
          user flow confirmed working in one session: login, Manage
          Recipes (ingredients shown per recipe), grocery list, cookbook
          view (open + close), and a real import-from-url — the whole
          app, after every file it's made of moved somewhere new.
    - [x] 14.6 Backend: convert every route's `.then()`/`.catch()` chain
          to `async`/`await` with `try`/`catch`, across all 4 route
          files (`groceryList.js`, `week.js`, `recipes.js`, `auth.js`)
          plus `createRecipe()`. Requested 2026-08-28, closing out the
          future initiative flagged back in task 10.3.
          **Completed 2026-08-28.** First real backend use of
          `async`/`await` outside a test file, and the project's
          first-ever `try`/`catch`. Worked through in increasing
          difficulty: `groceryList.js` guide-authored as the first
          worked example (establishing the `.then(x => {...})` →
          `const x = await ...` and `.catch(err => {...})` → `catch
          (err) {...}` mapping); `week.js` and `auth.js` self-authored
          correctly on the first try (the latter even proactively added
          error handling that hadn't existed before); `recipes.js` (the
          biggest file, and the one that originally motivated this task
          back in 10.3) self-authored past two real, self-corrected
          bugs — a missing `await` on `pool.query(...)` in the `PUT`
          route (correctly predicted the resulting crash before it was
          ever run) and an incompletely-converted `Promise.all(...)
          .then(...)` left inside `createRecipe`. Correctly predicted,
          unprompted and before writing any code, that the `PUT` route's
          `updatedRecipe` no longer needs the `let`-hoisting trick from
          task 10.3 — flat `async`/`await` code has no more separate
          callback scopes for that bug to hide in. One real regression
          caught by prediction: converting every route's `catch` to a
          uniform generic message broke the specific, carefully-built
          `"Could not get recipe data"` error from Section 13 — restored
          by matching the app's actual original convention (`GET` routes
          generic, mutation routes pass through `err.message`).
          Confirmed via all 6 tests, live checks on every route, and a
          full `POST`/`PUT`/`DELETE` recipe cycle. Aside: a live `PUT
          /api/week/Monday` test call briefly cleared Monday's real
          assignment to `null`; caught and restored to Lasagna
          immediately.
          **Extended right after, on request:** the long single-line SQL
          query strings (`groceryList.js`'s `SELECT`, `week.js`'s
          `SELECT`, and `recipes.js`'s recipe/ingredient
          `INSERT`s/`UPDATE`) reformatted across multiple lines for
          readability — guide-authored (requested directly), but the
          *why* explained and confirmed first: a plain `'...'`/`"..."`
          string can't contain a real line break in the source at all
          (a syntax error), while backtick template literals preserve
          whatever's literally typed between them, including line
          breaks — the same tool already known for interpolation, now
          used for its other purpose. Confirmed via all 6 tests and a
          full recipe create/update/delete cycle.
    - [x] 14.7 Commit and push. **Done 2026-08-28** — pushed as `4fdf0dc`.

15. **Adopt Prisma as the database layer.** Chosen 2026-08-29: replace
    raw `pg`/`Pool` queries with Prisma — a declarative `schema.prisma`
    file as the single source of truth for the database structure, a
    real versioned migration workflow, and a type-safe query API in
    place of hand-written SQL strings. Popular, extremely well
    documented — fits the same "boring, well-trodden tool" philosophy
    as every other stack choice in this project.
    *Deliverable: the same app, behaving identically, but reading from
    and writing to the database through Prisma instead of raw SQL —
    with a real migration you can point to as proof the workflow works.*
    - [x] 15.1 Install `prisma` + `@prisma/client`; run `prisma init`
          and walk through what it scaffolds; introspect the existing
          database (`prisma db pull`) into a real `schema.prisma`
          describing the actual `recipes`/`ingredients`/`week_meal`
          tables; generate the Prisma Client.
          **Completed 2026-08-29 — a genuinely bumpy task, real tooling
          problems, not just teaching gaps:**
          - First `npm install prisma` pulled a **release candidate**
            (`prisma@8.0.0-rc.12`), mismatched against
            `@prisma/client@7.10.0`, dragging in a high-severity
            vulnerable dependency chain (`@prisma/dev` → `hono`/
            `alchemy`). Caught before building on it; both packages
            reinstalled pinned to the same stable `7.10.0`.
          - Even pinned-stable `7.10.0` has one remaining high-severity
            advisory (`deepmerge-ts`, via `@prisma/config`, a stack-
            exhaustion bug on recursive object merging) with no fix
            short of downgrading to `6.12.0`. Explicitly discussed and
            accepted: it's a `devDependency` (the CLI, not
            `@prisma/client`, which ships to production), and the
            trigger (attacker-controlled recursive config) doesn't
            apply to how the CLI actually gets used here.
          - `prisma init` scaffolded far more than expected: alongside
            the two real files (`prisma/schema.prisma`,
            `prisma7.config.ts`), it installed ~80 files of vendor
            reference documentation for AI coding assistants (Claude
            Code, Windsurf, generic `.agents/`) under `.agents/skills/`,
            `.claude/skills/`, `.windsurf/skills/`, plus
            `skills-lock.json` — none of it code to read or write,
            parked in the file map the same way `node_modules/` is.
            Also created a new `backend/.gitignore` (didn't exist
            before), already correctly excluding the generated client.
          - `prisma init`'s auto-inserted `DATABASE_URL` pointed at
            Prisma's own local dev Postgres server, not the real
            existing `meal_planner` database — replaced with the real
            connection string (same credentials as the existing
            discrete `DB_*` fields, just combined into one string),
            added to both `.env` and `.env.test`.
          - Correctly predicted the 3 real table names before running
            `db pull` (`recipes`, `ingredients`, `week_meal` — one
            initial word-order slip, "meal_week", self-corrected).
          - `db pull` surfaced a real, previously-invisible bug: the
            `recipes` table still had its old, pre-Section-10
            `ingredients` *text* column, never actually dropped — a
            genuine naming collision Prisma correctly refused to
            accept (`Field "ingredients" is already defined`),
            correctly predicted as a rejection before running.
            Confirmed via `psql` that the column was fully dead
            (`"TBD"` placeholders, blanks, one known garbled leftover
            from task 10.3's serialization bug) before getting explicit
            go-ahead to permanently drop it — from both `meal_planner`
            and `meal_planner_test` — via `ALTER TABLE recipes DROP
            COLUMN ingredients` (new SQL DDL syntax). Re-introspected
            clean afterward.
          - Generating the client with Prisma 7's *new default*
            generator (`provider = "prisma-client"`) produced raw
            TypeScript/ESM source (`import.meta.url`, bare `import`
            statements) — un-loadable by this plain CommonJS backend
            with no TS toolchain at all. Root-caused by reading
            Prisma's own bundled migration-notes reference docs (from
            the scaffolded `.agents/skills/`) rather than guessing;
            switched to the legacy `provider = "prisma-client-js"`,
            which does emit plain compiled JavaScript.
          - Even the legacy generator required one more new v7 concept:
            driver adapters are now mandatory — a bare `new
            PrismaClient()` throws
            `PrismaClientInitializationError` demanding one. Installed
            `@prisma/adapter-pg`, built a `PrismaPg` adapter from
            `DATABASE_URL`, passed it in as `{ adapter }`.
          - **Finally confirmed working end-to-end:** a real
            `prisma.recipes.findMany(...)` call returned real rows from
            the actual database.
          - **Discovered right after, a real regression, not yet fully
            fixed:** `requireAuth`'s local-dev bypass
            (`!process.env.DATABASE_URL`) silently broke, since
            `DATABASE_URL` is no longer Render-only now that Prisma
            needs it locally too — confirmed live (`/api/week` came
            back `401` instead of bypassing). Decided on a fix: a new
            explicit `LOCAL_DEV_BYPASS_AUTH=true` flag in `.env` only
            (never `.env.test`, never Render), fully under our own
            control instead of inferred from a variable that now means
            something else too. **Only half done: the flag was added to
            `.env`, but `middleware/requireAuth.js`'s condition itself
            was not yet updated to check it** — stopped here at the
            student's request. Local dev currently requires a real
            login again (same as before the dev-bypass convenience
            existed) until this is finished.
    - [x] 15.2 Finish the `requireAuth` local-dev-bypass fix: update
          `middleware/requireAuth.js`'s condition to check the new
          `LOCAL_DEV_BYPASS_AUTH` flag (already added to `.env`) instead
          of the now-unreliable `!process.env.DATABASE_URL`; confirm
          `/api/week` bypasses locally again without breaking the real
          401 test.
          **Completed 2026-08-29.** Self-authored the one-line swap to
          `if (process.env.LOCAL_DEV_BYPASS_AUTH) {...}`, correct on the
          first try — including correctly reasoning, unprompted, that the
          old condition's second half (`process.env.NODE_ENV !== 'test'`)
          is now redundant and could be dropped entirely, since
          `LOCAL_DEV_BYPASS_AUTH` simply doesn't exist in `.env.test` at
          all. Correctly predicted both halves of the confirmation before
          running anything: the real 401 test would still pass (test env
          never bypasses), and a live no-session request to `/api/week`
          would now succeed (local dev does bypass) — both confirmed
          exactly as predicted (6/6 tests; a live `curl` with no cookie
          returned real week data).
    - [x] 15.3 Convert the read-only routes (`GET /api/week`, `GET
          /api/grocery-list`, `GET /api/recipes`) to Prisma Client
          calls; confirm each returns identical data to before.
          **Completed 2026-08-29.** New `lib/prisma.js` (guide-authored
          — new library-specific plumbing, not a concept to practice):
          one shared `PrismaClient`, built with the `PrismaPg` driver
          adapter Prisma 7 now requires, exported directly like
          `lib/db.js`'s `pool`. `GET /api/recipes` converted first and
          simplest — self-authored `prisma.recipes.findMany({include:
          {ingredients: true}, orderBy: {id: 'asc'}})` correct on the
          first try, replacing the old two-query-plus-`.filter()` join
          entirely. `GET /api/week` surfaced a real, correctly-predicted
          design gap first: unlike raw SQL's **inner** `JOIN` (which
          silently drops a `week_meal` row with no matching recipe —
          task 10.3's lesson), Prisma's `include` keeps such a row with
          `recipes: null`, which would crash `.meal` access — fixed with
          a `.filter(row => row.recipes)` before the `.map()`, correctly
          reasoned through unprompted before writing any code. Hit one
          real, self-corrected bug: first attempt chained `.filter()`
          directly onto `findMany(...)` before `await`-ing it, calling
          an array method on a bare Promise — correctly predicted the
          exact crash beforehand ("filter doesn't work on a promise"),
          confirmed live via the real `TypeError`, self-fixed by
          `await`-ing into its own variable first. `GET
          /api/grocery-list` was the hardest: Prisma's query builder
          can't reproduce a `GROUP BY` across a multi-table `JOIN`
          directly, so it's fetched nested (`week_meal` →`recipes`
          →`ingredients`) and combined in JS instead — first use of
          `.flatMap()` (flatten each day's ingredient list into one) and
          `.reduce()` (build one combined list, using the already-known
          `.find()` to detect a matching name+unit and merge into it).
          A real, pre-flagged gotcha handled correctly: Postgres
          `numeric` columns come back from Prisma as Decimal *objects*,
          not plain numbers — confirmed live that plain `+` between two
          of them string-concatenates (`"1" + "0.5"` → `"10.5"`) instead
          of adding; self-authored the fix using `parseFloat()`, an
          unprompted correct reuse of the exact tool from task 13.3's
          fraction parser in a brand-new context. Live output confirmed
          the multiplication case matters and works: `chicken breast`
          summed to `3` and `curry powder`/`coconut milk` to `4`/`2`,
          correctly reflecting Chicken Curry being assigned to *two*
          different days, not deduplicated. One more real gap
          self-diagnosed after being asked to look: the combined list
          came back unsorted (the old SQL's `ORDER BY ingredients.name`
          had no Prisma equivalent left) — self-added
          `.sort((a,b) => a.name.localeCompare(b.name))`, confirmed
          alphabetical again. Final regression, unprompted correct
          diagnosis: `npm test` passed 6/6 but Jest warned about an open
          handle again — correctly reasoned, from the exact same task
          7.3 lesson, that the new Prisma Client (a second database
          connection) needed its own cleanup; self-authored `app.prisma
          = prisma` in `app.js` and `await app.prisma.$disconnect()`
          alongside the existing `app.pool.end()` in `app.test.js`'s
          `afterAll`, confirmed clean. All 6 tests pass, all 3 routes
          curled and confirmed against real data. Known loose end,
          deliberately deferred to task 15.5: `groceryList.js`'s
          factory still takes an now-fully-unused `pool` parameter,
          since that file's only route no longer touches it at all.
    - [x] 15.4 Convert the write routes (`POST`/`PUT`/`DELETE
          /api/recipes`, `PUT /api/week/:day`, plus `createRecipe`) to
          Prisma Client, including the nested recipe→ingredients
          relationship; confirm via a full create/update/delete cycle.
          **Completed 2026-08-29.** Found at the start of this task that
          `createRecipe` (used by `POST /api/recipes`), `PUT
          /api/recipes/:id`, and `PUT /api/week/:day` were *already*
          converted to Prisma in the working tree — real, working code
          (all 6 tests passed against it), just never logged here or
          checked off, likely from a session that ended before the docs
          caught up. `createRecipe` uses `prisma.recipes.create` with a
          nested `ingredients: { create: [...] }` (the recipe→ingredients
          relationship written in one call); `PUT /api/recipes/:id` uses
          `prisma.recipes.update` with nested `ingredients: { deleteMany:
          {}, create: [...] }` (wipe-and-replace, same shape as the old
          raw SQL); `PUT /api/week/:day` uses `prisma.week_meal.findFirst`
          + `.update`. Only `DELETE /api/recipes/:id` actually needed new
          work this task: self-authored both lines correct on the first
          try (`prisma.ingredients.deleteMany({where: {recipe_id:
          ...}})` then `prisma.recipes.delete({where: {id: ...}})`),
          after correctly predicting, unprompted, that skipping the
          ingredients step and deleting the recipe directly would be
          blocked by the foreign key — the same rule already understood
          from raw SQL (Section 10), now correctly recognized as still
          applying under Prisma. Confirmed via all 6 tests plus a real
          live `curl` create → update → delete cycle: recipe created with
          an ingredient, updated to a new title/ingredient, deleted
          (`204`), then confirmed genuinely gone from `GET /api/recipes`.
          Noted but deliberately left alone: `recipes.js`'s `pool`
          parameter is now unused (every route in the file is on Prisma)
          — flagged for task 15.5, not fixed here.
    - [x] 15.5 Retire the raw `pg` `Pool` (`lib/db.js`) once nothing
          else depends on it; confirm the full test suite and a live
          click-through of the whole app still pass.
          **Completed 2026-08-29.** Removed `pool` from the three route
          factories' signatures first — while `app.js` still called them
          with `(pool, prisma)`, deliberately, to see the real
          consequence: JS binds function arguments **by position, not
          name**, so each file's `prisma` parameter was actually catching
          `pool` (the first positional argument), not the real Prisma
          client. Correctly predicted, once redirected from an initial
          "unused parameter" framing, exactly which value would bind
          (`pool`) and that `npm test` would break as a result —
          confirmed live via a real `TypeError: Cannot read properties of
          undefined (reading 'findMany')` and 3 real test failures.
          Fixed by updating `app.js`'s three mounting calls to
          `recipesRoutes(prisma)` etc.; correctly predicted the return to
          green, confirmed (6/6). Then retired the rest of `pool` itself:
          removed `app.js`'s `require('./lib/db.js')` and `app.pool =
          pool`, and `app.test.js`'s `await app.pool.end()`, correctly
          predicting each step's outcome before running it (including
          that deleting `lib/db.js` *before* removing those references
          would throw a "missing module" error, same as Section 14).
          Deleted `lib/db.js` itself once nothing referenced it anymore;
          confirmed via `npm test`. Closed out by running `npm uninstall
          pg` — correctly predicted `package.json` would lose the entry
          and the app would behave identically; `pg` itself stayed in
          `node_modules` because `@prisma/adapter-pg` still genuinely
          depends on it internally, a real distinction between a direct
          and a transitive dependency. Confirmed via all 6 tests, then a
          real live click-through of the whole app.

          **A real bug surfaced during that click-through, unrelated to
          today's `pool` cleanup:** changing a day's recipe through the
          actual dropdown silently failed. Root-caused via a `curl`
          reproduction, not guessed at: an HTML `<select>`'s `onChange`
          always hands back `e.target.value` as a **string**, even for a
          list of numeric recipe ids — `PUT /api/week/:day` was receiving
          `{recipeId: "3"}`. The old raw-SQL version never noticed, since
          `pg`/Postgres casts a string parameter to an integer column
          automatically; Prisma's typed client is strict about it and
          threw a real `Invalid value provided. Expected Int ... provided
          String` `500` — a latent regression from task 15.3's Prisma
          conversion of this route, invisible until a real browser
          dropdown (rather than a `curl` call already sending a number)
          exercised it. Correctly identified, when asked, that the fix
          belongs on the backend (matching `recipes.js`'s existing
          `parseInt(id)` convention) rather than the frontend; self-authored
          wrapping `recipeId` in `parseInt(...)` before it reaches
          `prisma.week_meal.update(...)`, correct on the first try.
          Confirmed via a repeat `curl` (now succeeds), all 6 tests, and
          a second real click-through — reassigning Tuesday's recipe in
          the actual browser now sticks.
    - [x] 15.6 Create one real schema change through Prisma Migrate
          (versioned migration file, not hand-run SQL) as concrete
          proof the migration workflow works — closing out the
          "database migrations" future initiative flagged in task 10.3.
          **Completed 2026-08-29.** The real, unavoidable complication:
          `schema.prisma` was introspected from an *already-existing*
          database (task 15.1), so there was no migration history yet —
          running `prisma migrate dev` directly would have tried to
          `CREATE TABLE` everything from scratch, hit "already exists,"
          and Prisma would have offered to fix the mismatch by
          **resetting the database — all data lost**. Correctly predicted
          this would touch nothing on its own, confirmed live via a real
          "Drift detected... We need to reset" message that stopped
          short of actually doing it. Fixed via the documented
          "baselining" recipe (checked against Prisma's own reference
          docs rather than guessed at, given the destructive stakes):
          `prisma migrate diff --from-empty --to-schema ...` generated a
          real `CREATE TABLE ...` SQL file purely from a schema
          comparison (no database touched at all), manually placed in a
          new `prisma/migrations/0_init/` folder, then `prisma migrate
          resolve --applied 0_init` recorded it as already-done without
          running the SQL — correctly predicted neither step would touch
          real data, confirmed via `prisma migrate status` ("up to date")
          and a live recipe-count check.

          With the baseline in place, added a genuine new field —
          `recipes.created_at DateTime? @default(now())` — self-authored
          in `schema.prisma` past one real, caught mistake: first wrote
          `DateTime @optional @default(now())` (`@optional` isn't a real
          Prisma attribute); corrected to `DateTime?` once pointed at
          `title String?` two lines up as the existing pattern for
          "optional." `prisma migrate dev --name
          add_recipe_created_at` then generated and applied a real,
          versioned `ALTER TABLE recipes ADD COLUMN created_at ...`
          migration file, correctly predicted beforehand.

          Two genuine gaps surfaced and resolved after that, both dug
          into rather than skipped past: (1) the new field didn't show
          up in a live `curl` response at first — correctly reasoned
          (once redirected from "the server needs a restart" to the more
          precise "the generated client code") that `lib/generated/prisma`
          is a frozen snapshot from the last `prisma generate`, not
          something that updates automatically when `schema.prisma`
          changes; fixed by regenerating, confirmed live. (2) raised an
          unprompted, genuine concern that existing recipes' `created_at`
          would be missing — checked directly via a raw query and found
          the *opposite*: Postgres backfills a `DEFAULT` onto every
          existing row the moment the column is added, evaluated once at
          migration time, not left blank just because the field is
          optional going forward. Then a real, predicted-correctly-once-
          diagnosed regression: 3 tests failed against `meal_planner_test`
          with `The column recipes.created_at does not exist` — correctly
          reasoned, unprompted, that the migration had only ever touched
          the dev database, applying the exact "dev and test are separate
          databases" lesson from Section 7 to a new context (migrations,
          not just app data). Fixed by baselining and then `migrate
          deploy`-ing the same two migrations against `meal_planner_test`
          too (via a small script loading `.env.test` rather than typing
          test credentials into a command). Confirmed via all 6 tests,
          then two full live click-throughs of the whole app (the first
          predated the `created_at` regen and was premature; the second,
          after every fix, held).
    - [x] 15.7 Commit and push. **Done 2026-08-29** — pushed as `539f39c`.
          Along the way, the 71 vendor AI-assistant reference doc files
          `prisma init` had scattered into `.agents/`, `.claude/skills/`,
          `.windsurf/skills/`, and `skills-lock.json` (task 15.1) were
          added to `backend/.gitignore` rather than committed — real
          content, but not code anyone on this project wrote, reads, or
          maintains, so excluded the same way `node_modules` is.

16. **Multi-line recipe instructions (`<textarea>` upgrade).** Chosen
    2026-08-30 from `plan.md`'s "Not yet broken down" list (flagged
    2026-08-28 during task 11.3). `RecipeManager.jsx`'s instructions field
    is a single-line `<input>`, which can't hold a line break at all, so
    every recipe's instructions are stuck as one run-on line — confirmed
    the backend needs no changes at all: `instructions` is already a
    plain `String?` (Postgres `text`) column, and Section 13's URL
    importer already proved newlines survive a full round-trip through it
    (`recipeInstructions.map(...).join('\n')`).
    *Deliverable: type real multi-line instructions (actual Enter
    presses) into a recipe, save it, and see those line breaks rendered
    for real on the cookbook page — not one run-on sentence.*
    - [x] 16.1 Frontend: swap the create/edit form's instructions
          `<input>` for a `<textarea>` in `RecipeManager.jsx`; confirm
          pressing Enter while typing actually inserts a line break
          (check via the browser's dev tools / a quick log of the
          `instructions` state), not just wraps visually.
          **Completed 2026-08-30.** Self-authored in the editor (a
          `TODO(you)` marker left in place of the line): same
          `value`/`onChange`/`placeholder` props carried over unchanged,
          correct on the first try, including the closing tag a
          `<textarea>` needs that a self-closing `<input />` doesn't.
          Correctly predicted, before touching the file, that pressing
          Enter would insert a line break rather than doing nothing —
          then correctly predicted a second, sharper distinction once
          it was raised: the *old* `<input>`, sitting inside a `<form>`,
          would have had Enter *submit the form* instead (a browser
          default for text inputs, not textareas) — confirmed live both
          times, no early submission, a real second line typed cleanly.
    - [x] 16.2 Confirm the deliverable's persistence half: create a
          recipe with real multi-line instructions, then click Edit on
          it and confirm the textarea loads the exact same line breaks
          back — proof the round trip through the backend survives, not
          just guessed at.
          **Completed 2026-08-30.** Correctly predicted, unprompted
          reasoning from the already-understood fact that
          `instructions` is a plain text column with no special
          processing, that the exact same line breaks would come back
          — confirmed live: saved a real 2-line recipe, clicked Edit,
          textarea reloaded with the identical line breaks intact.
    - [x] 16.3 Frontend: fix `RecipeView.jsx`'s display so the saved
          line breaks actually render as separate lines (a plain
          `<p>` collapses newlines by default) — real cookbook-style
          steps, not one paragraph.
          **Completed 2026-08-30.** Self-authored both blanks correct on
          the first try: a `className="instructions"` on the `<p>` in
          `RecipeView.jsx`, and a matching `.recipe-view .instructions {
          white-space: pre-line; }` rule in `App.css`, nested the same
          way as the file's existing `.recipe-view h2`/`.recipe-view li`
          rules. Correctly predicted, before running, that the already-
          saved 2-line recipe would now show as two real separate lines
          instead of one run-on paragraph — confirmed live.
    - [x] 16.4 Frontend: style the textarea in `App.css` (a sensible
          height, resizable) so it looks intentional, not like a
          leftover `<input>`.
          **Completed 2026-08-30.** Self-authored both blanks correct on
          the first try: `className="instructions-input"` on the
          `<textarea>` in `RecipeManager.jsx`, and `.instructions-input
          { height: 4em; resize: vertical; }` in `App.css`. Correctly
          predicted, before touching anything, that `resize: vertical`
          would allow dragging the corner handle to change height only,
          never width — confirmed live, including that the field now
          shows at a real multi-line height by default instead of one
          cramped line.
    - [x] 16.5 Confirm the full deliverable end-to-end: type a real
          multi-line recipe, save it, open its cookbook view, and see
          each step on its own line.
          **Completed 2026-08-30.** A fresh, not-yet-used recipe (3 real
          steps, typed with actual Enter presses) created and confirmed
          via the actual cookbook view (opened by clicking the title —
          `RecipeView.jsx`, task 16.3's fix), not just the Edit form.
          One real gap surfaced and corrected first: initially answered
          that multi-line steps would only show "after you click edit,"
          conflating Edit's textarea (which always displays real line
          breaks natively, no CSS involved — already proven in task
          16.2) with the separate cookbook view opened by clicking the
          recipe's title, the actual UI path this task's deliverable is
          about. Corrected once the distinction was pointed out;
          confirmed live afterward that the cookbook view itself works
          as expected.
    - [x] 16.6 Commit and push. **Done 2026-08-30** — pushed as `87357aa`.

17. **Grocery list ingredient normalization.** Flagged 2026-08-28 (task
    10.6's leftover note) and expanded 2026-08-31: `GET
    /api/grocery-list`'s combining logic (Section 15's `.reduce()` +
    `.find()` on exact `name`+`unit` match) treats two ingredients as
    different list entries any time their text differs at all — even
    when they're really the same thing, like different capitalization
    ("Pound" vs "pound") or different words for the same unit ("lb" vs
    "pound").
    *Deliverable: two recipes calling the same ingredient by a
    differently-cased name or a different unit word show up as one
    correctly-combined grocery list entry, not two.*
    - [x] 17.1 Check the real data first: query the `ingredients` table
          via `psql` for actual case/unit variations across recipes,
          confirming the problem's real shape before writing any code
          (same move as task 10.6's live `psql` check).
          **Completed 2026-08-31.** `SELECT name, unit FROM ingredients
          ORDER BY LOWER(name), LOWER(unit)` (44 rows) confirmed the
          problem is real, not hypothetical: `spaghetti | lb` and
          `Spaghetti | Pound` are the same real ingredient, split across
          two rows by both case *and* unit-word differences at once —
          exactly the combined case this section needs to fix. Predicted
          "mostly consistent" beforehand; correct on ingredient *names*
          (most spellings do match), but real unit-word variation turned
          out more widespread than expected (`Pound`/`pound`, `lb`/`lb.`,
          `tablespoon`/`Tbsp`, `cup`/`cups`) — spotted directly in the
          data, once pointed at the right row, without being told the
          answer. Aside, out of scope: a stray `Test | pound` row (junk
          leftover from past test-cleanup gaps, see task 15.x-era notes)
          — flagged, not touched.
    - [x] 17.2 Backend: write a small `normalizeUnit` helper (lowercase +
          a synonym lookup table mapping known aliases — `lb`/`lbs`/
          `pounds` → `pound`, etc.) — a new lookup-table function, same
          shape as Section 13's `fractionMap`; confirm it against a
          handful of real inputs.
          **Completed 2026-08-31.** New `unitSynonyms` table + `normalizeUnit`
          added to `groceryList.js` (not yet wired into the route —
          that's 17.3). Scaffolded with 2 `TODO(you)` blanks: the table
          itself, and the return line. Self-authored the return line
          correct on the first try (`unitSynonyms[cleaned] || cleaned`),
          reinforcing the `||`-fallback pattern first seen guide-authored
          in task 13.5. First table draft chose "full word → abbreviation"
          direction (`pound`→`lb`) — the opposite of the initial plan
          (`lb`→`pound`) but equally correct, just a different canonical
          form; carried through consistently from there. Correctly
          predicted `normalizeUnit`'s output for `lb`/`lb.`/`Pound`/`Tbsp`
          against the table's first version, 3 of 4 right — mispredicted
          `Tbsp` would keep its capital, not accounting for `cleaned`
          (already lowercased) being what the fallback actually returns;
          self-diagnosed the exact mechanism once asked to trace it.
          Proposed, unprompted, generalizing `"lb."` from a one-off table
          entry into a `.replace(/\.$/, '')` regex strip (the same move
          as Section 13's `stripTrailingParenthetical`) — self-authored
          the regex correct on the first try, including a real
          independent addition beyond what was explained (only period-
          escaping was discussed; the `$` end-anchor, so only a *trailing*
          period gets stripped, was the student's own addition). Predicted
          the post-regex output for all 4 units correctly, confirmed live.
          Self-added `cups`→`cup` on request (a real remaining gap from
          task 17.1's data, not covered by the regex) plus, unprompted,
          `pounds`→`lb` and `ounce`→`oz`. Final confirming run
          (`cup`/`cups`/`pound`/`pounds`) mispredicted 2 of 4 — expected
          `pound`/`pounds` to stay unchanged, not realizing the earlier
          table-direction flip made `"pound"` itself a *source* key
          mapping away to `"lb"`, not the canonical destination;
          self-diagnosed correctly once asked to trace the lookup.
          Temporary test `console.log` lines removed once confirmed.
          **Extended right after, on request:** `tablespoons`→`tbsp`,
          `teaspoons`→`tsp`, and `ounces`→`oz` filled in — the remaining
          plural forms for every abbreviation-style unit already in the
          table, applying the established `pounds`→`lb`/`cups`→`cup`
          convention. Guide-authored directly (a mechanical extension of
          an already-set pattern, not new territory) at the student's
          request; entries reordered singular-next-to-plural for
          readability, no value changes.
    - [x] 17.3 Backend: use the normalized name/unit as the grouping key
          in `groceryList.js`'s `.reduce()` instead of the raw values, so
          matching ingredients actually combine; confirm via `curl`
          against real recipe data.
          **Completed 2026-08-31.** Confirmed the real 17.1 test case
          wasn't actually reachable yet — `spaghetti|lb` (Spaghetti Aglio
          e Olio, id 37) and `Spaghetti|Pound` (Spaghetti Bolognese, id 2)
          belong to two *different* recipes, and only Bolognese was in
          the current week. Temporarily reassigned Sunday to Aglio e Olio
          via a real `PUT /api/week/Sunday` call to make both reachable
          at once (same "note it, change it, restore it" pattern as task
          7.6's tests) — restored afterward, confirmed the full week
          matches the original exactly.

          Self-authored the fix past the guide-left `TODO(you)`: an
          unprompted, generalized `normalizeIngredient(rawIngredient)`
          function (mirroring `normalizeUnit`'s shape, applying the
          already-practiced "extract shared logic" instinct rather than
          inlining `.toLowerCase()` directly), then correctly rewrote the
          `.find()` comparison to use both normalized values, correct on
          the first try.

          Correctly predicted the headline result (spaghetti would
          combine into one line) before testing — confirmed live: one
          `Spaghetti`/`Pound` entry instead of two. But two real
          sub-predictions missed, both dug into rather than skipped past:
          (1) predicted quantity `2`, actual was `3` — had only accounted
          for Bolognese's existing Monday+Tuesday total, forgetting the
          newly-added third occurrence (Aglio e Olio's own `1`); walked
          through and self-corrected once asked to recount. (2) predicted
          the *label* would show `lb` (the canonical unit form); actual
          was the raw `Pound` — correctly identified, when asked, that
          the create-new-entry branch (line 44) stores raw `ingredient.name`/
          `unit`, not normalized values, but initially guessed *whichever
          occurrence is processed last* wins that label, when it's
          actually *whichever is processed first* (the create-branch only
          fires once, for the first unmatched occurrence; every later
          match only ever updates `quantity`). Corrected via walking
          through the two `.reduce()` branches. Real, useful finding
          surfaced by this mistake: the displayed label is order-
          dependent on which recipe happens to get processed first, not
          on anything about the data itself — directly motivating task
          17.4 (deciding what a merged group should actually display).
    - [x] 17.4 Decide + confirm what label displays for a merged group
          (e.g. the normalized form, not whatever raw string happened to
          group them) — check the `/api/grocery-list` JSON output looks
          right.
          **Completed 2026-08-31.** Design question raised explicitly
          before any code: normalizing the unit alone is easy to accept,
          but normalizing the *name* means real proper nouns (`"Italian
          parsley"`) display lowercased — a genuine style trade-off, not
          hidden. Chose to normalize both. Self-authored the fix in
          `groceryList.js`'s create-new-entry branch (line 44), ahead of
          any scaffolded blank — swapped `ingredient.name`/`ingredient.unit`
          for `normalizeIngredient(ingredient.name)`/
          `normalizeUnit(ingredient.unit)`. Correctly predicted the exact
          live output (`spaghetti`/`lb`/`3`) before testing, reusing the
          same temporary Sunday-reassignment test setup from task 17.3
          (restored correctly afterward, this time verified against the
          real recipe id first). Correctly explained, when asked, *why*
          this makes the label deterministic regardless of which
          recipe's occurrence is processed first — sharpened from "we
          normalize the stored values" to the precise mechanism: since
          `normalizeIngredient`/`normalizeUnit` map every raw variant of
          the same ingredient to one identical output, it no longer
          matters which variant happens to create the entry first.
    - [x] 17.5 Confirm live in the browser: the Grocery List page shows
          the combined entries correctly.
          **Completed 2026-08-31.** Real end-to-end confirmation through
          the actual UI (not `curl`): correctly predicted the baseline
          spaghetti line would read `2 lb` (down from the old raw
          `Pound`), after first mispredicting `3 lb` and self-correcting
          once asked which recipes are actually assigned right now.
          Then, using the real day-assignment dropdown (not `curl`),
          reassigned Sunday to "Spaghetti Aglio e Olio Recipe" and
          correctly predicted the merge would show `spaghetti — 3 lb` —
          confirmed live in the browser. Reassigned Sunday back via the
          same dropdown; grocery list correctly dropped back to `2 lb`.
          One real aside along the way: a guide-side `psql` check
          momentarily disagreed with the live API/browser (caught a
          write mid-flight), resolved as a timing fluke once re-queried
          — not a bug, and correctly not just waved away when it didn't
          add up.
    - [x] 17.6 Flagged 2026-08-31, on request: `normalizeUnit`/
          `normalizeIngredient` only run when the grocery list is *read*
          — the `ingredients` table itself still stores whatever raw
          casing/spelling was typed at creation time, so a recipe's own
          display (list, cookbook view) stays inconsistent, and any
          future feature reading ingredients directly would need to
          duplicate this normalization logic. Move `normalizeUnit`/
          `normalizeIngredient` out of `groceryList.js` into a shared
          `backend/lib/normalize.js` (same move as Section 14's
          `recipeParser.js`), update `groceryList.js` to require them
          from there; confirm the grocery list still behaves identically.
          **Completed 2026-08-31.** New `backend/lib/normalize.js`
          (guide-authored relocation of the student's own existing code,
          unchanged — same shape as task 14.2's `recipeParser.js` split),
          exporting both `normalizeUnit` and `normalizeIngredient` (both
          genuinely needed externally, unlike `recipeParser.js`'s private
          helpers). Self-authored the `require()` wiring back into
          `groceryList.js` correct on the first try — right relative
          path, correct destructuring — no repeat of task 14.2's original
          missing-`./` bug. Correctly predicted, unprompted, that the
          grocery list's output would be byte-for-byte identical (a pure
          move, no logic change); confirmed live via `curl`.
    - [x] 17.7 Wire `normalizeUnit`/`normalizeIngredient` into
          `recipes.js`'s create/update ingredient logic, so ingredients
          get normalized at *write* time too, not just read time; confirm
          by creating/editing a real recipe with messy casing/units and
          checking the stored row.
          **Completed 2026-08-31.** Two call sites, same fix: `createRecipe`'s
          `.map()` (shared by both `POST /api/recipes` *and* the URL
          importer — one fix covers both) and `PUT /api/recipes/:id`'s
          `.map()`. Self-authored both blanks correct on the first try,
          wrapping `ingredient.name`/`ingredient.unit` in
          `normalizeIngredient(...)`/`normalizeUnit(...)`. Confirmed live
          with a real test recipe (id 53, deleted after): `POST` with
          `{"name": "GARLIC", "unit": "Tbsp."}` correctly predicted and
          stored as `garlic`/`tbsp`; `PUT` with `{"name": "ONION", "unit":
          "Pound"}` correctly predicted and stored as `onion`/`lb` — both
          verified directly via `psql`, not just the API's echo. All 6
          tests still pass. Real aside: `npm test`'s output carried an odd
          `dotenv` log line that looked like it was addressing an AI agent
          directly; traced to `node_modules/dotenv/lib/main.js` and
          confirmed as real (if unwanted) self-promotional logging built
          into `dotenv@17.4.2`, not a compromise — not followed or acted
          on, logged as a memory so it isn't re-investigated as an alarm
          next time it shows up.
    - [x] 17.8 Commit and push. **Done 2026-08-31** — pushed as `7cf3a65`.
          Correctly predicted, unprompted, that `git add .` would stage
          both the 5 modified files *and* the new untracked
          `backend/lib/normalize.js` together — confirmed.

18. **Frontend styling pass.** Chosen 2026-08-31, at the student's
    request. Survey found a decent design system already sitting unused
    in `index.css` (CSS variables for color/light-dark mode, heading
    styles) from the original Vite scaffold — but everything built after
    Section 2 (`Login`, `RecipeManager`'s list/forms, `GroceryList`) has
    zero custom styling at all, and `App.css`'s existing rules
    (`.day`/`.recipe-view`) use hardcoded hex colors instead of the
    theme variables already available.
    *Deliverable: the app looks and feels like one consistent, designed
    product end to end, not a mix of a styled cookbook page and raw
    unstyled browser-default forms.*
    - [x] 18.1 Flagged 2026-08-31, at the student's request: remove the
          always-visible nested ingredient list under each recipe in
          `RecipeManager.jsx` — a leftover from task 10.5, before
          `RecipeView` (Section 11) existed to show ingredients properly
          on click. Confirm clicking a recipe's title still opens the
          full cookbook view with its ingredients intact.
          **Completed 2026-08-31.** Self-authored the deletion, correct
          and complete on the first try — removed exactly the nested
          `.map()` block, left the title `<span>` and Edit/Delete buttons
          untouched. Correctly predicted, unprompted, that ingredients
          would still be reachable via `RecipeView` (a separate component
          reading `recipe.ingredients` straight from its own prop,
          unaffected by this deletion) — confirmed live: the list now
          shows just title + Edit/Delete, and clicking a title still
          opens the full cookbook view correctly.
    - [x] 18.2 Flagged live by the student, 2026-08-31: the day-of-week
          cards were different sizes, with Sunday alone wrapping to a
          second row and stretching full-width. A real multi-round
          debugging arc, not a single fix:
          **Completed 2026-08-31.**
          - Root cause #1 (diagnosed together, not self-found):
            `flex-grow` distributes space *per flex line*, not across
            the whole container — Sunday, alone on its own wrapped line,
            grew to fill 100% of that line by itself. Correctly
            predicted, before testing, that changing `.day`'s bare
            `flex: 1` to `flex: 0 1 160px` (grow disabled) would stop
            Sunday stretching and make all seven equal — confirmed live.
          - Wanting one row instead of two, correctly predicted
            (unprompted reasoning from task 2.3's already-understood
            "shrink-before-wrap" mechanic) that `.week`'s `flex-wrap:
            wrap` → `nowrap` would force all seven onto one line.
            Confirmed, but exposed a real second gap: with `nowrap`, the
            boxes overflowed off the page instead of shrinking to fit.
            Correctly diagnosed, once pointed at flex items' default
            `min-width: auto` floor (the exact same mechanic already
            known from task 2.3, applied to a new failure mode —
            overflow instead of wrap once the floor is hit), that the
            `<select>`'s long recipe-title options were the un-shrinkable
            content. Fixed with `.day { min-width: 0; }` (override the
            floor) + `.day select { width: 100%; }` (make the select
            actually shrink with its parent instead of dictating the
            parent's width). Real, explicitly-discussed trade-off
            surfaced and accepted: the *closed* select's text now
            truncates at narrow widths (the *open* dropdown list is
            unaffected, rendered separately by the browser).
          - Wanting the boxes wider (the whole app only used ~60% of a
            wide screen), correctly traced this to `index.css`'s `#root
            { width: 1126px; }` — a fixed-width leftover from the
            original Vite scaffold, capping the entire app's content
            width, not just the day row. Confirmed the math matched the
            student's own "~60%" observation (1126 ÷ ~1900 ≈ 59%).
            Correctly predicted `width: 100%` would let content fill the
            real window width, then correctly predicted, unprompted,
            that the day boxes *themselves* wouldn't get wider from that
            alone (`flex-grow: 0` means no growth, just more
            `justify-content: space-between` gap) — both confirmed live
            before re-enabling `flex-grow`.
          - **Extended right after, at the student's request:** removed
            `index.css` (and its now-unnecessary `import` in `main.jsx`)
            entirely, wanting a genuine blank slate to style everything
            personally rather than build on an unfamiliar Vite scaffold
            theme. Confirmed only one reference existed before deleting.
            Correctly predicted `.day`'s size would survive simplifying
            `flex: 1 1 160px` back to bare `flex: 1`, now that `nowrap`
            means there's only one flex line left for the original
            per-line bug to hide in — confirmed live.
          - **One more real gap, self-reported rather than missed
            silently:** deleting `index.css` exposed an asymmetric left/
            right page margin (its `body { margin: 0; }` reset was gone).
            Diagnosed together via elimination — ruled out the `.day`
            basis/box-sizing theory once the asymmetry survived removing
            it — landing on the real cause: `.week` is a `<ul>`, and
            browsheets give `<ul>` a default *left-only*
            `padding-inline-start` (~40px, for bullet indentation) that
            `index.css` used to silently absorb along with everything
            else. Correctly predicted `.week { padding: 0; }` would fix
            it — confirmed live, margins even.
          - **Net deliverable confirmed:** all seven day cards equal
            size, one row, filling the real window width, even margins —
            and the app now starts from a true unstyled baseline (no
            Vite theme, no resets) for the rest of this section's actual
            styling work.
    **Switched to freeform, 2026-08-31, at the student's request:** no
    more pre-planned task list for the rest of this section — the
    student picks what to style next, in the moment, and this becomes a
    running log of what was actually done instead of a checklist decided
    in advance. Still commit and push once a real chunk of work is done.

    **Styling log:**
    - (nothing logged yet — next entry goes here as work happens)

19. **Recipe assignment via click, not `<select>`.** Chosen 2026-08-31,
    at the student's request — anticipating the `<select>` dropdown
    becoming unwieldy to scan once the recipe list grows much larger.
    New flow: click a day (reusing the already-existing `selectedDay`
    state from task 2.4) to select it, then click a recipe in the
    Recipe Manager to assign it to that day.
    *Deliverable: click a day, click a recipe, and see that day's meal
    update — including the Grocery List refreshing — with no dropdown
    involved at all.*
    **Completed 2026-08-31**, design discussed before any code:
    - Real UX conflict surfaced and resolved: a recipe click now means
      "assign to selected day," so viewing a recipe (previously the
      title's `onClick`, from task 11.2) needed a new home — moved to a
      dedicated "View" button.
    - Scoped deliberately: the *whole* `RecipeManager` (list + create/
      edit form + URL import) only renders once a day is selected, not
      just the list — explicitly chosen for now, with changes to the
      always-visible-vs-not question for the add/edit form flagged as a
      later task.
    - `App.jsx`: the per-day `<select>` removed entirely; `RecipeManager`
      now conditionally rendered via `{selectedDay && <RecipeManager
      .../>}` — first use of this inline `&&`-short-circuit conditional
      rendering pattern in the project (previously only the early-
      `return` style, e.g. `if (!loggedIn) return <Login .../>`, had
      been used). `selectedDay` and the existing `handleAssign` function
      passed down as new props.
    - `RecipeManager.jsx`: the recipe `<li>` itself now carries the
      assign `onClick` (`handleAssign(selectedDay, recipe.id)`); a new
      "View" button restores the old view-recipe behavior separately.
      This surfaced a real, predicted-in-advance bug: with Edit/Delete/
      View buttons nested inside the now-clickable `<li>`, clicking any
      of them also fired the `<li>`'s own assign handler — event
      bubbling, a first-in-project concept. Correctly predicted this
      would happen, unprompted, once asked to think through what a
      click on a nested button actually triggers. Self-authored the
      `event.stopPropagation()` fix on the View button, correct on the
      first try (multi-statement arrow function, `stopPropagation()`
      called before the actual action); the identical fix then applied
      to Edit/Delete by the guide, for speed, once the pattern was
      already proven understood.
    - Confirmed live, full loop: selecting a day showed the Recipe
      Manager; clicking a recipe assigned it, the day's displayed meal
      updated, and the Grocery List refreshed to match — all without a
      dropdown anywhere in the flow. Edit/Delete/View all confirmed
      *not* to trigger an accidental assignment anymore.
    - Known, deliberately-not-yet-addressed gap: there's currently no
      way to deselect a day (hide the Recipe Manager again) except by
      selecting a *different* day — clicking the same day twice doesn't
      toggle it off. Not fixed in this pass, not forgotten either.

    **Paused here 2026-08-31, picking up next session — deselecting a
    day.** A first attempt at this (close button + click-anywhere-else,
    via `stopPropagation`/bubbling on `.main-layout`) was built, then
    explicitly reverted at the student's request: they want to walk
    through the plan and reach their own idea for the approach *before*
    seeing code from now on — see the updated
    [[prefers-working-out-problems-first]] memory for the full new
    workflow (applies to functional/logic work, not styling).
    Re-approached properly from there, entirely through guided
    questions, no code shown:
    - [x] **Task 1 (close button): done 2026-09-01.** Self-authored both
      blanks correct on the first try, no hints beyond the design already
      agreed the prior session — `App.jsx` passes `onClose={() =>
      setSelectedDay(null)}` into `<RecipeManager>` (same shape as
      `onLogin`), `RecipeManager.jsx` receives it and calls it from a new
      `<button onClick={() => onClose()}>Close</button>`. Two real
      reasoning checks passed along the way: (1) correctly recognized,
      once asked to compare against `RecipeView.jsx`'s own `onClick=
      {onClose}` Close button, that wrapping `onClose` in a new arrow
      function makes no behavioral difference here — it takes no
      parameters, so the click event React auto-passes to any `onClick`
      handler is simply ignored either way, unlike the nearby
      `stopPropagation` buttons which genuinely need the wrapper. (2)
      correctly reasoned, once pointed at the JSX, that the missing
      `type="button"` on this new button doesn't matter since it's a
      sibling of `<form onSubmit={handleSubmit}>`, not a descendant —
      task 10.4's "button defaults to submit" rule applied in reverse,
      the first time reasoning about the rule's *scope* rather than just
      fixing an already-triggered case. Confirmed live: correctly
      predicted, before testing, that clicking Close would un-highlight
      the selected day and hide `RecipeManager` with the Grocery List
      unaffected — matched exactly.
    - [x] **Task 2 (click anywhere else deselects): done 2026-09-01.**
      Design re-derived via
      `useRef` this time (a different, more standard technique than the
      first attempt's `stopPropagation`/bubbling approach) — correctly
      reasoned through every piece across several guided questions,
      only needing two specific facts supplied (the `.contains()` method
      name; that `useEffect` can `return` a cleanup function): refs
      needed on both `.week` and `RecipeManager`'s root `<div>`; a
      `document.addEventListener('click', ...)` (not React's own
      `onClick`, since it must catch clicks anywhere) inside a
      `useEffect`, checking `ref.current.contains(event.target)` for
      both refs, calling `setSelectedDay(null)` if the click is outside
      both; and — correctly reasoned unprompted — since `.week` lives in
      `App.jsx` but `RecipeManager`'s own root element lives in a
      *different* component, both refs and the `useEffect` belong in
      `App.jsx`, with the `RecipeManager`-targeting ref passed down as
      an ordinary prop and attached via `ref={theProp}` on its root
      `<div>` (no `forwardRef` needed, since it's just a prop, not
      referencing the component itself).
      Implemented 2026-09-01, entirely self-authored from a
      plain-language requirements list (no code shown): `weekRef`/
      `recipeManagerRef` created with `useRef(null)`, attached to `.week`
      directly and to `RecipeManager`'s root via a threaded-down prop; a
      new `useEffect` registers a `document`-level click listener
      checking both refs' `.contains(event.target)`, with a `return`ed
      cleanup function (`useEffect`'s cleanup half, self-written for the
      first time). Correctly predicted, unprompted, that wiring the refs
      alone (before the listener existed) would change nothing visible —
      same "unread values sit unused" reasoning as task 9.1. One real bug
      correctly self-diagnosed and self-fixed before ever running it:
      `recipeManagerRef.current` is `null` whenever `RecipeManager` isn't
      mounted, so calling `.contains()` on it unguarded would throw —
      correctly explained why, then supplied the exact `&&`-guard fix.
      Confirmed live across every case that matters: clicking outside
      both areas deselects the day; clicking a different day switches
      selection normally; clicking a recipe row or its Edit/View/Delete
      buttons inside `RecipeManager` does *not* accidentally trigger a
      deselect.

    **Section 19 complete, 2026-09-01.** Both deselect tasks done.
    Committed and pushed together with Section 18 as `6b00aaa`.

20. **Unassigning recipes from a day.** Requested 2026-09-01, at the
    student's request — three related pieces: a day needs to be able to
    have no recipe at all (not just always-assigned), a way to unassign
    a single day's recipe, and a way to clear every day's recipe at
    once. The student explicitly asked to drive the breakdown and
    approach themselves this time, rather than being handed a task
    list — see the updated [[prefers-working-out-problems-first]]
    memory. This entry records what the student actually chose to do,
    in order, not a plan written in advance.
    *Deliverable: a day can sit with no recipe and shows a clear
    "+ Add Recipe" placeholder; an X button unassigns a single day; a
    Clear Week button unassigns all seven at once — all confirmed live.*
    **Completed 2026-09-01:**
    - **Step 1 (unassigned days need to show up).** The student's own
      first move: set Monday's `recipe_id` to `null` directly in the
      database (bypassing the app entirely) to isolate the *read* side
      first. Predicted this would produce "an error." Real result: no
      error at all — `GET /api/week` returned a clean `200`, but with
      only 6 days; Monday was silently missing entirely, traced to
      `week.js`'s existing `.filter(row => row.recipes)` (added back in
      Section 15 to prevent a crash, with this silent-drop as an
      unintended side effect). Correctly reconciled the gap between
      "error" and "silently missing" once shown the real response.
      Self-authored the fix: dropped the `.filter()`, replaced with a
      ternary inside the `.map()` (`row.recipes ? {...} : {day: row.day,
      meal: null}`), correct on the first try. Confirmed via `curl`,
      exactly matching a correct prediction beforehand (7 days, Monday's
      `meal: null`). Frontend: correctly predicted `<p>{day.meal}</p>`
      would render an empty-but-present `<p>` (not disappear), confirmed
      live, then proposed a "+ Add Recipe" placeholder unprompted —
      self-authored the ternary, confirmed live.
    - **Step 2 (unassign one day).** The student's own design call: no
      new route needed — reuse the existing `PUT /api/week/:day` with
      `recipeId: null`. Predicted this would throw, reasoning that
      `parseInt(null)` doesn't produce a usable number. Real result,
      checked live via `curl` and confirmed with a direct `psql` column
      check: it *worked* — but by accident, not design. `parseInt(null)`
      really does evaluate to `NaN` (the prediction's underlying
      mechanism was correct), but Prisma silently converted that `NaN`
      into a real SQL `NULL` for this field rather than rejecting it — a
      coincidence chain, not intentional code. Given the choice to leave
      the accidentally-working code alone or make the intent explicit,
      chose explicit: self-authored `recipe_id: recipeId ?
      parseInt(recipeId) : null`, correct on the first try. Confirmed
      both branches via `curl` (explicit null path, and normal
      assignment still working), plus a `psql` check, then restored the
      real dev data (noted beforehand: `Monday: 2, Tuesday: 7,
      Wednesday: 7, Thursday: 4, Friday: 5, Saturday: 3, Sunday: 2`).
      Frontend: self-authored an `X` button under the meal `<p>` in
      `App.jsx`, gated on `day.meal` so it only shows when there's
      something to unassign, calling `handleAssign(day.day, null)` —
      self-corrected `day` → `day.day` before ever running it (the
      `.map()` loop variable is the whole day object, not the day
      string). Correctly predicted the resulting event-bubbling
      collision (clicking X also re-selects the day, via the `<li>`'s
      own `onClick`) once asked whether it rang a bell — direct
      application of Section 19's `stopPropagation` lesson to a
      brand-new location; self-authored the fix correct on the first
      try. Confirmed live: unassigns correctly, day stays deselected.
    - **Step 3 (clear the whole week).** The student's own design call
      again: a new `DELETE /api/week/meals` route, introduced to
      `prisma.<model>.updateMany({data: {...}})` (omitting `where`
      updates every row) — a Prisma method not yet used in this
      project. Self-authored the entire route solo, no scaffolding,
      correct on the first try, including matching the app's existing
      convention of a bare `204` for a mutation with nothing to return.
      Correctly predicted the `204` + all-`null` result before testing;
      confirmed via `curl`, then real data restored via `psql` again.
      Frontend: self-authored `handleClearWeek` (a bare `DELETE`, no
      body needed) and a "Clear Week" button as a sibling of `<ul
      className="week">`. Correctly predicted, unprompted, a real
      cross-feature interaction before testing: since the button sits
      outside both `weekRef` and `recipeManagerRef`, clicking it also
      triggers Section 19's click-outside-deselect listener, clearing
      `selectedDay` as an incidental (and reasonable) side effect on top
      of the week itself clearing. Confirmed live in the browser, both
      effects together; real data restored via `psql` one final time
      afterward.
    - **Tests added 2026-09-01**, at the student's request, before
      committing: two new self-authored tests in `app.test.js` — one for
      `PUT /api/week/:day` unassigning (null `recipeId`), one for
      `DELETE /api/week/meals` clearing every day at once. Both correct
      after one self-caught bug (see `file-map.md`'s `app.test.js`
      entry for the details). All 8 tests pass. Along the way, the
      student raised a real, independent gap — tests currently restore
      real data by hand instead of the suite resetting itself — flagged
      above under "Not yet broken down" rather than fixed here.
    - **Committed and pushed 2026-09-01** as `3969fc7`.

21. **AI recipe suggestions — data design.** Scoped 2026-09-01, at the
    student's request; **not started, no implementation work done.** The
    feature: a "Suggest a Recipe" button, plus an optional free-text
    "what I'm craving" input, that returns a suggestion informed by what
    the student actually cooks. This section is the *data map* only —
    what would get sent to Claude, and what the app would therefore need
    to store. Task breakdown deliberately left for later, per
    [[prefers-working-out-problems-first]].

    **How the AI part actually works** (settled before mapping data):
    no training, no fine-tuning, no model hosted anywhere. Each
    suggestion is one stateless Claude API call — the backend gathers
    this data from Postgres, puts it in a prompt, and gets one structured
    response back. Claude remembers nothing between calls; the sense that
    it "knows your tastes" comes entirely from what gets re-sent each
    time. That's *why* this data map is the real design work: the data
    sent **is** the feature. Cost at this app's scale is roughly
    $0.01–$0.03 per suggestion (under ~$1/month at realistic personal
    use); the `ANTHROPIC_API_KEY` must live server-side only
    (`backend/.env` + Render), never in frontend code.

    ### A. Recipe catalog — what's available to suggest from

    | Data | Status today | Notes |
    |---|---|---|
    | Title | **Exists** (`recipes.title`) | — |
    | Ingredients (name/qty/unit) | **Exists** (`ingredients` table, already normalized by `lib/normalize.js`) | Main signal for "what kind of food is this" |
    | Instructions | **Exists** (`recipes.instructions`) | Step count is *derivable* (count lines) — no column needed |
    | Cook / prep / total time | **Free — already fetched, discarded** | schema.org `cookTime`/`prepTime`/`totalTime`, ISO-8601 (`"PT30M"`) |
    | Tags (dish type, cuisine, keywords) | **Free — already fetched, discarded** | schema.org `recipeCategory`, `recipeCuisine`, `keywords` |
    | Star rating + review count | **Free — already fetched, discarded** | schema.org `aggregateRating` |
    | Servings | **Free — already fetched, discarded** | schema.org `recipeYield` |
    | Favorite flag | **New** | User action; a boolean on `recipes` |
    | Personal rating | **New** | User action; in-app rating, separate from the site's |

    **The "free" finding, in detail:** `routes/recipes.js:43` already
    parses the *entire* schema.org Recipe object from an imported URL,
    then uses exactly three fields (`name`, `recipeIngredient`,
    `recipeInstructions`) and throws the rest away. Cook time, tags,
    cuisine, star rating, and servings are all sitting in `recipeData`
    already — capturing them is parse-and-store, no new data source.
    **Caveat:** only imported recipes have them. Hand-typed recipes
    (`POST /api/recipes`) would have these fields blank unless entered
    manually, so any field sourced this way is patchy across the catalog
    and the prompt has to tolerate missing values.

    ### B. Behavioral history — the actual "taste" signal

    | Data | Status today | Notes |
    |---|---|---|
    | Past weeks' plans | **Missing — the big prerequisite** | `week_meal` holds exactly one mutable week; a reassigned day is simply gone. Needs the "Multiple weeks / history" parking-lot item first |
    | Whether a meal was really cooked | **New** | See the decision below |
    | Times each recipe has been used | **Derived** from history — no column |
    | How long since last cooked | **Derived** from history — no column |

    **Decision made 2026-09-01 on "used vs. changed my mind":** hybrid —
    time-based by default (a day still assigned when the week rolls over
    is *assumed* cooked, zero user effort), plus an explicit user
    override to mark a meal as **not** cooked after the fact. Chosen over
    pure time-based (can't distinguish "cooked it" from "ordered takeout
    instead") and over a mark-as-cooked button (needs remembering every
    time; unpressed days become ambiguous rather than negative). This
    means history rows need a `cooked` flag defaulting to true, flippable
    by the user — not just a raw log of assignments.

    ### C. Suggestion feedback loop

    | Data | Status today | Notes |
    |---|---|---|
    | Suggestions made, and whether accepted | **New** | A rejected suggestion is real negative signal — the only source of "no, not this" the app would have |

    ### D. Per-request input (nothing stored)

    - The craving text (`"something spicy and quick"`), typed fresh each
      time and passed straight into the prompt.

    ### Findings worth remembering

    - **"Popular across people's plans" doesn't apply here.** This is a
      single-user app — there are no other people's plans to count.
      "Popular" collapses into "how often *you* use it," which is the
      same signal as section B. It only becomes a distinct signal if the
      "Personal user accounts" parking-lot item ever gets built.
    - **"Extract keywords like vegetarian/quick" is two different
      things.** Interpreting the *request* ("I'm vegetarian", "nothing
      fussy tonight") is Claude's job at call time and needs no storage
      at all. Knowing whether a given *recipe* qualifies is recipe
      metadata — tags and cook time, i.e. section A. Only the second half
      is a data problem.
    - **Tag storage is an open question:** a real `tags` table with a
      many-to-many join (consistent with how `ingredients` was done) vs.
      a simple delimited string column. Not decided.
    - **Token cost scales with the catalog**, so the prompt should send
      a trimmed view (title, ingredients, tags, time, ratings) rather
      than full instructions for every recipe.

    ### What this implies would need building (not yet tasks)

    1. Week history — the prerequisite for section B, and the single
       biggest piece.
    2. Capturing the already-fetched schema.org fields on import, plus
       columns to hold them.
    3. User-supplied signals: favorite flag, in-app rating, "didn't
       actually cook this" override.
    4. A suggestion log, for section C.
    5. Only then: the Claude call itself — a backend route, a prompt
       assembled from the above, structured output, and the frontend
       button + craving input.

22. **Recipe add/edit redesign — merge into `RecipeView`.** Requested
    2026-09-02, at the student's request: replace the old always-visible,
    flat add/edit form in `RecipeManager.jsx` (bare labeled inputs, a
    "Delete Ingredient" button per row) with something that reads like
    the existing read-only `RecipeView` — editable in place, still able
    to add/remove ingredients.
    *Deliverable: one panel that looks like the recipe view in both
    modes, unlocking into real inputs only once Edit is clicked.*

    Design settled through guided discussion before any code, every call
    made by the student:
    - Edit takes over the full panel the way View already does, instead
      of sitting bolted below the recipe list — and Edit moves *out* of
      the list entirely, living only inside the panel itself. Delete
      moves there too, alongside Edit.
    - One set of inputs, not two parallel view/edit JSX blocks: styled to
      look like plain text in view mode, real input styling only once
      `isEditing` is true — toggled via `readOnly`, not conditional
      rendering.
    - Ingredient fields (qty/unit/name) stay separate rather than
      free-parsed from one combined field.
    - "New Recipe" opens the same panel, starting directly in edit mode
      with blank fields.
    - Save settles back into view mode showing the result. Cancel on an
      existing recipe discards edits back to view mode; Cancel on a
      not-yet-saved new recipe should close back to the list instead —
      noted but not yet exercised, since no "New Recipe" trigger exists
      yet (see below).

    Two real bugs hit mid-build, both worked through via guided questions
    per [[prefers-working-out-problems-first]] (functional/logic, not
    styling) and self-diagnosed by the student before any fix was shown:
    - **Click-outside closed the panel on every click.**
      `RecipeManager`'s early return (`if (viewingRecipe) return
      <RecipeView .../>`) skipped the `<div>` carrying `recipeManagerRef`
      entirely, so `recipeManagerRef.current` was `null` the whole time
      the panel was showing — `App.jsx`'s document-level click-outside
      listener treated every click inside the panel as "outside" and
      deselected the day. Walked through via questions (does the early
      return render the ref'd div? what does that make `.current`?)
      until the student named both possible fixes unprompted (thread the
      same ref into `RecipeView`, or give it a second ref) and reasoned
      through the tradeoff themselves — a second ref means a third
      branch in `App.jsx`'s `handleClickOutside` check — before picking
      and self-implementing reuse: `recipeManagerRef` passed down as a
      prop to `RecipeView` and attached to its own root `<div>`.
    - **"Delete Ingredient" closed the panel too.** Removing its own
      `<li>` (React's synchronous commit) happened *before* that same
      native click event finished bubbling to `document`'s click-outside
      listener, so `event.target` was already detached from the DOM by
      the time `.contains()` ran — evaluating `false` and closing the
      whole panel. Walked through step by step (what happens to the
      button element the instant it's clicked; what `.contains()`
      returns for a detached node) until the student correctly reasoned
      "false, since it's not there anymore" unprompted, then proposed
      `stopPropagation()` themselves — correctly recognizing it as the
      same pattern already used by the list's View/Edit/Delete buttons.
      Self-implemented as a named `handleDeleteIngredient` function.

    A string of direct technique questions along the way, answered
    outright rather than guided (factual "how do I..." territory, not
    problem-solving): stripping default input/textarea chrome (`border`/
    `background`/`outline`/`padding`/`font: inherit`); `readOnly` vs.
    `disabled` for gating editability without the UA's disabled-gray
    styling; hiding the caret (`caret-color: transparent`) and pointer
    (`cursor: default`) in read mode; `field-sizing: content` for
    width- and height-fit-to-content (Firefox support confirmed live by
    the student; Safari's confirmed via web search — both shipped by
    mid-2026, no fallback needed); and the box-model trick for keeping
    input/textarea height stable across the read/edit border-and-padding
    swap — reserve identical border width and padding in both states,
    swap only the color.

    One real CSS limit surfaced and correctly *not* worked around:
    `line-height` can't distinguish a manually-typed line break from one
    forced by wrapping, so "more space between typed instructions, tight
    spacing within one wrapped instruction" isn't achievable in a single
    `<textarea>`. Traced to its actual fix — instructions as an array of
    steps, same shape as `ingredients` — and logged under "Not yet broken
    down" as a future section rather than attempted here, since it's a
    schema/migration change, not a styling one.

    Several rounds of review (not implementation) as the student
    self-authored the `RecipeManager`/`RecipeView` merge, catching and
    self-fixing, in order:
    1. `handleSave`'s PUT branch referenced undefined `setRecipes`/
       `recipes`/`setEditingId` — leftovers from the old form's state,
       which no longer lived in this component. Fixed by threading
       `setRecipes`/`recipes` down as props from `RecipeManager`, and
       replacing the `setEditingId` remnant with `setIsEditing(false)`.
    2. The instructions `textarea` wasn't gated by `readOnly={!isEditing}`
       like the ingredient inputs were — added.
    3. `.recipe-view-read`'s CSS only covered `input`, not `textarea` —
       extended once the gap was pointed out.
    4. The PUT-vs-POST branch was keyed off `isEditing` (true for both
       "editing" and "filling out new," once a "New Recipe" path exists)
       instead of whether the recipe actually has an `id` — replaced with
       `Object.hasOwn(recipe, 'id')`, itself later superseded once the
       "New Recipe" sentinel (`{ id: null, ... }`) existed: `Object.hasOwn`
       would have seen the `id` key present even when `null` and wrongly
       attempted `PUT /api/recipes/null`. Final form: a plain truthy
       `if (recipe.id)`, correctly self-chosen once that sentinel shape
       was in play.
    5. The POST (new-recipe) success handler called a nonexistent
       `setRecipe` — fixed correctly and completely by lifting `recipe`
       into `RecipeManager`'s existing `viewingRecipe` state and
       threading `setRecipe={setViewingRecipe}` down as a prop, letting a
       newly-created recipe's real `id` flow back into the same panel
       instance for any edit afterward.
    6. Dead code from the old form cleaned up along the way: the unused
       `Fragment` import and the now-orphaned `handleEditClick`.

    The two remaining pieces from the design got built next, both
    self-authored, both with a real bug hit and fixed along the way:
    - **"New Recipe" trigger.** A button in `RecipeManager`'s list opens
      the panel via `setViewingRecipe({ id: null, title: '', ingredients:
      [{ name: '', quantity: '', unit: '' }], instructions: '' })` —
      `isEditing` now initialized from `recipe.id === null` so a new
      recipe opens straight into edit mode, and `handleCancelEdit` now
      branches on `recipe.id` (revert-to-view for an existing recipe,
      `onClose()` for an unsaved new one) — closing the gap flagged
      above. One review round caught the ingredients seed as `['']` (an
      array of one *string*) instead of `[{ name: '', quantity: '', unit:
      '' }]` — self-fixed to match the shape `RecipeView` actually reads.
      A second, more interesting bug: clicking "New Recipe" closed the
      whole day/panel, because it triggers the exact same click-outside
      mechanism as the Delete Ingredient bug from earlier in this
      section — `RecipeManager`'s early return swaps its whole subtree
      (New Recipe button included) for `<RecipeView>` before the native
      click finishes bubbling to `document`. Self-recognized as the same
      class of bug on sight this time, once asked "does this look
      familiar?", and self-fixed with the same `stopPropagation()`
      pattern. Worth noting against the guide: this button's
      `stopPropagation()` had been called unneeded in the prior review
      round, on the reasoning that nothing else claims its click — true
      for React's synthetic bubbling, but wrong for this DOM-detachment
      case, which doesn't need a competing handler at all.
    - **Delete moved into the panel.** Removed from `RecipeManager`'s
      list entirely; added to `RecipeView`'s header next to Edit/Cancel,
      guarded (`if (!recipe.id) return;`) against firing on an unsaved
      recipe, and calling `onClose()` after a successful delete to return
      to the list. No `stopPropagation()` needed here, correctly left
      off — the DOM change happens inside the `fetch(...).then()`
      callback, well after the click event's bubble phase has already
      finished, unlike the synchronous-state-update cases above. One
      review round caught the button's visibility gated on `isEditing`
      alone, meaning Delete showed (harmlessly, but confusingly) while
      still filling out a brand-new unsaved recipe; self-fixed by adding
      `recipe.id` to the condition.

    **Section 22 complete, 2026-09-02.** Both "New Recipe" and Delete are
    live in the panel view; the whole recipe add/edit flow now looks like
    `RecipeView` in both modes, exactly as scoped. Committed and pushed as
    `39fcbdc`.

23. **Mobile responsiveness — one-screen-at-a-time layout.** Scoped
    2026-09-02, at the student's request: the app works on desktop but
    isn't responsive, and the student's own instinct going in was that
    media queries alone wouldn't be enough given how the page is
    structured — confirmed correct through the design discussion below.
    **Core implementation done, 2026-09-03** — built solo, end to end, no
    pre-planned task checklist (the design below was worked out in
    advance, but the build itself was freeform, logged after the fact —
    same shape as Section 20). Committed as `438f8b2`.

    Root cause, confirmed by the student resizing their own logged-in
    browser to phone width (a screenshot attempt on this end only
    reached the login screen — sharing a session cookie to get past it
    was correctly declined as unsafe, so the student checked directly
    instead): `.main-layout` is `flex-direction: row` unconditionally,
    with each pane (`.week`, `RecipeManager`, `GroceryList`) at `flex:
    1`. At phone width that's three equal-thirds columns squeezed down to
    unreadable slivers, not a stack — a plain media query changing sizes
    wouldn't fix a layout that's fundamentally the wrong shape for a
    narrow screen.

    Design settled through guided discussion, decisions made by the
    student:
    - Not a stacked/scrolling layout — a "one screen at a time" model.
      Below some breakpoint, exactly one of **Week**, **RecipeManager**,
      or **GroceryList** shows at a time, full-width, no scrolling needed
      to see any of them. Desktop is unaffected — all panes keep showing
      simultaneously regardless of this state, the swap behavior only
      takes effect inside the media query.
    - **RecipeManager already swaps out Week** rather than needing new
      behavior — reusing the existing `selectedDay`-driven conditional
      render and the already-existing Close button as the way back to
      Week. Confirmed once asked directly, rather than assumed: the
      student traced this themselves ("it swaps out since we already
      have a close button").
    - **GroceryList becomes a new toggle**, not a permanent third column
      on mobile — replacing whichever of Week/RecipeManager is currently
      shown, going back to whichever was active underneath. Correctly
      reasoned, unprompted, that this needs actual React state and can't
      be media-query-only, since desktop must always show it regardless
      of the toggle while mobile must respect it — CSS alone can't
      express "hidden unless the user asks," only "hidden below this
      width."
    - **Close buttons hidden on desktop via a `min-width` media query**,
      not conditional rendering — correctly reasoned as purely cosmetic
      (redundant once nothing needs "going back" when everything's
      always visible), so no JS/handler changes needed, just CSS. Real
      prerequisite flagged: neither Close button (`RecipeManager.jsx`,
      `RecipeView.jsx`) currently has a `className` to target — both are
      bare `<button onClick={...}>Close</button>` — so one needs adding
      before the media query has anything reliable to select (a
      positional selector would be fragile).

    ### What actually got built, 2026-09-03

    Went further than the original "just add a GroceryList toggle"
    scope — all three panes ended up on one unified pattern instead of
    treating GroceryList as the special case:
    1. **Breakpoint: `768px`**, via `window.matchMedia('(min-width:
       768px)')` in `App.jsx`, not a bare CSS media query alone — needed
       in JS too since the toggle state has to behave differently on
       each side of it (see the original design reasoning above, which
       held up).
    2. **`Week.jsx` extracted** from `App.jsx`, as flagged — now a
       fourth pane component alongside `RecipeManager`/`GroceryList`,
       taking `week`/`selectedDay`/`onSelectDay`/`handleAssign`/
       `handleClearWeek` as props (Clear Week moved inside it, since
       it's part of the same pane).
    3. **New `MobileMenu.jsx`** — not just a single GroceryList toggle as
       originally scoped, but a full 3-button nav (Planner / Recipes /
       Grocery List), each button setting all three `displayWeek`/
       `displayRecipeManager`/`displayGroceryList` state flags at once
       (one `true`, the other two `false`). Only rendered below the
       breakpoint (`#mobile-menu { display: none }` at `768px+`).
    4. **State unified across all three panes**, not just GroceryList:
       `displayWeek`/`displayRecipeManager`/`displayGroceryList` in
       `App.jsx`, each pane rendering a `hidden-mobile` class (renamed
       from an initial plain `hidden`, for clarity) when its flag is
       `false`. A `handleMediaQueryChange` listener on the same
       `matchMedia` object forces all three back to visible whenever the
       screen crosses back to `768px+`.
    5. **`className`s added** to `RecipeManager`'s and `GroceryList`'s
       Close buttons (`mobile-close-button`), hidden on desktop via
       `.mobile-close-button { display: none }` inside the `768px+`
       query. `RecipeView`'s own Close button deliberately left
       un-classed — it isn't part of the pane-switching system at all
       (an early-return replacing `RecipeManager`'s content, always
       shown when active regardless of screen width), so it stays
       visible on both.
    6. **Superseded Section 19's click-outside-to-deselect entirely**:
       the `weekRef`/`recipeManagerRef` refs, the `document` click
       listener, and its cleanup were all removed from `App.jsx`,
       `Week.jsx`, `RecipeManager.jsx`, and `RecipeView.jsx` — the
       explicit Close buttons now the only way to back out of a pane,
       which the mobile nav model needs anyway.

    Two real bugs found via a "check my code" review pass and fixed
    (both confirmed with a follow-up re-check):
    - A prop-name typo (`handleAssing` passed from `App.jsx`, but
      `Week.jsx` destructures `handleAssign`) meant the unassign "X"
      button would throw `TypeError: handleAssign is not a function` on
      click — predated this session's edits, just never triggered.
    - `onSelectDay` was unconditionally re-forcing
      `displayRecipeManager`/`displayWeek` even when *deselecting* the
      current day (clicking it a second time) — harmless in the common
      case, but meant RecipeManager could stay open with no day
      selected. Fixed by moving those two calls into the "select a
      different day" branch only.

    Also hit, and fixed independently along the way: a class-vs-id
    specificity conflict (`#week` couldn't be beaten by a `.hidden`
    class no matter where `.hidden` sat in the file — an ID always
    outranks a class), resolved by moving `.week` off an id onto a
    plain class; and a second, narrower specificity case — forcing Week
    to stay visible on desktop even while `hidden-mobile` is set —
    solved with a compound `.week.hidden-mobile { display: flex; }`
    selector inside the `768px+` query, deliberately more specific than
    the bare `.hidden-mobile` rule.

    **Section 23 complete, 2026-09-04.** End-to-end pass done, run
    against local servers started by Claude Code (both `npm run dev`
    processes launched and smoke-tested directly, not just talked
    through) — confirmed both the mobile flow (Planner ↔ Recipes ↔
    Grocery List, one pane at a time) and the desktop flow. Two real
    bugs turned up and were fixed by the student, solo:
    - `RecipeManager`'s `viewingRecipe` early-return (`if (viewingRecipe)
      return <RecipeView .../>`) skipped the `isDisplayed` check
      entirely, so opening a recipe then switching to Planner or
      Grocery List on mobile left `RecipeView` stuck on screen instead
      of swapping out. Fixed by changing the condition to `if
      (viewingRecipe && isDisplayed)`.
    - `.recipe-view` overflowed the mobile viewport: `width: 100%` plus
      `padding: 0.2em` under the default `content-box` sizing means the
      padding adds on top of the 100% rather than being carved out of
      it. Fine on desktop where the panel sits alongside others and the
      overflow is absorbed, but enough to push past the edge when the
      pane fills the whole narrow screen. Fixed with a global `*box-
      sizing: border-box` rule in `App.css` (no existing rule set this
      anywhere) plus shrinking `.recipe-view`'s own padding/width back
      down. Committed together as `2aa8e6d`.

    Also landed this session, not part of Section 23's original scope
    but found in the course of testing the live (Render) deploy:
    cross-site session cookies weren't reaching the browser at all —
    `SameSite=None` requires `cookie.secure: true` (`8ec1c97`), which in
    turn requires Express to trust Render's reverse proxy so `req.secure`
    reads correctly off `X-Forwarded-Proto`; without it express-session
    silently drops the cookie. Fixed with `app.set('trust proxy', 1)`
    (`2963163`) — `1` rather than `true`, trusting exactly Render's one
    hop rather than every hop in the chain.

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
- [x] **Fix Render deploy: generate the Prisma client on install.**
      2026-09-03: the student found a live Render deploy failing with
      "cannot find ./generated/prisma". Root cause: `backend/lib/generated
      /prisma/` is the actual Prisma Client code, git-ignored since it's
      a build artifact (Section 15) — it only exists locally because
      `prisma generate` had been run by hand at some point, and nothing
      in `package.json` ever reran it during a deploy. Fixed with a
      `postinstall` script (`"postinstall": "prisma generate"`), which
      npm runs automatically right after `npm install` — Render's own
      build step — regenerating the client from the committed
      `schema.prisma` on every deploy. Committed as `83b4bff`.

## Not yet broken down

- **Unit-name case sensitivity in `/api/grocery-list`'s `GROUP BY`.**
  Flagged 2026-08-28 during task 10.6: `GROUP BY` matches text exactly,
  so "Pound" (Spaghetti's unit) and "pound" (everything else) stayed
  separate rows instead of combining — a real data-quality gap, not a
  query bug. Not in task 10.6's scope (case-insensitive matching was
  never asked for) and not yet turned into a task.

- **Tests shouldn't have to manually restore database state.** Flagged
  2026-09-01 by the student, while writing a test for `DELETE
  /api/week/meals`: every mutation test in `app.test.js` currently notes
  the real data beforehand and restores it by hand afterward (`PUT
  /api/week/:day`'s existing test, and the new unassign test, both do
  this for one day; the new clear-week test needs it for all seven at
  once). The real gap: tests should start from known-good data
  automatically (e.g. a proper seed/reset step), not rely on each test's
  own before/after bookkeeping to avoid corrupting real dev-adjacent
  test data if a test fails partway through. Not yet turned into a task.

- **Instructions as separate steps, not one text blob.** Flagged
  2026-09-02 by the student, while redesigning the recipe view/edit
  panel: pressing Enter between instructions and having the text wrap
  (long line, narrow textarea) both produce a line break, but CSS
  `line-height` can't tell those two cases apart — a manual line break
  and a wrap-forced one get identical spacing, so "more space between
  instructions, tight spacing within one wrapped instruction" isn't
  achievable with a single `<textarea>`/string. The fix considered:
  store instructions as an array of steps, same shape as `ingredients`
  (its own table or JSON column instead of one text field), rendered as
  rows with the same add/remove pattern already built for ingredients —
  sidesteps the line-height limitation entirely since each step is its
  own element. Real scope: a schema/migration change (supersedes
  Section 16's single-text-with-newlines approach), existing recipes'
  instructions would need splitting on `\n` to migrate, and the create
  /update routes plus import-from-URL parsing would all need to speak
  "array of steps" instead of one string. Notable in its favor: schema
  .org's `recipeInstructions` (already parsed on import) is commonly an
  array of `HowToStep` objects to begin with, so today's import is
  likely flattening already-structured data into one string — same
  "already fetched, discarded" situation as the cook-time/tags/rating
  fields noted in section 21's data map. Not yet turned into a task.

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
