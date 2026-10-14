# Test Plan

# Recipe Service

## createRecipe
- [X] Missing title — throws

No service-level test for missing instructions/ingredients — the controller guarantees they're always present (as arrays, possibly empty) before the service is called, so `undefined` handling in the service is defensive-only, not exercised by real usage. Service still defaults them to `[]` defensively, just untested.

## updateRecipe
No service-level tests — id-not-found is a raw Prisma `P2025` passthrough, not service-owned logic; covered by the errorHandler unit test and controller integration tests.

## deleteRecipe
No service-level tests — id-not-found is a raw Prisma `P2025` passthrough, same reasoning as updateRecipe. The `week_meal` unassign step (added after a controller test caught the FK violation) is exercised by the controller integration test instead.

## Notes / Future
- [ ] Duplicate step numbers within one recipe — rejected (decided 2026-09-24: step is unique per recipe). Test needed.
- Instruction step numbers: if user-provided steps aren't sequential (e.g. 1,2,4), consider normalizing to sequential order. Not implemented yet — decide behavior later, no test yet.

# Week Service

## updateMeal
No service-level tests. `weekMeal` can never be null/missing here — `weekController.updateDayMeal` already guards with `if (!weekMeal) throw new AppError('Day not found', 404)` before calling this service. `recipeId` null/blank is a single ternary (`recipeId ? parseInt(recipeId) : null`), not worth a mocked unit test on its own. Both covered by controller integration tests (`Day not found` — 404, null recipeId — unassigns).

No service-level test for "weekMeal id not found" or "recipeId points to a nonexistent recipe" — both are raw Prisma error passthroughs (P2025 / FK violation), not service-owned logic; covered by the errorHandler unit test and controller integration tests.

# Grocery List Service

## sumIngredients
- [X] Sums quantities for ingredients that normalize to the same name + unit (different capitalization, unit variants)

## Notes / Future
- Same ingredient name but different units (e.g. flour/cup vs flour/tbsp): undecided whether these should stay separate or get converted/combined. No test yet.

# Controllers (integration tests — real route, real DB, resets between tests)

## Recipes (recipesController / routes/recipes.js)
- [X] GET /recipes — 200, returns recipes
- [X] POST /recipes — 201, creates recipe
- [X] POST /recipes — missing required field (title/ingredients/instructions) — 400
- [X] POST /recipes — ingredient/instruction object has wrong type or missing field (e.g. name/quantity, step/instruction) — 400
- [X] POST/PUT /recipes — ingredient with no unit — 201/200, stored as `''`
- [X] PUT /recipes/:id — 200, updates recipe
- [X] PUT /recipes/:id — same required-field / shape validation as POST — 400
- [X] PUT /recipes/:id — id not a valid integer (e.g. "abc", "12abc") — 400
- [X] POST/PUT /recipes — empty instructions/ingredients array — 201/200, recipe created/updated with empty array (decided: empty is allowed)
- [X] DELETE /recipes/:id — 204
- [X] DELETE /recipes/:id — id not a valid integer — 400
- [X] DELETE /recipes/:id — recipe referenced in week plan — unassigned (`week_meal.recipe_id` set to null), not blocked

## Week (weekController / routes/week.js)
- [X] GET /week — 200, response is mapped to `{ day, meal }` per row (meal is recipe title or null) — this transform logic lives in the controller, not the service
- [X] PUT /week/:day — 200, updates the day's meal
- [X] PUT /week/:day — null recipeId — 200, unassigns the meal (meal becomes null)
- [X] PUT /week/:day — day is not one of the real day values (incl. lowercase "monday") — 400
- [X] PUT /week/:day — recipeId not a valid integer — 400
- [X] PUT /week/:day — recipeId doesn't exist (e.g. 999) — 400 (P2003 mapped in errorHandler to "Referenced record not found")
- [X] DELETE /week/meals — 204, every day's meal becomes null
- Dropped: "day not found — 404". Unreachable now that `validateDay` rejects anything outside the 7 days and the seed has all 7 rows; the `getDay` guard is defensive only.

## Grocery List (groceryListController / routes/groceryList.js)
- [X] GET /grocery-list — 200, returns summed list (incl. seed Tortilla with a null unit, which comes back as `''`)
- [X] GET /grocery-list — no meals assigned — 200, empty array

## Auth (authController / routes/auth.js)
- [X] POST /login — correct password — 200, session marked authenticated (checked via a follow-up protected request)
- [X] POST /login — wrong password — 401
- [X] POST /login — missing password — 401 "Invalid password"

