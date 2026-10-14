# Login routes

## POST /login (logs in a user)

    - Body:
        - username: string
        - password: string
    - Response: (200)
        - displayUsername: string
    - Errors:
        - Missing username (400)
        - Missing password (400)
        - Incorrect credentials (401)
    - Other comments:
        - Session stores user id
        - Session stored id in a cookie

# Logout routes

## POST /logout (logs out a user)

    - Response: (204)
    - Other comments:
        - Deletes user session
        - Clears cookie

# Session routes

## GET /session (gets session of logged in user)

    - Response: (200)
        - displayUsername: string
    - Errors:
        - No session found (401)
    - Other comments:
        - Gets user session on page refresh

# User routes

## POST /users (creates a new user)

    - Body:
        - username : string  [a-zA-Z0-9] [min 3 characters, max 15 characters] [no spaces] [not case sensitive] [trimmed whitespace]
        - password : string [min 8 characters, max 72 bytes]
        - email : string [@ required] [not case sensitive] [trimmed whitespace]
    - Response: (201)
        - displayUsername : string
    - Errors:
        - Missing username (400)
        - Invalid username (400)
        - Missing password (400)
        - Invalid password (400)
        - Missing email (400)
        - Invalid email (400)
        - Username taken (409)
        - Email taken (409)
    - Other comments:
        - Passwords must be hashed
        - Logs in user after succesful account creation
        - Session stores user id
        - Usernames are not case sensitive but the capitalization is stored how the user wrote it

# Recipes routes

## GET /recipes (gets user's recipes, public recipes)

    - Query parameters:
        - filter
            - tags : [int]
            - includedRecipes : ['me', 'public']
            - onlyFavorites
        - search : string
    - Response: (200)
        - recipes : []
            - id : int
            - title : string
            - author : string (displayUsername)
            - sourceUrl : string | null
            - isOwner : bool
            - totalTime : int (cookTime + prepTime) | null
            - publicRating : float | null
    - Errors:
        - Not logged in (401)
        - includedRecipes not a valid value (400)
        - Tags not array of ints (400)
        - Tag not found (400)
        - Duplicate tag (400)
        - Cannot include more than one search (400)
    - Other comments:
        - Only show recipes that match all tags if present
        - Show recipes that match either in includedRecipes
        - includedRecipes defaults to me if not present
        - onlyFavorites is true if included
        - search parameter is on title
        - search is trimmed; empty or whitespace-only search is treated as if search wasn't included
        - Tags are list of tag ids
        - Favorited recipes that are private and not owned by the user are not shown
        - Recipes that match me and public should only be shown once
        - totalTime null is returned when both times are missing
        - Pagination later
        - Deleted recipes hidden
        - Frontend displays domain instead of author if sourceUrl set
        - Query parameter arrays (tags, includedRecipes) arrive as a plain string when only one value is sent; wrap it in an array before validating

## GET /recipes/:recipeId (gets recipe if user has access to it)

    - Path parameters:
        - recipeId : int
    - Response: (200)
        - id : int
        - title : string
        - author : string (displayUsername)
        - isOwner : bool
        - isPublic : bool
        - sourceUrl : string | null
        - cookTime : int | null
        - prepTime : int | null
        - ingredients : [object]
            - id : int
            - name : string
            - quantity : float | null
            - unit : string | null
        - instructions : [object]
            - id : int
            - step : int
            - instruction : string
        - tags : [object]
            - id : int
            - name : string
        - myRating : int | null
        - publicRating : float | null
        - isFavorited : bool
    - Errors:
        - Not logged in (401)
        - Invalid recipeId (400)
        - Recipe not found (404) (also on deleted recipes)
        - No access to specified recipe (403)
    - Other comments:
        - Only access to recipes that user owns, are public, or in a planner the user can view
        - Deleted planners don't grant access to their recipes
        - Instructions sorted by step
        - 403 for no access since recipe ids aren't sensitive info
        - Deleted recipes hidden, throw 404
        - Frontend displays domain instead of author if sourceUrl set

