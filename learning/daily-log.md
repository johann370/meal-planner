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