## Fixes needed (not tests)
- errorHandler: map Prisma `P2002` (unique constraint violation) to 409 Conflict — needed once unique pairs exist. Add an errorHandler unit test for it.

## Decided to keep
- weekController.getWeek: `if (!week) throw 404` check kept for now, even though `findMany` never returns falsy (2026-09-23).

## Fixed
- validateIngredients: unit is no longer required (units can be empty, e.g. "1 tortilla"); a missing unit is stored as `''`.
- normalizeUnit/normalizeIngredient: null/empty input returns `''` instead of crashing on `.trim()`.
- authController.login: missing password returns 401 "Invalid password" instead of a 500 from bcrypt.
- errorHandler: Prisma `P2003` (FK violation) mapped to 400 "Referenced record not found".
- weekController: `:day` validated against the real day values (`validateDay`), `recipeId` validated with `validateId` unless it's `null` (null = unassign) — done.
- recipesController: request-shape validation for POST/PUT /recipes (`validateRecipe`/`validateInstructions`/`validateIngredients` in `lib/validateInput.js`) — done, wired into both routes.
- recipesController: `:id` param validated as an integer (`validateId` in `lib/validateInput.js`) before calling the service on PUT/DELETE — done. Uses `Number(id)` rather than `parseInt`, so trailing garbage (e.g. `"12abc"`) is correctly rejected.
- recipesService.deleteRecipe: previously threw an unhandled `P2003` (foreign key violation, 500) when deleting a recipe still assigned in `week_meal` — now unassigns those rows (`recipe_id: null`) before deleting the recipe.

# New design routes (design/routes.md) — controller integration tests, not built yet

Every protected route also gets a "not logged in — 401" test. Where a route lists several errors, one test per error, checked in the order the route lists them.

## Auth
- [ ] POST /login — correct credentials — 200, returns displayUsername, session set
- [ ] POST /login — username different capitalization — 200
- [ ] POST /login — missing username — 400
- [ ] POST /login — missing password — 400
- [ ] POST /login — missing username and password — 400 "Missing username" (first in order)
- [ ] POST /login — wrong password / unknown username — 401
- [ ] POST /logout — 204, session deleted, cookie cleared (follow-up GET /session — 401)
- [ ] GET /session — logged in — 200, returns displayUsername
- [ ] GET /session — no session — 401

## Users
- [ ] POST /users — 201, returns displayUsername, user logged in (follow-up GET /session — 200)
- [ ] POST /users — password stored hashed, not plain text
- [ ] POST /users — username/email trimmed; displayUsername keeps original capitalization
- [ ] POST /users — missing username — 400
- [ ] POST /users — invalid username (too short, too long, space, non-alphanumeric) — 400
- [ ] POST /users — missing password — 400
- [ ] POST /users — invalid password (under 8 chars, over 72 bytes) — 400
- [ ] POST /users — missing email — 400
- [ ] POST /users — invalid email (no @) — 400
- [ ] POST /users — username taken (incl. different capitalization) — 409
- [ ] POST /users — email taken (incl. different capitalization) — 409
- [ ] POST /users — taken username and missing password — 400 (400s before 409)