## POST /recipes (creates a new recipe belonging to the user)

    - Body:
        - title : string
        - isPublic : bool (optional)
        - cookTime : int (optional)
        - prepTime : int (optional)
        - ingredients : [object]
            - name : string
            - quantity : float | null
            - unit : string | null
        - instructions : [string]
        - tags : [int] (optional)
    - Response: (201)
        - id : int
        - title : string
        - author : string (displayUsername)
        - isOwner : bool
        - isPublic : bool
        - sourceUrl : string | null
        - cookTime : int | null
        - prepTime : int | null
        - ingredients : [object]
            - id : int
            - name : string
            - quantity : float | null
            - unit : string | null
        - instructions : [object]
            - id : int
            - step : int
            - instruction : string
        - tags : [object]
            - id : int
            - name : string
        - myRating : int | null
        - publicRating : float | null
        - isFavorited : bool
    - Errors:
        - Not logged in (401)
        - Missing title (400)
        - Missing ingredients (400)
        - Missing instructions (400)
        - Ingredient missing name (400)
        - Ingredient quantity not a number (400)
        - Ingredients not an array (400)
        - Instructions not an array (400)
        - Tags not array of ints (400)
        - isPublic not a boolean (400)
        - cookTime not a whole number (400)
        - prepTime not a whole number (400)
        - Tag not found (400)
        - Duplicate tag (400)
        - Cook time >= 0 (400)
        - Prep time >= 0 (400)
        - Quantity must be greater than 0 (400)
    - Other comments:
        - Tags are list of tag ids
        - Transaction needed for Recipe, Instruction, Ingredients, RecipeTag, Rating
        - Trim strings, empty are counted as missing
        - sourceUrl added in a different route

## POST /recipes/import (imports a recipe from a url)

    - Body:
        - url : string
    - Response: (201)
        - id : int
        - title : string
        - author : string (displayUsername)
        - isOwner : bool
        - isPublic : bool
        - sourceUrl : string
        - cookTime : int | null
        - prepTime : int | null
        - ingredients : [object]
            - id : int
            - name : string
            - quantity : float | null
            - unit : string | null
        - instructions : [object]
            - id : int
            - step : int
            - instruction : string
        - tags : [object]
            - id : int
            - name : string
        - myRating : int | null
        - publicRating : float | null
        - isFavorited : bool
    - Errors:
        - Not logged in (401)
        - Url missing (400)
        - Url not a string (400)
        - Not a valid url (400)
        - Site not supported (400)
        - Could not access url (502)
        - Could not import recipe (422)
    - Other comments:
        - Parse url and compare hostname exactly to prevent malicious websites trying to mimic hostname (remove www. from url)
        - Don't allow redirects (may have to add exceptions to http -> https or www.)

## PUT /recipes/:recipeId (edits a recipe belonging to the user)

    - Path parameters:
        - recipeId : int
    - Body:
        - title : string
        - cookTime : int (optional)
        - prepTime : int (optional)
        - ingredients : [object]
            - name : string
            - quantity : float | null
            - unit : string | null
        - instructions : [string]
        - tags : [int] (optional)
    - Response: (200)
        - id : int
        - title : string
        - author : string (displayUsername)
        - isOwner : bool
        - isPublic : bool
        - sourceUrl : string | null
        - cookTime : int | null
        - prepTime : int | null
        - ingredients : [object]
            - id : int
            - name : string
            - quantity : float | null
            - unit : string | null
        - instructions : [object]
            - id : int
            - step : int
            - instruction : string
        - tags : [object]
            - id : int
            - name : string
        - myRating : int | null
        - publicRating : float | null
        - isFavorited : bool
    - Errors:
        - Not logged in (401)
        - Invalid recipeId (400)
        - Missing title (400)
        - Missing ingredients (400)
        - Missing instructions (400)
        - Ingredient missing name (400)
        - Ingredient quantity not a number (400)
        - Ingredients not an array (400)
        - Instructions not an array (400)
        - Tags not array of ints (400)
        - cookTime not a whole number (400)
        - prepTime not a whole number (400)
        - Tag not found (400)
        - Duplicate tag (400)
        - Cook time >= 0 (400)
        - Prep time >= 0 (400)
        - Quantity must be greater than 0 (400)
        - Recipe not found (404) (also on deleted recipes)
        - No access to specified recipe (403)
    - Other comments:
        - Tags are list of tag ids
        - Transaction needed for Recipe, Instruction, Ingredients, RecipeTag, deleting ingredients/instructions/tags
        - Trim strings, empty are counted as missing
        - sourceUrl added in a different route
        - Leaving out parameter clears it from database, only applies to listed parameters in body
        - Cannot updated deleted recipe
        - Only owners may edit
        - isPublic will be changed in its own route
        - isPublic sent in the body is ignored

