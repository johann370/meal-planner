require('dotenv').config();
const prisma = require('../lib/prisma.js');

async function convertInstructions() {
    const recipes = await prisma.recipes.findMany();

    const data = recipes.flatMap(recipe => {
        return recipe.instructions.split('\n').map((instruction, index) => ({
            step: index + 1,
            instruction: instruction.trim(),
            recipe_id: recipe.id
        }));
    });

    console.log(data.length);

    await prisma.instructions.createMany({
        data: data
    });
}

convertInstructions();