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
| Arrays | seed | — | — | — |
| Objects | seed | — | — | — |
| DOM manipulation (select/update elements) | seed | — | — | — |
| Event listeners (clicks, etc.) | seed | — | — | — |
| React components, JSX, props, state | seed | — | — | — |
| async/await and `fetch` | seed | — | — | — |
| HTTP verbs (GET/POST/PUT/DELETE) | seed | — | — | — |
| SQL basics (SELECT/INSERT/UPDATE/DELETE) | seed | — | — | — |
| SQL relationships (foreign keys, joins) | seed | — | — | — |
| Password hashing/comparison | seed | — | — | — |
| Test assertions (expect/assert) | seed | — | — | — |

## Structural (how files and pieces connect)

| Concept | Status | Introduced | Last reviewed | Evidence |
|---|---|---|---|---|
| `package.json` and npm dependencies | seed | — | — | — |
| `node_modules` | seed | — | — | — |
| Modules (import/export) | seed | — | — | — |
| Project folder structure (frontend vs. backend as separate folders) | seed | — | — | — |
| Client-server communication (request/response) | introduced | 2026-08-13 | 2026-08-13 | API explained as the fixed contract of requests the frontend can send and responses it gets back |
| Frontend/backend as separate concerns | introduced | 2026-08-13 | 2026-08-13 | Own words: "it also clearly separates the frontend from the backend, so i can learn each one independently" |
| Environment variables (`.env` files) | practicing | 2026-08-13 | 2026-08-13 | Authored the `.gitignore` entry for `.env`; first draft explained it as "varies per environment," revised after a prompt to the sharper reason (secrets exposure) |
| Hidden files / dotfiles (e.g. `.git`) | practicing | 2026-08-13 | 2026-08-13 | Predicted `git init` would show "no changes"; corrected the gap by reasoning through where history must be stored, then ran `ls -a` themselves and found `.git` |
| `.gitignore` pattern syntax (trailing slash = folder) | practicing | 2026-08-13 | 2026-08-13 | Wrote `.env/` (folder syntax) for what's actually a file; caught and fixed it themselves after being asked to distinguish file vs. folder |

## Engineering practice

| Concept | Status | Introduced | Last reviewed | Evidence |
|---|---|---|---|---|
| Git & version control (init/commit/push) | understood | 2026-08-13 | 2026-08-13 | Quizzed "what does Git protect": correctly distinguished explicit/deliberate commits from autosave, and tied that to reliable reverting |
| Databases as persistent storage | introduced | 2026-08-13 | 2026-08-13 | Own words, re: relational shape of the data: "since there a lot of links/relationships in the data for my app, a relational database...would be better" |
| Choosing PostgreSQL specifically | understood | 2026-08-13 | 2026-08-13 | Quizzed "why Postgres": correctly named both the relational shape of the data (recipes↔days) and the industry/docs reason for Postgres specifically, unprompted |
| The backend/server's role | introduced | 2026-08-13 | 2026-08-13 | Explained as core component #3; discussed again during Decision 3 (Express) |
| The frontend/UI's role | introduced | 2026-08-13 | 2026-08-13 | Explained as core component #4 |
| Authentication / login gate | introduced | 2026-08-13 | 2026-08-13 | Explained as core component #6; scoped explicitly into the MVP (single login, not full accounts) |
| Hosting & deployment | introduced | 2026-08-13 | 2026-08-13 | Explained as core component #7; extensively discussed via Render-vs-AWS tradeoff in Decision 5 |
| Configuration / secrets management | understood | 2026-08-13 | 2026-08-13 | Quizzed via the `.gitignore` `.env` reasoning: initial draft gave a weaker reason, revised to correctly tie it to preventing secrets exposure when prompted to reconcile with earlier own-words explanation |
| Automated testing (why/what) | seed | — | — | — |
| Scoping an MVP / deferring scope | introduced | 2026-08-13 | 2026-08-13 | Co-authored the In-MVP / Parking-lot split and working agreement in `project.md` |

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
