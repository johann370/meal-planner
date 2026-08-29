const express = require('express');

module.exports = (prisma) => {
    const router = express.Router();

    router.get('/week', async (req, res) => {
        try {
            const weekRawData = await prisma.week_meal.findMany({ include: { recipes: true }, orderBy: { id: 'asc' } });
            const week = weekRawData.filter(row => row.recipes).map(row => ({ day: row.day, meal: row.recipes.title }));
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
            const updated = await prisma.week_meal.update({ where: { id: weekMeal.id }, data: { recipe_id: parseInt(recipeId) } });
            res.json(updated);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    return router;
};
