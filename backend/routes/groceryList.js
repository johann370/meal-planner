const express = require('express');
const { normalizeUnit, normalizeIngredient } = require('../lib/normalize.js');

module.exports = (prisma) => {
    const router = express.Router();

    router.get('/grocery-list', async (req, res) => {
        try {
            const weekMeals = await prisma.week_meal.findMany({
                include: { recipes: { include: { ingredients: true } } }
            });

            const allIngredients = weekMeals
                .filter(weekMeal => weekMeal.recipes)
                .flatMap(weekMeal => weekMeal.recipes.ingredients);

            const groceryList = allIngredients.reduce((acc, ingredient) => {
                let foundIngredient = acc.find(item => normalizeIngredient(item.name) === normalizeIngredient(ingredient.name) && normalizeUnit(item.unit) === normalizeUnit(ingredient.unit));
                if (foundIngredient) {
                    foundIngredient.quantity += parseFloat(ingredient.quantity);
                } else {
                    acc = [...acc, { name: normalizeIngredient(ingredient.name), unit: normalizeUnit(ingredient.unit), quantity: parseFloat(ingredient.quantity) }];
                }
                return acc;
            }, [])
                .sort((a, b) => a.name.localeCompare(b.name));

            res.json(groceryList);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    return router;
};
