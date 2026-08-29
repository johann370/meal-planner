const express = require('express');
const cheerio = require('cheerio');
const { parseIngredient } = require('../lib/recipeParser.js');

module.exports = (pool) => {
    const router = express.Router();

    async function createRecipe({ title, ingredients, instructions }) {
        const recipeResult = await pool.query(`
            INSERT INTO recipes (title, instructions)
            VALUES ($1, $2)
            RETURNING *
        `, [title, instructions]);
        const newRecipe = recipeResult.rows[0];
        const insertPromises = ingredients.map(ingredient => pool.query(`
            INSERT INTO ingredients (name, quantity, unit, recipe_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `, [ingredient.name, ingredient.quantity, ingredient.unit, newRecipe.id]));

        const ingredientsResult = await Promise.all(insertPromises);
        newRecipe.ingredients = ingredientsResult.map(ingredient => ingredient.rows[0]);
        return newRecipe;
    }

    router.get('/recipes', async (req, res) => {
        try {
            const recipesResult = await pool.query('SELECT * FROM recipes ORDER BY id');
            const ingredientsResult = await pool.query('SELECT * FROM ingredients ORDER BY id');
            const recipes = recipesResult.rows.map(recipe => ({
                ...recipe,
                ingredients: ingredientsResult.rows.filter(ingredient => ingredient.recipe_id === recipe.id)
            }));
            res.json(recipes);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    router.post('/recipes/import-from-url', async (req, res) => {
        try {
            const { url } = req.body;
            const response = await fetch(url);
            const html = await response.text();

            const $ = cheerio.load(html);
            const jsonLdText = $('script[type="application/ld+json"]').first().html()
            if (!jsonLdText) {
                throw new Error('Could not get recipe data');
            }
            const jsonLd = JSON.parse(jsonLdText);
            const recipeData = (jsonLd['@graph'] || []).find(item => item['@type'] === 'Recipe');
            if (!recipeData) {
                throw new Error('Could not get recipe data');
            }

            const title = recipeData.name;
            const ingredients = recipeData.recipeIngredient.map(ingredient => parseIngredient(ingredient));
            const instructions = recipeData.recipeInstructions.map(instruction => instruction.text).join('\n');
            const newRecipe = await createRecipe({ title, ingredients, instructions });

            res.status(201).json(newRecipe);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    });

    router.post('/recipes', async (req, res) => {
        try {
            const newRecipe = await createRecipe(req.body);
            res.status(201).json(newRecipe);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    });

    router.put('/recipes/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const { title, ingredients, instructions } = req.body;

            const result = await pool.query(`
                UPDATE recipes
                SET title = $1, instructions = $2
                WHERE id = $3
                RETURNING *
            `, [title, instructions, id]);
            const updatedRecipe = result.rows[0];
            await pool.query('DELETE FROM ingredients WHERE recipe_id = $1', [id]);

            const insertPromises = ingredients.map(ingredient => pool.query(`
                INSERT INTO ingredients (name, quantity, unit, recipe_id)
                VALUES ($1, $2, $3, $4)
                RETURNING *
            `, [ingredient.name, ingredient.quantity, ingredient.unit, id]));
            const ingredientsResult = await Promise.all(insertPromises);
            updatedRecipe.ingredients = ingredientsResult.map(ingredient => ingredient.rows[0]);
            res.json(updatedRecipe);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    });

    router.delete('/recipes/:id', async (req, res) => {
        try {
            const { id } = req.params;
            await pool.query('DELETE FROM ingredients WHERE recipe_id = $1', [id]);
            await pool.query('DELETE FROM recipes WHERE id = $1 RETURNING *', [id]);
            res.status(204).send()
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    });

    return router;
};
