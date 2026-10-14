# Data model

Required fields are enforced in the service layer, and in the database where the column is non-nullable. Unique constraints (including unique pairs) are enforced in the database.

## Session (need to look up prisma session stores)

- [ ] id
- [ ] sid
- [ ] data
- [ ] expiresAt

## User

- [x] id
- [x] username (unique) (ignores case)
- [x] displayUsername
- [x] password (hash never plain text)
- [x] email (unique) (ignores case)
- [ ] meal planners (relation)
- [ ] recipes created (relation)
- [ ] tastes (relation, through UserTaste)
- [ ] favorites (relation, through Favorite)
- [x] created at
- users can't delete their accounts (for now)

## Recipe

- [x] id
- [x] title
- [x] ingredients (relation)
- [x] instructions (relation)
- [ ] owner/author (relation, recipe stores the user id)
- [ ] cook time (minutes)
- [ ] prep time (minutes)
- [ ] is public (boolean, default false)
- [ ] picture (optional, storage TBD)
- [ ] source URL (for imported recipes)
- [ ] tags (relation, through RecipeTag)
- [ ] ratings (relation, through RecipeRating; public average calculated from it, shown if recipe is public)
- [ ] times added to a planner (counter; only goes down to undo an accidental add)
- [x] created at
- [ ] deletedAt (timestamp, null = not deleted)
- only recipes the user can view can be added to a planner
- if a recipe in a planner becomes private, it stays in the planner; once removed, users who can't view it lose access to it
- owners can rate their own recipes (even private ones); other users can't rate private recipes
- serving size / scaling is out of scope for now

## Ingredient

- [x] id
- [x] name
- [x] quantity (decimal)
- [x] unit
- [x] recipe id

## Instruction

- [x] id
- [x] step
- [x] instruction
- [x] recipe id
- [ ] (recipe id, step) pair is unique

## RecipeTag

- [ ] recipe id
- [ ] tag id
- [ ] (recipe id, tag id) pair is unique
- users attach tags to their recipes from a searchable dropdown of all tags
- imported recipes start with no tags

## Tag

- [ ] id
- [ ] name (unique)
- fixed, predefined list; users can't create tags

## UserTaste

- [ ] user id
- [ ] tag id
- [ ] score (range and algorithm TBD)
- [ ] (user id, tag id) pair is unique
- initial scores come from a signup questionnaire (likes, dislikes, favorite types of food), then change as the user adds and removes recipes
- usage can override questionnaire answers over time (rate TBD)

## RecipeRating

- [ ] user id
- [ ] recipe id
- [ ] score (1–5 whole stars; average is a decimal)
- [ ] (user id, recipe id) pair is unique

## Favorite

- [ ] user id
- [ ] recipe id
- [ ] (user id, recipe id) pair is unique
- hidden (not removed) if the recipe becomes private

## MealPlanner

- [ ] id
- [ ] title
- [ ] is public (boolean, default false)
- [ ] owner (relation)
- [ ] meals (relation)
- [ ] created at
- [ ] last edited at (timestamp; updated by the service whenever a meal is added, removed, or changed, or the title is changed, and when planner is created)
- [ ] deletedAt (timestamp, null = not deleted)
- [ ] shared users (many-to-many, through Share)
- is public: anyone can view, only users with edit access can edit
- private recipes inside a planner are viewable by anyone who can view the planner
- planners can be deleted; deleting one sets deletedAt instead of removing the row, keeps everything else as is

## Share

- [ ] id
- [ ] user id
- [ ] planner id
- [ ] access level (enum: view/edit)
- [ ] (user id, planner id) pair is unique

## Meal

- [ ] id
- [ ] meal planner id (relation)
- [ ] day (enum: Monday–Sunday; multiple rows allowed per day)
- [ ] meal type (enum: breakfast, lunch, dinner, snack)
- [ ] recipe id
- [ ] added by (user id, relation)
- [ ] added at (timestamp)
- adding a meal bumps the user's taste scores and the recipe's times-added counter right away; removing it within a short window (10 min) undoes both
- only the user who added the meal has their taste scores changed
- clearing the planner counts as removing each meal (undo applies to any still inside the window)

## Grocery list (no table)

- calculated from a planner's meals → recipes → ingredients
- checked-off items stored in the browser's localStorage
- localStorage key includes the planner id plus the item
- checks are cleared whenever the grocery list changes (e.g. a recipe is added or removed, the planner is cleared, or a recipe's ingredients are edited)
- detect changes by saving a snapshot of the grocery list with the checks and comparing it on load
