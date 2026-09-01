const express = require('express');

module.exports = (prisma) => {
    const router = express.Router();

    router.get('/week', async (req, res) => {
        try {
            const weekRawData = await prisma.week_meal.findMany({ include: { recipes: true }, orderBy: { id: 'asc' } });
            const week = weekRawData.map(row => row.recipes ? ({ day: row.day, meal: row.recipes.title }) : ({ day: row.day, meal: null }));
            res.json(week);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    router.put('/week/:day', async (req, res) => {
        const { day } = req.params;
        const { recipeId } = req.body;

        try {
            const weekMeal = await prisma.week_meal.findFirst({ where: { day } });
            const updated = await prisma.week_meal.update({ where: { id: weekMeal.id }, data: { recipe_id: recipeId ? parseInt(recipeId) : null } });
            res.json(updated);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    router.delete('/week/meals', async (req, res) => {
        try {
            await prisma.week_meal.updateMany({ data: { recipe_id: null } });
            res.status(204).send();
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    return router;
};