## DELETE /recipes/:recipeId (deletes a recipe belonging to the user)

    - Path parameters:
        - recipeId : int
    - Response: 204
    - Errors:
        - Not logged in (401)
        - Invalid recipeId (400)
        - No access to specified recipe (403)
    - Other comments:
        - Updates deletedAt
        - Only owners may delete
        - recipeId not found still results in success
        - Recipe that has already been deleted results in success
        - Deleting an already deleted recipe keeps the original deletedAt

## PUT /recipes/:recipeId/rating (edits the rating of a recipe for the user)

    - Path parameters:
        - recipeId : int
    - Body:
        - rating : int
    - Response: (200)
        - myRating : int
        - publicRating : float | null
    - Errors:
        - Not logged in (401)
        - Invalid recipeId (400)
        - Rating missing (400)
        - Rating not an int (400)
        - Rating must be between 1-5 (400)
        - Specified recipe not found (404) (also on deleted recipes)
        - Specified recipe is private (403) (if not owner)
    - Other comments:
        - Use upsert for updating/inserting in prisma on the (userId, recipeId) unique pair
        - Public rating is null on private recipes

## DELETE /recipes/:recipeId/rating (deletes a rating of a recipe for the user)

    - Path parameters:
        - recipeId : int
    - Response: (200)
        - myRating : null
        - publicRating : float | null
    - Errors:
        - Not logged in (401)
        - Invalid recipeId (400)
        - Specified recipe not found (404) (also on deleted recipes)
        - Specified recipe is private (403) (if not owner)
    - Other comments:
        - Public rating is null if all the ratings where deleted, or if recipe is private
        - Success on delete rating on a recipe user has not previously rated
        - Use deleteMany so it doesn't throw error on not found

## PUT /recipes/:recipeId/favorite (adds recipe to the favorites of a user)

    - Path parameters:
        - recipeId : int
    - Response: (204)
    - Errors:
        - Not logged in (401)
        - Invalid recipeId (400)
        - Specified recipe not found (404) (also on deleted recipes)
        - Specified recipe is private (403) (if not owner)
    - Other comments:
        - Success on recipe a user has already favorited
        - Use upsert for updating/inserting in prisma on the (userId, recipeId) unique pair

## DELETE /recipes/:recipeId/favorite (removes a recipe from the favorites of a user)

    - Path parameters:
        - recipeId : int
    - Response: (204)
    - Errors:
        - Not logged in (401)
        - Invalid recipeId (400)
        - Specified recipe not found (404)
    - Other comments:
        - Success on recipe a user has not favorited
        - Users allowed to unfavorite private recipes
        - Users allowed to unfavorite deleted recipes
        - Use deleteMany so it doesn't throw error on not found

## PATCH /recipes/:recipeId/visibility (changes the visibility of a user's recipe)

    - Path parameters:
        - recipeId : int
    - Body:
        - isPublic : bool
    - Response: (200)
        - publicRating : float | null
    - Errors:
        - Not logged in (401)
        - Invalid recipeId (400)
        - isPublic missing (400)
        - isPublic not a boolean (400)
        - Specified recipe not found (404) (also on deleted recipes)
        - No access to specified recipe (403) (not owners)
    - Other comments:
        - Succeeds on putting same value isPublic already has
        - isPublic can be set on recipe creation but not on PUT /recipes/:recipeId

# Planner routes

## GET /planners (gets the user's list of planners)

    - Query parameters:
        - includedPlanners : ['me', 'public', 'shared']
        - sort : ('a-z', 'z-a', 'owner', 'recent')
    - Response: (200)
        - planners : [object]
            - id : int
            - title : string
            - isPublic : bool
            - lastEditedAt : timestamp
            - owner : string (displayUsername)
    - Errors:
        - Not logged in (401)
        - includedPlanners not a valid value (400)
        - Cannot include more than one sort (400)
        - Sort not a valid value (400)
    - Other comments:
        - includedPlanners specifies which planners to show, defaults to me when not included
        - pagination later
        - if planner in multiple lists (i.e. me and public) it only shows once
        - sort recent sorts by lastEditedAt
        - no sort defaults a-z
        - sort owner is also sorted by a-z on title
        - other ties sorted by planner id
        - recent is newest first
        - Does not include deleted planners
        - includedPlanners arrives as a plain string when only one value is sent; wrap it in an array before validating

