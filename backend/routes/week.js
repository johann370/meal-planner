const express = require('express');
const AppError = require('../lib/AppError.js');

module.exports = (prisma) => {
    const router = express.Router();

    router.get('/week', async (req, res) => {
        const weekRawData = await prisma.week_meal.findMany({ include: { recipes: true }, orderBy: { id: 'asc' } });
        const week = weekRawData.map(row => row.recipes ? ({ day: row.day, meal: row.recipes.title }) : ({ day: row.day, meal: null }));
        res.json(week);
    });

    router.put('/week/:day', async (req, res) => {
        const { day } = req.params;
        const { recipeId } = req.body;

        const weekMeal = await prisma.week_meal.findFirst({ where: { day } });

        if (!weekMeal) {
            throw new AppError('Day not found', 404);
        }

        const updated = await prisma.week_meal.update({ where: { id: weekMeal.id }, data: { recipe_id: recipeId ? parseInt(recipeId) : null } });
        res.json(updated);

    });

    router.delete('/week/meals', async (req, res) => {
        await prisma.week_meal.updateMany({ data: { recipe_id: null } });
        res.status(204).send();
    });

    return router;
};
