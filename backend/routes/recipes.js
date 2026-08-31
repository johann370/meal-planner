const express = require('express');
const cheerio = require('cheerio');
const { parseIngredient } = require('../lib/recipeParser.js');
const { normalizeUnit, normalizeIngredient } = require('../lib/normalize.js');

module.exports = (prisma) => {
    const router = express.Router();

    async function createRecipe({ title, ingredients, instructions }) {
        const newRecipe = await prisma.recipes.create({
            data: {
                title,
                instructions,
                ingredients: { create: ingredients.map(ingredient => ({ name: normalizeIngredient(ingredient.name), quantity: ingredient.quantity, unit: normalizeUnit(ingredient.unit) })) }
            },
            include: { ingredients: true }
        });
        return newRecipe;
    }

    router.get('/recipes', async (req, res) => {
        try {
            const recipes = await prisma.recipes.findMany({ include: { ingredients: true }, orderBy: { id: 'asc' } });
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

            const updatedRecipe = await prisma.recipes.update({
                where: { id: parseInt(id) },
                data: {
                    title,
                    instructions,
                    ingredients: {
                        deleteMany: {},
                        create: ingredients.map(ingredient => ({ name: normalizeIngredient(ingredient.name), unit: normalizeUnit(ingredient.unit), quantity: ingredient.quantity }))
                    }
                },
                include: { ingredients: true }
            });
            res.json(updatedRecipe);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    });

    router.delete('/recipes/:id', async (req, res) => {
        try {
            const { id } = req.params;
            await prisma.ingredients.deleteMany({ where: { recipe_id: parseInt(id) } });
            await prisma.recipes.delete({ where: { id: parseInt(id) } });
            res.status(204).send()
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    });

    return router;
};
