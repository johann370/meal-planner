const express = require('express');

module.exports = (pool) => {
    const router = express.Router();

    router.get('/grocery-list', async (req, res) => {
        try {
            const result = await pool.query(`
                SELECT ingredients.name, ingredients.unit, SUM(ingredients.quantity) AS quantity
                FROM week_meal
                JOIN recipes ON week_meal.recipe_id = recipes.id
                JOIN ingredients ON ingredients.recipe_id = recipes.id
                GROUP BY ingredients.name, ingredients.unit
                ORDER BY ingredients.name
            `);
            res.json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({error: 'Internal server error'});
        }
    });

    return router;
};
