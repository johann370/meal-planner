# Knowledge graph

The map of what I actually know, not what the project needs. This is what
decides what I get quizzed on — I should never be re-quizzed on something
`understood` and still fresh, and nothing upgrades status without real
evidence of something I said or did.

## Status definitions

- **seed** — not yet taught.
- **introduced** — explained to me once. No check yet.
- **practicing** — I've used it myself, with help/guidance.
- **understood** — I explained it in my own words *and* passed a quiz on it.

Statuses only move forward on evidence — a specific thing I said or did,
recorded in the Evidence column. Downgrades are fine too, if a later quiz
shows the understanding didn't stick.

Everything walked through and checked during planning (`project.md`,
`plan.md`) starts at **introduced**, not higher — a good verbal explanation
in a planning chat isn't the same as using the thing or passing a real quiz.

---

## Low-level (syntax, code mechanics)

| Concept | Status | Introduced | Last reviewed | Evidence |
|---|---|---|---|---|
| Variables | seed | — | — | — |
| Data types (string/number/boolean) | seed | — | — | — |
| Functions | seed | — | — | — |
| Conditionals (if/else) | seed | — | — | — |
| Loops (for/while) | seed | — | — | — |
| Arrays | understood | 2026-08-14 | 2026-08-14 | Built `[monday, tuesday, ...]` in `backend/index.js`; predicted `.map()` would work on a plain object, confirmed the real `TypeError` themselves in the console, then restructured to a proper array and correctly described the result as "items with indices" |
| Objects | understood | 2026-08-14 | 2026-08-14 | Same exercise — correctly distinguished object *keys* (the original `{monday: {...}}` shape) from array *items containing* `day`/`meal` properties, in their own words, after debugging the `.map()` gap |
| DOM manipulation (select/update elements) | seed | — | — | — |
| Event listeners (clicks, etc.) | practicing | 2026-08-14 | 2026-08-14 | Wired working `onClick` handlers on all 7 day cards, each correctly calling the `useState` setter with its own day name |
| React components, JSX, props, state | understood | 2026-08-14 | 2026-08-14 | Authored `useState`, an `onClick` setter, and a conditional-`className` ternary across all 7 days. Predicted (wrongly) that a hardcoded-vs-dynamic `className` bug on 6/7 days would still work; found via DOM inspection that state updating doesn't automatically propagate; fixed all 6 correctly, unprompted. Review quiz 8/14: unprompted, correctly explained *why* a plain variable can't hold state ("resets back to the original value after each re-render") |
| `useEffect` (side effects, dependency array) | understood | 2026-08-14 | 2026-08-14 | Authored `useEffect(() => {...}, [])` correctly on first attempt to fetch data once on mount. Review 8/14: unprompted, correctly predicted a browser refresh would be required for new backend data to appear, reasoning precisely from the empty dependency array meaning "fetch runs once on mount, nothing re-triggers it" |
| CORS (cross-origin requests, why browsers block them) | understood | 2026-08-14 | 2026-08-14 | Hit a real "Access-Control-Allow-Origin missing" error firsthand fetching `localhost:3000` from `localhost:5173`. Fixed via `cors` middleware; correctly predicted (with reasoning) that `app.use(cors())` must be registered *before* the route, since Express runs middleware top-to-bottom in registration order |
| OS-level installs (`apt`) vs. project-scoped `npm` packages | understood | 2026-08-14 | 2026-08-14 | Correctly predicted PostgreSQL would install system-wide, not into the project folder like `node_modules` — unprompted, before running anything |
| Postgres authentication (peer vs. password/TCP auth) | practicing | 2026-08-14 | 2026-08-14 | Set a real password via `ALTER USER postgres PASSWORD ...` (learned it reports back as `ALTER ROLE`, `USER` being a legacy alias) specifically because peer auth (used by `psql` via `sudo -u postgres`) doesn't apply to Node's TCP connection |
| Node `pg` client (`Pool`, connection config, query results) | understood | 2026-08-14 | 2026-08-14 | Authored a working `Pool` config and a real test query; added `err` handling unprompted. Reinforced 8/14: wired `pool.query(...).then(result => res.json(result.rows))` into the real `/api/week` route, unprompted removal of all now-dead fake-data code, correctly reasoned that an extra `id` field wouldn't break the frontend |
| systemd services (`active (exited)`, `pg_isready` as ground truth) | introduced | 2026-08-14 | 2026-08-14 | Hit the confusing "active (exited)" status line; predicted it was fine (right instinct, imprecise reasoning); verified with `pg_isready` and had the umbrella-unit mechanism explained |
| Express middleware (`app.use`, pipeline ordering) | practicing | 2026-08-14 | 2026-08-14 | Authored `app.use(cors())` correctly ordered before the route it needed to affect; grasped the top-to-bottom pipeline model well enough to predict the correct placement unprompted |
| Rendering lists in React (`.map()` + `key` prop in JSX) | understood | 2026-08-14 | 2026-08-14 | Refactored 7 hardcoded `<li>` blocks into one `week.map(...)`, also generalizing the `className` ternary and `onClick` to use dynamic `day.day` instead of hardcoded strings — unprompted. Explained `key` unprompted, in own words: "gives an identifier for react for each object, without it react would have to reconstruct the list every time" |
| CSS selectors: class vs. element/tag (styling scope) | understood | 2026-08-14 | 2026-08-14 | Review quiz 8/14: asked why a plain `li` selector would be risky; reasoned to the correct answer themselves — "if we add any li in the future they would get the same styling, which we might not necessarily want" |
| async/await and `fetch` | practicing | 2026-08-14 | 2026-08-14 | Authored a correct `fetch(...).then(res => res.json()).then(data => setWeek(data))` chain inside `useEffect`, unprompted, no syntax errors. Async/await syntax itself not yet used (`.then()` chains only so far) |
| HTTP verbs (GET/POST/PUT/DELETE) | practicing | 2026-08-14 | 2026-08-14 | Written two real `app.get(...)` routes now (tasks 3.3, 4.1); only GET exercised so far |
| SQL basics (SELECT/INSERT/UPDATE/DELETE) | practicing | 2026-08-14 | 2026-08-14 | Authored `CREATE DATABASE`, `CREATE TABLE`, a real 7-row `INSERT INTO`, and `SELECT *` against the live `meal_planner` database via `psql`. Correctly predicted sequential `SERIAL` IDs (1–7) in submission order; read `INSERT 0 7`'s confirmation format correctly once pointed at it |
| SQL relationships (foreign keys, joins) | seed | — | — | — |
| Password hashing/comparison | seed | — | — | — |
| Test assertions (expect/assert) | seed | — | — | — |
| CSS layout: Flexbox (`display:flex`, `flex-wrap`, `justify-content`, `flex: 1`) | practicing | 2026-08-14 | 2026-08-14 | Authored `.week`/`.day` flex layout independently; predicted resize behavior, observed real shrink-before-wrap mechanic (flex-basis:0 + min-width:auto floor), gap explained |
| HTML document structure (doctype, head/body, tags, valid nesting) | practicing | 2026-08-14 | 2026-08-14 | Authored `index.html` independently (no scaffold used) — valid doctype/head/body, 7 correctly-nested `<li><h2><p>` day entries, all real content |
| Block-level default rendering (headings/paragraphs stack; one bullet per `<li>`) | introduced | 2026-08-14 | 2026-08-14 | Predicted 2 lines per day (correct) and bullet placement (guessed "spans both lines," actual is "anchors to first line only") — gap explained |

