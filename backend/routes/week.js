const express = require('express');

module.exports = (pool) => {
    const router = express.Router();

    router.get('/week', async (req, res) => {
        try {
            const result = await pool.query(`
                SELECT week_meal.day, recipes.title AS meal
                FROM week_meal
                JOIN recipes ON recipe_id = recipes.id
                ORDER BY week_meal.id
            `);
            res.json(result.rows);
        } catch(err) {
            console.error(err);
            res.status(500).json({error: 'Internal server error'});
        }
    });

    router.put('/week/:day', async (req, res) => {
        const {day} = req.params;
        const {recipeId} = req.body;

        try {
            const result = await pool.query('UPDATE week_meal SET recipe_id = $1 WHERE day = $2 RETURNING *', [recipeId, day]);
            res.json(result.rows[0]);
        } catch(err) {
            res.status(500).json({error: err.message});
        }
    });

    return router;
};