## Recipes
- [ ] GET /recipes — default — 200, only the user's own recipes
- [ ] GET /recipes — includedRecipes=public — public recipes; me+public shows each recipe once
- [ ] GET /recipes — single includedRecipes/tags value (plain string) — handled like a one-item array
- [ ] GET /recipes — tags filter — only recipes matching all tags
- [ ] GET /recipes — onlyFavorites — only favorites; private favorites not owned by user hidden
- [ ] GET /recipes — search — matches on title
- [ ] GET /recipes — empty / whitespace-only search — same results as no search
- [ ] GET /recipes — deleted recipes not returned
- [ ] GET /recipes — totalTime null when both times missing
- [ ] GET /recipes — includedRecipes invalid value — 400
- [ ] GET /recipes — tags not ints — 400
- [ ] GET /recipes — tag not found — 400
- [ ] GET /recipes — duplicate tag — 400
- [ ] GET /recipes — more than one search — 400
- [ ] GET /recipes — onlyFavorites with any value — treated as true
- [ ] GET /recipes/:id — own / public / in a viewable planner — 200, instructions sorted by step
- [ ] GET /recipes/:id — invalid id — 400
- [ ] GET /recipes/:id — not found / deleted — 404
- [ ] GET /recipes/:id — someone else's private recipe, not in a viewable planner — 403
- [ ] GET /recipes/:id — private recipe only in a deleted planner — 403
- [ ] POST /recipes — 201, returns full recipe; isPublic defaults false; strings trimmed
- [ ] POST /recipes — missing title / ingredients / instructions (incl. whitespace-only title) — 400
- [ ] POST /recipes — ingredient missing name — 400
- [ ] POST /recipes — ingredient quantity not a number — 400
- [ ] POST /recipes — ingredients / instructions not an array — 400
- [ ] POST /recipes — tags not an array of ints — 400
- [ ] POST /recipes — isPublic not a boolean — 400
- [ ] POST /recipes — cookTime / prepTime not a whole number — 400
- [ ] POST /recipes — tag not found — 400
- [ ] POST /recipes — duplicate tag — 400
- [ ] POST /recipes — negative cookTime / prepTime — 400
- [ ] POST /recipes — quantity 0 or negative — 400
- [ ] POST /recipes/import — supported site — 201, sourceUrl set
- [ ] POST /recipes/import — url missing — 400
- [ ] POST /recipes/import — url not a string — 400
- [ ] POST /recipes/import — not a valid url — 400
- [ ] POST /recipes/import — unsupported site (incl. lookalike hostname) — 400
- [ ] POST /recipes/import — site unreachable / redirect — 502
- [ ] POST /recipes/import — page can't be parsed — 422
- [ ] PUT /recipes/:id — 200, returns full recipe
- [ ] PUT /recipes/:id — optional field left out — cleared in DB
- [ ] PUT /recipes/:id — isPublic sent in body — ignored, visibility unchanged
- [ ] PUT /recipes/:id — invalid id — 400
- [ ] PUT /recipes/:id — same body validation as POST /recipes (each error above) — 400
- [ ] PUT /recipes/:id — not found / deleted — 404
- [ ] PUT /recipes/:id — not the owner — 403
- [ ] DELETE /recipes/:id — 204, deletedAt set
- [ ] DELETE /recipes/:id — invalid id — 400
- [ ] DELETE /recipes/:id — not found — 204
- [ ] DELETE /recipes/:id — already deleted — 204, original deletedAt kept
- [ ] DELETE /recipes/:id — not the owner — 403
- [ ] PUT /recipes/:id/rating — new rating — 200, returns myRating and publicRating
- [ ] PUT /recipes/:id/rating — existing rating — 200, updated (upsert, no duplicate row)
- [ ] PUT /recipes/:id/rating — owner rates own private recipe — 200, publicRating null
- [ ] PUT /recipes/:id/rating — invalid id — 400
- [ ] PUT /recipes/:id/rating — rating missing — 400
- [ ] PUT /recipes/:id/rating — rating not an int — 400
- [ ] PUT /recipes/:id/rating — rating outside 1-5 — 400
- [ ] PUT /recipes/:id/rating — not found / deleted — 404
- [ ] PUT /recipes/:id/rating — someone else's private recipe — 403
- [ ] DELETE /recipes/:id/rating — 200, myRating null, publicRating recalculated (null when no ratings left)
- [ ] DELETE /recipes/:id/rating — never rated — 200
- [ ] DELETE /recipes/:id/rating — invalid id — 400
- [ ] DELETE /recipes/:id/rating — not found / deleted — 404
- [ ] DELETE /recipes/:id/rating — someone else's private recipe — 403
- [ ] PUT /recipes/:id/favorite — 204; already favorited — 204
- [ ] PUT /recipes/:id/favorite — invalid id — 400
- [ ] PUT /recipes/:id/favorite — not found / deleted — 404
- [ ] PUT /recipes/:id/favorite — someone else's private recipe — 403
- [ ] DELETE /recipes/:id/favorite — 204; not favorited — 204
- [ ] DELETE /recipes/:id/favorite — private or deleted recipe — 204
- [ ] DELETE /recipes/:id/favorite — invalid id — 400
- [ ] DELETE /recipes/:id/favorite — not found — 404
- [ ] PATCH /recipes/:id/visibility — 200, isPublic updated, returns publicRating (null when set to private)
- [ ] PATCH /recipes/:id/visibility — same value isPublic already has — 200
- [ ] PATCH /recipes/:id/visibility — invalid id — 400
- [ ] PATCH /recipes/:id/visibility — isPublic missing / not a boolean — 400
- [ ] PATCH /recipes/:id/visibility — not found / deleted — 404
- [ ] PATCH /recipes/:id/visibility — not the owner — 403

