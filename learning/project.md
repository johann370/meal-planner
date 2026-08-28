# meal-planner

## Who I am

CS grad (2022), have built a couple of projects before, but haven't coded in
a few years — rusty on practice, not fundamentals. I prefer to work through
problems on my own first and ask for help once I'm actually stuck, rather
than being handed the solution right away.

## Project idea

Save recipes and plan meals across a week. A grocery list would be nice to
have eventually, but it's explicitly *not* required for the app to be
useful — you should be able to look at the week and know what you're
cooking without it.

## In the MVP

The smallest set of features that makes this genuinely usable end to end,
live on the internet — not a demo running on a laptop.

- Create, edit, and delete a recipe (title, ingredients, instructions)
- Assign recipes to days of a single week and view that week's plan
- Data persists in a real database — not in-memory, not local-only
- Deployed to a real public URL on the actual internet, not just
  `localhost` and not just reachable on the home network
- Minimal single-user access control (e.g. one login/password) so the live
  site isn't wide open for anyone passing by to edit — deliberately *not* a
  full account system, just enough gating to call it "live" responsibly

## Parking lot (v2)

Real ideas, deliberately deferred — written down so they stop nagging, not
forgotten.

- Grocery list generation (already flagged as non-essential)
- Multi-user accounts, sharing plans, roles/permissions
- Nutrition/calorie tracking
- Recipe search, tags, categories
- Recipe import from a URL
- Recipe photos/images
- Multiple weeks / history of past plans, copy-week-forward
- Drag-and-drop calendar UI
- Ratings/reviews, notes on past cooks
- Export/print the week's plan
- Notifications/reminders
- Any AI-driven meal recommendations/suggestions

### Rated 2026-08-25 (bigger-vision items, discussed this session)

Difficulty = how much new, hard-to-debug ground it breaks. Importance =
how much it'd actually get used/loved, from what's been said about the
project so far.

| Idea | Difficulty | Importance | Why |
|---|---|---|---|
| **Cookbook-style recipe view** — display a recipe's instructions as a proper readable page (title/ingredients/steps laid out like a cookbook), not just a raw list in a form | Low | Medium | Pure frontend/CSS work on data that already exists (`recipes` table, full CRUD already built) — no new backend, no new concepts, just a new view. Good "quick win" that also makes the app feel real to actually cook from. |
| **Recipe parser for common recipe websites** — paste a URL, auto-fill title/ingredients/instructions instead of typing them by hand | Medium | Medium-High | Sounds huge, but most recipe sites embed a standard machine-readable format (`schema.org` Recipe JSON-LD) specifically so tools like this can read them — scoping to "sites that use that format" (most major ones do) keeps it a fetch-and-parse job, not a general web-scraper. Real new concepts (fetching + parsing another site's HTML, handling the sites that *don't* comply). High convenience payoff — removes all manual entry. |
| **Personal user accounts** — every user gets their own login, own recipes, own weeks, instead of one shared hardcoded login | Medium-High | High (foundational) | Real auth system: registration, per-user password storage, and — the part with teeth — every existing table (`recipes`, `week_meal`) needs a `user_id` column and every query needs to filter by it, or one user sees another's data. `project.md`'s working agreement already flagged full multi-user auth as deliberately out of v1. Unlocks sharing, and makes "AI learns *your* preferences" mean something real instead of "the one user this app has." |
| **AI preference learning + recommendations** — an AI learns what you tend to cook/like and suggests meals, either proactively or on request | High | Medium-High | Newest kind of problem here — no prior task has called an external AI service, designed a prompt, or decided what "preference" even means as data (explicit ratings? inferred from what gets cooked?). Works in a shallow form *today* (single hardcoded user, preferences = "this app's data so far"), but only becomes genuinely useful once **personal accounts** exist, since recommendations are only meaningful per-person. Natural candidate for *after* accounts, not before. |

Recommended order, given the dependency between the last two: cookbook
view and/or the recipe parser first (both stand alone, no blockers),
personal accounts before AI recommendations (AI recommendations need a
real "you" for a preference to belong to).

### Rated 2026-08-25 (the rest of the original parking lot)

Same scale. Three original items (multi-user accounts, recipe import from
a URL, AI recommendations) are the same ideas already rated above under
their newer names, so they're not repeated here.

