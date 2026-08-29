const express = require('express');

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
                let foundIngredient = acc.find(item => item.name === ingredient.name && item.unit === ingredient.unit);
                if (foundIngredient) {
                    foundIngredient.quantity += parseFloat(ingredient.quantity);
                } else {
                    acc = [...acc, { name: ingredient.name, unit: ingredient.unit, quantity: parseFloat(ingredient.quantity) }];
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
