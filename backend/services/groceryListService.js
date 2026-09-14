const prisma = require('../lib/prisma');
const { normalizeUnit, normalizeIngredient } = require('../lib/normalize.js');

const sumIngredients = (ingredients) => {
    return ingredients.reduce((acc, ingredient) => {
        let foundIngredient = acc.find(item => normalizeIngredient(item.name) === normalizeIngredient(ingredient.name) && normalizeUnit(item.unit) === normalizeUnit(ingredient.unit));
        if (foundIngredient) {
            foundIngredient.quantity += parseFloat(ingredient.quantity);
        } else {
            acc = [...acc, { name: normalizeIngredient(ingredient.name), unit: normalizeUnit(ingredient.unit), quantity: parseFloat(ingredient.quantity) }];
        }
        return acc;
    }, [])
        .sort((a, b) => a.name.localeCompare(b.name));
}

const getGroceryList = async () => {
    const weekMeals = await prisma.week_meal.findMany({
        include: { recipes: { include: { ingredients: true } } }
    });

    const allIngredients = weekMeals
        .filter(weekMeal => weekMeal.recipes)
        .flatMap(weekMeal => weekMeal.recipes.ingredients);

    const groceryList = sumIngredients(allIngredients);

    return groceryList;
}

module.exports = { getGroceryList, sumIngredients }