## POST /planners (creates a planner for the user)

    - Body:
        - title : string
        - isPublic : bool (optional)
    - Response: (201)
        - id : int
        - title : string
        - isPublic : bool
        - owner : string (displayUsername)
        - lastEditedAt : timestamp
        - meals : []
        - sharedUsers : []
        - accessLevel : owner
    - Errors:
        - Not logged in (401)
        - title is missing (400) (empty strings)
        - title not a string (400)
        - isPublic not valid (400)
    - Other comments:
        - isPublic defaults to false if not set
        - lastEditedAt updated on create
        - trim title, empty counted as missing

## GET /planners/:plannerId (gets a planner if the user has access to it)

    - Path parameters:
        - plannerId : int
    - Response: (200)
        - id : int
        - title : string
        - isPublic : bool
        - owner : string (displayUsername)
        - lastEditedAt : timestamp
        - sharedUsers : [object] | null
            - shareId : int
            - displayUsername : string
            - accessLevel : enum (view, edit)
        - meals : [object]
            - id : int
            - day : enum
            - mealType : enum
            - addedBy : string (displayUsername)
            - addedAt : timestamp
            - recipeId : int
            - recipeTitle : string
            - isDeleted : bool
        - accessLevel : enum (view, edit, owner)
    - Errors:
        - Not logged in (401)
        - plannerId is invalid (400)
        - Planner with specified id not found (404) (also on deleted planners)
        - No access to planner (403) (not owner or not shared or not public)
    - Other comments:
        - Meals ordered by day and mealType and recipeTitle and mealId
        - access level defaults to view on public planners
        - owner has owner access level (computed from the planner's owner, not stored in Share)
        - sharedUsers only available to owner

## PATCH /planners/:plannerId (edits a planner if the owner)

    - Path parameters:
        - plannerId : int
    - Body:
        - title : string
    - Response: (200)
        - id : int
        - title : string
        - isPublic : bool
        - owner : string (displayUsername)
        - lastEditedAt : timestamp
        - sharedUsers : [object]
            - shareId : int
            - displayUsername : string
            - accessLevel : enum (view, edit)
        - meals : [object]
            - id : int
            - day : enum
            - mealType : enum
            - addedBy : string (displayUsername)
            - addedAt : timestamp
            - recipeId : int
            - recipeTitle : string
            - isDeleted : bool
        - accessLevel : enum (view, edit, owner)
    - Errors:
        - Not logged in (401)
        - plannerId is invalid (400)
        - title is missing (400) (also on empty)
        - title is not a string (400)
        - Specified planner not found (404) (also on deleted planners)
        - Do not have required permissions (403) (not an owner)
    - Other comments:
        - title is trimmed
        - updates lastEditedAt

## DELETE /planners/:plannerId (deletes a planner if the owner)

    - Path parameters:
        - plannerId : int
    - Response: (204)
    - Errors:
        - Not logged in (401)
        - plannerId is invalid (400)
        - No access to planner (403) (not an owner)
    - Other comments:
        - Updates deletedAt of the planner
        - plannerId not found still results in success
        - Planner that has already been deleted results in success
        - Deleting an already deleted planner keeps the original deletedAt

## PUT /planners/:plannerId/share (shares a planner with another user if the owner)

    - Path parameters:
        - plannerId : int
    - Body:
        - username : string
        - accessLevel : string ('view', 'edit')
    - Response: (200)
        - shareId : int
        - displayUsername : string
        - accessLevel : string ('view', 'edit')
    - Errors:
        - Not logged in (401)
        - plannerId is invalid (400)
        - username is missing (400)
        - username is invalid (400)
        - accessLevel is missing (400)
        - accessLevel is invalid (400)
        - User not found (400)
        - Planner with specified id not found (404) (also on deleted planners)
        - Do not have required permissions (403) (not an owner)
        - Owner cannot share with themselves (400)

## DELETE /planners/:plannerId/share/:shareId (removes a user's permissions from the planner)

    - Path parameters:
        - plannerId : int
        - shareId : int
    - Response: (204)
    - Errors:
        - Not logged in (401)
        - plannerId is invalid (400)
        - shareId is invalid (400)
        - Planner with specified id not found (404) (also on deleted planners)
        - Do not have required permissions (403) (not an owner)
    - Other comments:
        - shareId not found still results in success
        - Only deletes share whose id and planner match

## PATCH /planners/:plannerId/visibility (changed the visibility of a user's planner)

    - Path parameters:
        - plannerId : int
    - Body:
        - isPublic : bool
    - Response (204)
    - Errors:
        - Not logged in (401)
        - Invalid plannerId (400)
        - isPublic is missing (400)
        - isPublic is not a boolean (400)
        - Specified planner not found (404) (also on deleted planners)
        - No access to specified planner (403) (not owner)
    - Other comments:
        - Succeeds on putting same value isPublic already has
        - isPublic can be set on planner creation but not on PATCH /planners/:plannerId
        - Does not update lastEditedAt

## POST /planners/:plannerId/meals (adds a meal to the planner)

    - Path parameters:
        - plannerId : int
    - Body:
        - day : enum
        - mealType : enum
        - recipeId : int
    - Response: (201)
        - id : int
        - addedBy : string (displayUsername)
        - addedAt : timestamp
        - day : enum
        - mealType : enum
        - recipeId : int
        - recipeTitle : string
        - lastEditedAt : timestamp
    - Errors:
        - Not logged in (401)
        - plannerId is invalid (400)
        - day is missing (400)
        - day is invalid (400)
        - mealType is missing (400)
        - mealType is invalid (400)
        - recipeId is missing (400)
        - recipeId is invalid (400)
        - Specified planner not found (404) (also on deleted planners)
        - Do not have required permissions (403) (not owner / edit access)
        - Specified recipe not found (400) (also on deleted recipes / recipes user cannot view)
    - Other comments:
        - Must be owner or have edit access level
        - Updates user taste of user that added meal
        - Updates lastEditedAt
        - Updates recipe times-addec counter

## DELETE /planners/:plannerId/meals/:mealId (deletes a meal from the planner)

    - Path parameters:
        - plannerId : int
        - mealId : int
    - Response: (200)
        - lastEditedAt : timestamp
    - Errors
        - Not logged in (401)
        - plannerId is invalid (400)
        - mealId is invalid (400)
        - Specified planner not found (404) (also on deleted planners)
        - Do not have required permissions (403) (not owner / edit access)
    - Other comments:
        - Must be owner or have edit access level
        - Specified meal must be in specified planner
        - lastEditedAt only updates if there a meals was deleted
        - Reverts user taste of user that added if deleted within 10 min
        - Reverts recipe times-added counter if deleted within 10 min

## DELETE /planners/:plannerId/meals (clears all meals from the planner)

    - Path parameters:
        - plannerId : int
    - Response: (200)
        - lastEditedAt : timestamp
    - Errors:
        - Not logged in (401)
        - plannerId is invalid (400)
        - Specified planner not found (404) (also on deleted planners)
        - Do not have required permissions (403) (not owner / edit access)
    - Other comments:
        - lastEditedAt only updates if there were meals that were cleared
        - Reverts user taste of user that added if deleted within 10 min
        - Reverts recipe times-added counter if deleted within 10 min

## GET /planners/:plannerId/groceryList (gets grocery list of planner)

    - Path parameters:
        - plannerId : int
    - Response: (200)
        - items : [object]
            - name : string
            - unit : string | null
            - quantity : float | null
    - Errors:
        - Not logged in (401)
        - plannerId is invalid (400)
        - Specified planner not found (404) (also on deleted planners)
        - Do not have required permissions (403) (not owner or not shared or not public)
    - Other comments
        - Units/quantities/names are normalized before being sent to user
        - Strings lowercased and trimmed
        - Plural s trimmed as well (have to check for ingredients that end in s)
        - If no unit/quantity, same ingredients with unit/quantity override, ones with more info override
        - Same names + units combined, different units are in their own lines (might add conversion later)
        - Leave out deleted recipes

# Tags routes

## GET /tags (gets list of recipe tags)

    - Query parameters:
        - search : string
    - Response: (200)
        - tags : [object]
            - id : int
            - name : string
    - Errors:
        - Not logged in (401)
        - Only one search parameter allowed (400)
    - Other comments:
        - Trim search, case doesn't matter
        - No search or empty search defaults to getting all
        - Ordered by id
        - Search matches the start of the whole tag name
