const recipesService = require('../services/recipesService');

const getRecipes = async (req, res) => {
    const recipes = await recipesService.getRecipes();

    res.json(recipes);
}

const createRecipe = async (req, res) => {
    const { title, ingredients, instructions } = req.body;
    const newRecipe = await recipesService.createRecipe(title, ingredients, instructions);

    res.status(201).json(newRecipe);
}

const updateRecipe = async (req, res) => {
    const { id } = req.params;
    const { title, ingredients, instructions } = req.body;
    const updatedRecipe = await recipesService.updateRecipe(id, title, ingredients, instructions);

    res.json(updatedRecipe);
}

const deleteRecipe = async (req, res) => {
    const { id } = req.params;
    await recipesService.deleteRecipe(id);

    res.status(204).send();
}

// router.post('/recipes/import-from-url', async (req, res) => {
//     try {
//         const { url } = req.body;
//         const response = await fetch(url);
//         const html = await response.text();

//         const $ = cheerio.load(html);
//         const jsonLdText = $('script[type="application/ld+json"]').first().html()
//         if (!jsonLdText) {
//             throw new Error('Could not get recipe data');
//         }
//         const jsonLd = JSON.parse(jsonLdText);
//         const recipeData = (jsonLd['@graph'] || []).find(item => item['@type'] === 'Recipe');
//         if (!recipeData) {
//             throw new Error('Could not get recipe data');
//         }

//         const title = recipeData.name;
//         const ingredients = recipeData.recipeIngredient.map(ingredient => parseIngredient(ingredient));
//         const instructions = recipeData.recipeInstructions.map(instruction => instruction.text).join('\n');
//         const newRecipe = await createRecipe({ title, ingredients, instructions });

//         res.status(201).json(newRecipe);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: err.message });
//     }
// });

module.exports = { getRecipes, createRecipe, updateRecipe, deleteRecipe }