| Idea | Difficulty | Importance | Why |
|---|---|---|---|
| **Grocery list generation** | Low-Medium | High | The one item `project.md` already flagged by name as wanted. Mechanically it's "sum up ingredients across a week's assigned recipes" — straightforward *if* ingredients are structured data; messier if they're free-text strings ("2 cups flour") that need parsing to combine matching items. Scope-dependent difficulty: a plain concatenated list (no smart merging) is Low; deduping/summing quantities pushes it toward Medium. |
| **Multiple weeks / history** — store more than one week, navigate between past/future ones, copy-week-forward | Medium | Medium-High | Real schema change: `week_meal` currently has no concept of *which* week, just a day name — needs a week identifier (e.g. a start date) added and existing data migrated. Meaningfully raises the app's ceiling: right now there's only ever been one week, ever. |
| **Recipe search, tags, categories** | Low-Medium | Medium | Search is a simple filter on existing data. Tags need a new table (a recipe can have many tags, a tag can apply to many recipes) — new relationship shape, but the same kind of foreign-key thinking already used for `week_meal`. Matters more as the recipe list grows past a screenful; not urgent yet. |
| **Recipe photos/images** | Medium | Medium | Needs actual file upload handling and somewhere to store the files themselves — a Postgres text column can hold a URL but not the image, so this likely means a new piece of infrastructure (object storage) never touched yet. Pairs naturally with the cookbook view for a real "this looks like a cookbook" feel. |
| **Ratings/reviews, notes on past cooks** | Low | Low-Medium | Just new column(s) on an existing table (or a small new one) — no new concepts. Nice personal touch, but nothing currently blocks using the app without it. |
| **Export/print the week's plan** | Low | Low | A print-specific CSS stylesheet (or a simple text/PDF export) on data that already renders fine on screen. Minor convenience, not core to "know what you're cooking." |
| **Drag-and-drop calendar UI** | Medium-High | Low-Medium | Pure UX polish — the existing dropdown-based day assignment (task 6.4) already does the job functionally. Real new concept (drag events / a DnD library) for a feature that doesn't unlock anything new, just makes an existing action fancier. |
| **Nutrition/calorie tracking** | High | Low-Medium | Needs either a nutrition database/API per ingredient or a lot of manual data entry, plus correctly scaling by quantity — a lot of new surface area for a feature nothing said was a priority. |
| **Notifications/reminders** | Medium-High | Low | Needs a delivery mechanism this app has never touched (email/push) and something to trigger it (a schedule/cron). Doesn't fit the "glance at the week" use case especially well — lowest-importance item on the whole list. |

## Core components to learn and build

The major pieces needed to go from nothing to this app running live on the
internet, end to end. Roughly in the order they get built.

1. **Source control (Git + GitHub)** — tracks every change to the code over
   time and backs it up online, so you can always get back to a working
   version. Set this up before writing any app code.
2. **The database** — a program dedicated to storing data reliably so
   recipes and the week's plan are still there after a restart or a new
   deploy.
3. **The backend (server)** — the program that does the actual work (save a
   recipe, fetch a week, check a login) and is the only thing allowed to
   talk to the database directly.
4. **The frontend (UI)** — the pages, buttons, and forms rendered in the
   browser; turns stored data into something a person can actually look at
   and use.
5. **The API** — the fixed set of requests the frontend is allowed to send
   the backend and the answers it gets back; the contract/wire connecting
   frontend and backend.
6. **Authentication (the login gate)** — checks that only the one intended
   person can use the app before letting a request through. Required
   because this app is going out on the real internet.
7. **Hosting / deployment** — renting space on an always-on computer (e.g.
   AWS) to run the backend, frontend, and database at a real URL, and the
   act of pushing code there from a laptop. Nothing counts as "live" without
   this piece.
8. **Configuration / secrets management** — passwords and keys the app
   needs, kept out of source control entirely so they never end up
   committed to GitHub, where a leak would hand out real access.

## Working agreement

If a parking-lot item gets proposed as "just a small addition" to the MVP,
call it out by name and confirm before it gets folded in. Full multi-user
auth (registration, password reset, roles) in particular stays out of v1 —
the MVP only needs the minimum gate to be safely public.