## Structural (how files and pieces connect)

| Concept | Status | Introduced | Last reviewed | Evidence |
|---|---|---|---|---|
| `package.json` and npm dependencies | understood | 2026-08-14 | 2026-08-14 | Ran the Vite scaffold, saw `frontend/package.json` land with dependencies pre-filled; then ran `npm init` from scratch for `backend/`, correctly predicting most fields but expecting a dependency-install question that doesn't exist — corrected: dependencies are always a separate `npm install <pkg>` step. Review quiz 8/14: unprompted, correctly explained *why* 67 packages installed from one `npm install express` (recursive dependency trees) |
| `node_modules` | practicing | 2026-08-14 | 2026-08-14 | Watched `npm install` run during scaffolding, then confirmed via `git check-ignore` that `frontend/node_modules` is correctly ignored. Reinforced 8/14: ran `npm install express` directly, predicted only `package.json` would change, discovered the gap — 67 packages installed (dependency trees), `package-lock.json` created fresh |
| Modules (import/export) | understood | 2026-08-14 | 2026-08-14 | Authored correct CommonJS `require()` in `backend/index.js` (vs. ESM `import` in `frontend/`); explained in own words that syntax differs, then correctly identified `package.json`'s `"type"` field as what determines which one applies to a given project |
| Project folder structure (frontend vs. backend as separate folders) | practicing | 2026-08-14 | 2026-08-14 | The anticipated `backend/` folder is now real — created via `npm init`, sitting alongside `frontend/` as its own independent project with its own `package.json` |
| Vite dev server & HMR (hot module reload) | understood | 2026-08-14 | 2026-08-14 | Observed `hmr update /src/App.jsx` in the terminal on save; browser updated without a manual refresh, mechanism explained. Review quiz 8/14: unprompted, correctly explained HMR only reloads what changed rather than the whole page |
| Client-server communication (request/response) | practicing | 2026-08-13 | 2026-08-14 | API explained as the fixed contract of requests the frontend can send and responses it gets back. Reinforced 8/14: ran `backend/index.js`, correctly predicted the process would stay alive (`app.listen`), then made a real browser request to `localhost:3000` and got the actual response back |
| Frontend/backend as separate concerns | understood | 2026-08-13 | 2026-08-14 | Own words: "it also clearly separates the frontend from the backend, so i can learn each one independently". Review quiz 8/14: initially framed the frontend/backend port split as a security boundary; redirected to the tooling angle, then correctly reasoned that Vite and Express are different tools for different jobs and unprompted connected it back to the Express-over-Next.js decision |
| Environment variables (`.env` files) | understood | 2026-08-13 | 2026-08-14 | Authored the `.gitignore` entry for `.env`; first draft explained it as "varies per environment," revised after a prompt to the sharper reason (secrets exposure). Reinforced 8/14: authored a real `backend/.env` with live DB credentials, correctly called `dotenv.config()` before constructing the `Pool` that reads from `process.env` |
| Hidden files / dotfiles (e.g. `.git`) | practicing | 2026-08-13 | 2026-08-13 | Predicted `git init` would show "no changes"; corrected the gap by reasoning through where history must be stored, then ran `ls -a` themselves and found `.git` |
| `.gitignore` pattern syntax (trailing slash = folder) | practicing | 2026-08-13 | 2026-08-13 | Wrote `.env/` (folder syntax) for what's actually a file; caught and fixed it themselves after being asked to distinguish file vs. folder |
| Git branches as movable pointers (vs. commit hashes as content fingerprints) | introduced | 2026-08-14 | 2026-08-14 | Predicted `git branch -M main` would change the commit hash; ran it, saw the hash was unchanged, and the pointer-vs-fingerprint distinction was explained to close the gap |
| Git remotes (`origin`, fetch/push, `-u`/upstream tracking) | understood | 2026-08-14 | 2026-08-14 | Ran `git remote add origin ...`, correctly predicted `git remote -v` would show the GitHub URL, then ran `git push -u origin main` themselves and got a real push through. Review quiz 8/14: unprompted, correctly explained `-u` links local `main` to `origin/main` so future plain `git push`/`pull` know where to go |
| SSH host verification (known_hosts, fingerprint check) | introduced | 2026-08-14 | 2026-08-14 | Hit the first-time host-authenticity prompt on push; had it explained as a one-time trust check, accepted it correctly |

