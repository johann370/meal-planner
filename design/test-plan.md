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
- (none)

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
