# Daily Log

Entries go here, one per day, appended in date order. Copy the block from
`daily-log-template.md` for each new entry.

---

## 2026-09-14

1. **What I worked on today:**
    I finished separating the recipes and grocery list routes into their own services and controllers.

2. **Any challenges I faced:**
    I kept forgetting to put await in front of my service calls in my controller classes, leading to errors since it returns a promise. Some of these were also silent errors since my current tests failed to cover those cases, meaning I wouldn't have known about it until the app crashed due to the error.

3. **What needs to get done for tomorrow:**
    I need to expand my current tests since they don't cover nearly enough of the cases/functionality that I currently have. 

4. **Anything I need to consider/break down more:**
    - Tests for each route
    - Tests for each function in services/controller modules
    - Tests for each helper/utility function
    - Currently very little to no input validation in controllers

5. **Any other notes:**
    I should look into what makes a good test. I also want to research more on overall software design and the process of it. I feel like I'm designing small parts of the application and not thinking about the bigger picture, leading me to make a lot of refactors in my code. 

---

## 2026-09-15

1. **What I worked on today:**
    Mapping out all the tests needed for the current code, as well as some decisions that will require code changes, like some error handling. 

2. **Any challenges I faced:**
    Deciding on whether or not I should do mocking or integration tests for controllers, went with integration tests to make sure everything was working together as intended. Deciding what kinds of data validation I should have, and where I should place them (controllers vs service).


3. **What needs to get done for tomorrow:**
    Implementing the tests that were mapped out. Fix any code that fails

4. **Anything I need to consider/break down more:**
    If I want to normalize sequential order of instruction steps. What I want to do with different units for ingredients when summing them up (cup vs tbsp). 

5. **Any other notes:**
    I had an idea for the recipe suggestions I want to implement in the future, I was thinking of having like an algorithm for each user that would decide the recipes being suggested, or even presented in the view. I need to do more research on how to implement this. My first instinct was having different categories like type of protein, dish, tags that I want to implement in the future, add a score for reach that changes depending on the types of recipes that user adds to their calendar, score can also go down if they indicate that they don't like something. I could still implement the chat bot thing where the user tells the bot what kind of dish they are looking for or don't want, which the bot will then extract what categories the user is mentioning, then add or subtract as needed.

    Look into bandit algorithms. 

---

## 2026-09-17

1. **What I worked on today:**
    Created tests for services, normalize functions, and error handler. Removed some services tests from the plan since they better fit during integration tests. Mocked database calls for service tests since I don't need a real database connection for unit tests.

2. **Any challenges I faced:**
    Kept having to decide if something was real service logic worth a mocked test, or just stuff already handled by the controller before the service even gets called — ended up cutting a bunch of service tests for that reason. Also hit some Jest gotchas: arrow functions returning an object need parens around the `{}`, `jest.mock()` has to come before the `require()` it's mocking, and async functions need `.rejects.toThrow()` instead of `.toThrow()`.

3. **What needs to get done for tomorrow:**
    Controller tests, requireAuth tests, fix code for missing functionality in tests — specifically: validation on POST/PUT /recipes, `:id` and `:day` validation, and mapping the FK error in errorHandler.

4. **Anything I need to consider/break down more:**
    What validation needs to be done for controllers, what type and shape the data needs to be received in. Still undecided: instruction step ordering, and different units for the same ingredient in the grocery list.

5. **Any other notes:**
    Checking whether the controller already guarantees something can't happen was the best way to decide if a service test was worth writing.

---

## 2026-09-21

1. **What I worked on today:**
    Created test data for my database, created a reusable function that reads the data from a yaml file, and creates the tables from it. Used fs to read the file, js-yaml to extract the yaml into objects 

2. **Any challenges I faced:**
    Looking for an alternative to hard coding the test database data into the test files when I already had it all written down in a file. Had to make sure that the capitalization in my yaml file matched my database tables. Also kept getting a file doesn't exist error in fs.readFileSync because apparently it doesn't use the relative path of the file it's being called in, it uses the path of where the command to run the script was being called, in this case "npm test". The database id increments not resetting on delete, i had to use TRUNCATE ... RESTART IDENTITY to reset them, this also deletes all the rows in each table that is listed without worrying about foreign key constraints. 

3. **What needs to get done for tomorrow:**
    Same as ^

4. **Anything I need to consider/break down more:**
    Same as ^

5. **Any other notes:**
    Learned about npm install --save-dev for dev dependencies 

---

## 2026-09-22

1. **What I worked on today:**
    Created the tests for recipes controller. Created input validation for recipes. Created input validation for id. 

2. **Any challenges I faced:**
    Quantity for ingredients set to Decimal under prisma, but when it's passed down to JSON it converts it to a string. I had to convert it from a Decimal to Number so it got passed down correctly. I also ran into a bug where delete recipe threw a 500 error when I tried deleting a recipe that was assigned to the week. parseInt() sometiems passes validation on input such as "12abc" because it returns 12 instead of NaN, used Number() instead.

3. **What needs to get done for tomorrow:**
    Week controller, grocery list controller

4. **Anything I need to consider/break down more:**
    N/A

5. **Any other notes:**
    Moved id conversion to number out of service functions and into the controller. Decided that instructions/ingredients can be empty arrays.

---

## 2026-09-23

1. **What I worked on today:**
    Finished the rest of the controller tests (week, grocery list, auth) and the requireAuth unit tests, so everything in the test plan is checked off (66/66 passing). Fixed the bugs the tests found along the way: null recipeId now unassigns a day, P2003 (foreign key violation) is mapped to a 400 "Referenced record not found" in errorHandler, login with no password returns 401 instead of 500, normalizeUnit/normalizeIngredient don't crash on null, ingredients can be saved without a unit, and requireAuth now throws an AppError instead of sending its own response.

2. **Any challenges I faced:**
    The new tests found two real 500s I didn't know about: the Tortilla in my seed data has no unit, so normalizeUnit(null) crashed on .trim() and broke the whole grocery list, and bcrypt.compare throws when the password is undefined. Testing a function that throws was different from what I'd done before: expect(fn()).toThrow() doesn't work because fn() runs and throws before expect even gets called, so it has to be expect(() => fn()).toThrow(). Async functions don't need that since they return a rejected promise instead of throwing. Also, process.env only stores strings, so setting it to false actually stores "false", which is truthy. I had to use delete to clear it, and put it in afterEach so it still runs if the test fails.

3. **What needs to get done for tomorrow:**
    Plan out the design of the app more before building anything new: write down the input and response shape for every route, figure out what new tables I need, list the functionality I want to add, then decide which feature to work on next.

4. **Anything I need to consider/break down more:**
    Features already floated that need to fit into the design: real user accounts (right now there's just one shared admin login and no users table, and the recipe suggestion idea depends on it), recipe suggestions, and importing a recipe from a URL (recipeParser.js is currently dead code). Still undecided: different units for the same ingredient in the grocery list, and instruction step ordering.

5. **Any other notes:**
    Decided units can be empty (e.g. "1 tortilla") and removed the missing unit validation. Dropped the "Day not found" test since validateDay makes it unreachable, and kept the if (!week) check in getWeek for now. .toThrow() only checks the error's class and message, not statusCode, so the 401 is covered by the integration test instead.

---
