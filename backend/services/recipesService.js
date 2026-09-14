const prisma = require('../lib/prisma');
const { normalizeUnit, normalizeIngredient } = require('../lib/normalize.js');

const createRecipe = async (title, ingredients, instructions) => {
    const newRecipe = await prisma.recipes.create({
        data: {
            title,
            instructions: { create: instructions.map(instruction => ({ step: instruction.step, instruction: instruction.instruction })) },
            ingredients: { create: ingredients.map(ingredient => ({ name: normalizeIngredient(ingredient.name), quantity: ingredient.quantity, unit: normalizeUnit(ingredient.unit) })) }
        },
        include: { ingredients: true, instructions: true }
    });
    return newRecipe;
}

const getRecipes = async () => {
    return await prisma.recipes.findMany({
        include: {
            ingredients: true,
            instructions: {
                orderBy: { step: 'asc' }
            }
        }, orderBy: { id: 'asc' }
    });
}

const updateRecipe = async (id, title, ingredients, instructions) => {
    return await prisma.recipes.update({
        where: { id: parseInt(id) },
        data: {
            title,
            instructions: {
                deleteMany: {},
                create: instructions.map(instruction => ({ step: instruction.step, instruction: instruction.instruction }))
            },
            ingredients: {
                deleteMany: {},
                create: ingredients.map(ingredient => ({ name: normalizeIngredient(ingredient.name), unit: normalizeUnit(ingredient.unit), quantity: ingredient.quantity }))
            }
        },
        include: { ingredients: true, instructions: true }
    });
}

const deleteRecipe = async (id) => {
    await prisma.instructions.deleteMany({ where: { recipe_id: parseInt(id) } });
    await prisma.ingredients.deleteMany({ where: { recipe_id: parseInt(id) } });
    await prisma.recipes.delete({ where: { id: parseInt(id) } });
}


module.exports = { createRecipe, getRecipes, updateRecipe, deleteRecipe }