## Planners
- [ ] GET /planners — default — 200, only the user's own planners, sorted a-z
- [ ] GET /planners — includedPlanners public / shared / combined — each planner shown once
- [ ] GET /planners — single includedPlanners value (plain string) — handled like a one-item array
- [ ] GET /planners — sort z-a / owner / recent — correct order, ties by id
- [ ] GET /planners — deleted planners not returned
- [ ] GET /planners — includedPlanners invalid value — 400
- [ ] GET /planners — more than one sort — 400
- [ ] GET /planners — sort invalid value — 400
- [ ] POST /planners — 201, returns full planner (meals [], sharedUsers [], accessLevel owner); isPublic defaults false; title trimmed
- [ ] POST /planners — title missing / empty / whitespace-only — 400
- [ ] POST /planners — title not a string — 400
- [ ] POST /planners — isPublic not a boolean — 400
- [ ] GET /planners/:id — owner — 200, accessLevel owner, sharedUsers list
- [ ] GET /planners/:id — shared view / edit — 200, matching accessLevel, sharedUsers null
- [ ] GET /planners/:id — public, not shared — 200, accessLevel view, sharedUsers null
- [ ] GET /planners/:id — meals ordered by day, mealType, recipeTitle, id; deleted recipe has isDeleted true
- [ ] GET /planners/:id — invalid id — 400
- [ ] GET /planners/:id — not found / deleted — 404
- [ ] GET /planners/:id — private, not shared — 403
- [ ] PATCH /planners/:id — 200, title updated and trimmed, lastEditedAt updated
- [ ] PATCH /planners/:id — invalid id — 400
- [ ] PATCH /planners/:id — title missing / empty — 400
- [ ] PATCH /planners/:id — title not a string — 400
- [ ] PATCH /planners/:id — not found / deleted — 404
- [ ] PATCH /planners/:id — shared edit user / not the owner — 403
- [ ] DELETE /planners/:id — 204, deletedAt set, shares and meals kept
- [ ] DELETE /planners/:id — invalid id — 400
- [ ] DELETE /planners/:id — not found — 204
- [ ] DELETE /planners/:id — already deleted — 204, original deletedAt kept
- [ ] DELETE /planners/:id — not the owner — 403
- [ ] PUT /planners/:id/share — new share — 200, returns shareId, displayUsername, accessLevel
- [ ] PUT /planners/:id/share — existing share — 200, accessLevel updated (no duplicate row)
- [ ] PUT /planners/:id/share — username different capitalization — 200
- [ ] PUT /planners/:id/share — lastEditedAt not changed
- [ ] PUT /planners/:id/share — invalid planner id — 400
- [ ] PUT /planners/:id/share — username missing / invalid — 400
- [ ] PUT /planners/:id/share — accessLevel missing / invalid — 400
- [ ] PUT /planners/:id/share — user not found — 400
- [ ] PUT /planners/:id/share — planner not found / deleted — 404
- [ ] PUT /planners/:id/share — not the owner — 403
- [ ] PUT /planners/:id/share — owner shares with themselves — 400
- [ ] DELETE /planners/:id/share/:shareId — 204, share removed, lastEditedAt not changed
- [ ] DELETE /planners/:id/share/:shareId — share not found — 204
- [ ] DELETE /planners/:id/share/:shareId — share belongs to another planner — 204, share not deleted
- [ ] DELETE /planners/:id/share/:shareId — invalid planner id / shareId — 400
- [ ] DELETE /planners/:id/share/:shareId — planner not found / deleted — 404
- [ ] DELETE /planners/:id/share/:shareId — not the owner — 403
- [ ] PATCH /planners/:id/visibility — 204, isPublic updated, lastEditedAt not changed
- [ ] PATCH /planners/:id/visibility — same value isPublic already has — 204
- [ ] PATCH /planners/:id/visibility — invalid id — 400
- [ ] PATCH /planners/:id/visibility — isPublic missing / not a boolean — 400
- [ ] PATCH /planners/:id/visibility — not found / deleted — 404
- [ ] PATCH /planners/:id/visibility — not the owner — 403

