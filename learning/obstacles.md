# Obstacles

Recurring friction and workflow pain, not one-off bugs — patterns worth
recognizing so I can watch for them (or actually fix the root cause)
instead of re-hitting and re-solving the same problem every time.

## Open

### Changing the database schema keeps breaking production
Every environment — dev, test, and production — is a separate database,
and a Prisma migration only ever touches whichever `DATABASE_URL` happens
to be active when I run it. Dev and test get migrated in the moment,
since I'm already looking at them; production only gets touched
separately, by hand, pointed at Render's database — so it's easy for a
schema change to sit "done" locally and merged on GitHub for a while
before production actually breaks.

- First hit: Section 15.6 — a migration only reached dev, and tests
  broke against `meal_planner_test` until it was applied there too.
- Hit again, worse, 2026-09-05 (Section 25): a whole two-migration
  sequence (add a table, then drop a column, both written and merged
  the same session) never touched Render at all until after merging.
  Production broke immediately on the first migration it was missing,
  and would have silently lost real, never-migrated recipe instructions
  on the second, if it had been applied blind.

Real lesson, not yet turned into an actual habit/workflow change:
**"expand and contract"** — deploy the additive migration and run any
data migration against *every* environment, production included,
*before* ever writing the destructive one — instead of authoring both
locally back-to-back and only reconciling production as an afterthought.

## Resolved

### Tests need their state manually restored by hand
Flagged 2026-09-01 (`plan.md`, "Not yet broken down"). Every mutation
test in `app.test.js` notes real data beforehand and restores it by hand
afterward, instead of starting from a known-good state that resets
itself automatically. Real risk: a test that fails partway through skips
its own cleanup code and leaves real, dev-adjacent data corrupted for
whatever runs next — already happened once for real (Section 10.3's
orphaned junk-recipe cleanup).

**Fixed 2026-09-05 (`plan.md` Section 26).** A `beforeEach` reset now
wipes `week_meal`/`ingredients`/`instructions`/`recipes` (in that order,
respecting the foreign keys) before every single test, so nothing
depends on — or has to clean up — ambient state left by another test.
The two tests that assumed something was already assigned got rewritten
to create and assign their own data first, instead of reading/restoring
whatever the shared app state happened to hold.