## Engineering practice

| Concept | Status | Introduced | Last reviewed | Evidence |
|---|---|---|---|---|
| Git & version control (init/commit/push) | understood | 2026-08-13 | 2026-08-14 | Quizzed "what does Git protect": correctly distinguished explicit/deliberate commits from autosave, and tied that to reliable reverting. Reinforced 8/14: correctly predicted `git status` mid-stage, post-commit clean state, and `git log --oneline` output before running each; correctly predicted `git add .` stages both untracked and modified files together; committed/pushed the full Section 2 React app solo, unprompted, no mechanics questions needed |
| Databases as persistent storage | understood | 2026-08-13 | 2026-08-14 | Own words, re: relational shape of the data: "since there a lot of links/relationships in the data for my app, a relational database...would be better". Reinforced 8/14: correctly predicted, unprompted, that a direct `psql INSERT` would show up on plain browser refresh with **no** backend restart — precisely because Express re-queries live instead of holding data in memory (the exact opposite of task 4.5's in-memory case) — then confirmed it live |
| Node script execution vs. Vite's dev tooling (no built-in file-watching) | understood | 2026-08-14 | 2026-08-14 | Correctly predicted `node index.js` would need a manual restart to pick up file changes, unlike Vite's HMR; confirmed by restarting themselves. Reinforced 8/14 in the same breath as the `useEffect` prediction, correctly separating "backend needs restart" from "frontend needs refresh" as two distinct reasons |
| Choosing PostgreSQL specifically | understood | 2026-08-13 | 2026-08-13 | Quizzed "why Postgres": correctly named both the relational shape of the data (recipes↔days) and the industry/docs reason for Postgres specifically, unprompted |
| The backend/server's role | practicing | 2026-08-13 | 2026-08-14 | Explained as core component #3; discussed again during Decision 3 (Express). Reinforced 8/14: ran a real Express server locally and confirmed it alongside the React frontend, both live at once for the first time |
| The frontend/UI's role | introduced | 2026-08-13 | 2026-08-13 | Explained as core component #4 |
| Authentication / login gate | introduced | 2026-08-13 | 2026-08-13 | Explained as core component #6; scoped explicitly into the MVP (single login, not full accounts) |
| Hosting & deployment | introduced | 2026-08-13 | 2026-08-13 | Explained as core component #7; extensively discussed via Render-vs-AWS tradeoff in Decision 5 |
| Configuration / secrets management | understood | 2026-08-13 | 2026-08-13 | Quizzed via the `.gitignore` `.env` reasoning: initial draft gave a weaker reason, revised to correctly tie it to preventing secrets exposure when prompted to reconcile with earlier own-words explanation |
| Automated testing (why/what) | seed | — | — | — |
| Scoping an MVP / deferring scope | introduced | 2026-08-13 | 2026-08-13 | Co-authored the In-MVP / Parking-lot split and working agreement in `project.md` |
| Linting as opt-in vs. bundled into dev server (CRA vs. Vite) | introduced | 2026-08-14 | 2026-08-14 | Correctly recalled CRA's auto-warnings from past experience; reconciled the gap by reading `package.json`'s scripts and seeing `lint` is separate from `dev` |
| Reading JS error messages (e.g. `ReferenceError`) | introduced | 2026-08-14 | 2026-08-14 | Predicted a vague error for `useState is not defined`; actual message named the exact identifier — precision of reference errors as a pattern was pointed out |

## AI-era practice

| Concept | Status | Introduced | Last reviewed | Evidence |
|---|---|---|---|---|
| Context management | practicing | 2026-08-13 | 2026-08-13 | Ran `/context` themselves and discussed the token breakdown |
| Agent memory files | introduced | 2026-08-13 | 2026-08-13 | Watched a memory file get created live (`prefers-working-out-problems-first.md`) and had the mechanic explained |
| Model selection (Haiku/Sonnet/Opus tradeoffs) | practicing | 2026-08-13 | 2026-08-13 | Ran `/model` themselves and confirmed current model |
| Plan mode (review before execution) | practicing | 2026-08-13 | 2026-08-13 | Toggled plan mode themselves and observed the real enter/exit system events |
| Skills (packaged workflows) | practicing | 2026-08-13 | 2026-08-13 | Ran `/skills` and `/reload-skills` themselves; asked what `code-review` does and got an explanation |
| Writing a good plan | introduced | 2026-08-13 | 2026-08-13 | Co-built the MVP scope and the locked-decisions build plan this session, decision by decision |
| Reviewing a diff | introduced | 2026-08-13 | 2026-08-13 | Asked what `/code-review` does; learned it checks correctness plus simplification/efficiency, at selectable effort levels |

---

*Last updated: 2026-08-13 — initial seed, before any code has been written.*
