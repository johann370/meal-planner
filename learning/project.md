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