## Meals
- [ ] POST /planners/:id/meals — owner / edit access — 201, returns meal and lastEditedAt; taste scores and times-added counter bumped for the adding user
- [ ] POST /planners/:id/meals — own private recipe — 201
- [ ] POST /planners/:id/meals — invalid planner id — 400
- [ ] POST /planners/:id/meals — day missing / invalid — 400
- [ ] POST /planners/:id/meals — mealType missing / invalid — 400
- [ ] POST /planners/:id/meals — recipeId missing / invalid — 400
- [ ] POST /planners/:id/meals — planner not found / deleted — 404
- [ ] POST /planners/:id/meals — view access / no access — 403
- [ ] POST /planners/:id/meals — recipe not found / deleted / someone else's private recipe — 400
- [ ] POST /planners/:id/meals — view-access user with a bad recipeId — 403 (403 before recipe check)
- [ ] DELETE /planners/:id/meals/:mealId — 200, meal removed, lastEditedAt updated and returned
- [ ] DELETE /planners/:id/meals/:mealId — within 10 min — taste scores and counter reverted for the user who added it
- [ ] DELETE /planners/:id/meals/:mealId — after 10 min — taste scores and counter unchanged
- [ ] DELETE /planners/:id/meals/:mealId — meal not found / in another planner — 200, nothing deleted, lastEditedAt unchanged
- [ ] DELETE /planners/:id/meals/:mealId — invalid planner id / mealId — 400
- [ ] DELETE /planners/:id/meals/:mealId — planner not found / deleted — 404
- [ ] DELETE /planners/:id/meals/:mealId — view access / no access — 403
- [ ] DELETE /planners/:id/meals — 200, all meals removed, lastEditedAt updated; meals within 10 min reverted
- [ ] DELETE /planners/:id/meals — empty planner — 200, lastEditedAt unchanged
- [ ] DELETE /planners/:id/meals — invalid id — 400
- [ ] DELETE /planners/:id/meals — planner not found / deleted — 404
- [ ] DELETE /planners/:id/meals — view access / no access — 403

## Grocery list
- [ ] GET /planners/:id/groceryList — owner / shared / public — 200
- [ ] GET /planners/:id/groceryList — same name + unit (different capitalization, spacing, plural s) — combined
- [ ] GET /planners/:id/groceryList — same name, different units — separate lines
- [ ] GET /planners/:id/groceryList — same name with and without unit/quantity — the one with more info wins
- [ ] GET /planners/:id/groceryList — deleted recipes left out
- [ ] GET /planners/:id/groceryList — no meals — 200, empty items
- [ ] GET /planners/:id/groceryList — invalid id — 400
- [ ] GET /planners/:id/groceryList — not found / deleted — 404
- [ ] GET /planners/:id/groceryList — private, not shared — 403

## Tags
- [ ] GET /tags — no search — 200, all tags ordered by id
- [ ] GET /tags — empty / whitespace-only search — same results as no search
- [ ] GET /tags — search matches start of whole tag name (e.g. "mid" matches "Middle Eastern")
- [ ] GET /tags — search mid-name doesn't match (e.g. "east" doesn't match "Middle Eastern")
- [ ] GET /tags — search different capitalization / surrounding spaces — still matches
- [ ] GET /tags — search with no matches — 200, empty tags
- [ ] GET /tags — more than one search — 400

# Middleware

## requireAuth (unit test — mock req/res/next, no HTTP needed)
- [X] Authenticated session (`req.session.authenticated` true) — calls `next()`
- [X] Unauthenticated session — throws `AppError` 401 "Not authenticated" (passed on to errorHandler), `next()` not called
- [X] `LOCAL_DEV_BYPASS_AUTH` env var set — calls `next()` regardless of session
- [X] One integration smoke test on any single protected route (e.g. GET /recipes) with no session — 401, confirms wiring in app.js (lives in `authController.test.js`)

## errorHandler (unit test — call with a mock err, no HTTP needed)
- [X] `AppError` instance — responds with its own `statusCode` and message, `status: 'fail'`
- [X] Prisma `P2025` error — converted to `AppError` 404 "Record not found", then handled same as above
- [X] Prisma `P2003` error (FK violation) — converted to `AppError` 400 "Referenced record not found"
- [X] Unknown/generic error — 500, `status: 'error'`, message "Internal Server Error"

## Notes / Future

# Lib

## normalizeUnit
- [X] Synonym in the map — converts to canonical form (e.g. "pound"/"pounds" -> "lb", "tablespoons" -> "tbsp")
- [X] Uppercase input — converted to lowercase
- [X] Trailing spaces — trimmed
- [X] Trailing period — stripped (e.g. "tbsp." -> "tbsp")
- [X] No match in synonym map — returns the (cleaned) string unchanged

## normalizeIngredient
- [X] Trailing spaces — trimmed
- [X] Capitalization — converted to lowercase

## Not testing for now
- recipeParser.js (parseIngredient) — currently dead code, only referenced in a commented-out block; revisit once the import-from-url feature is actually built.
- AppError — trivial constructor, already exercised indirectly by every 400/401/404 test elsewhere in this plan.
