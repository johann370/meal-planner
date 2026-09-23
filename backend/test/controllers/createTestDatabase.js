const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path')

const createTestDatabase = async (prisma) => {
    await prisma.$executeRaw`TRUNCATE TABLE week_meal, ingredients, instructions, recipes RESTART IDENTITY`;

    const filePath = path.join(__dirname, '../test-data.yaml');
    const testDataDocument = fs.readFileSync(filePath, 'utf8');
    const testYaml = yaml.load(testDataDocument);
    const testRecipes = testYaml.recipes;
    const testWeekMeals = testYaml.week_meal;

    await prisma.$transaction(
        testRecipes.map(recipe => prisma.recipes.create({
            data: {
                title: recipe.title,
                instructions: { create: recipe.instructions.map(instruction => ({ step: instruction.step, instruction: instruction.instruction })) },
                ingredients: { create: recipe.ingredients.map(ingredient => ({ name: ingredient.name, quantity: parseFloat(ingredient.quantity), unit: ingredient.unit })) }
            }
        }))
    );

    await prisma.week_meal.createMany({
        data: testWeekMeals
    })
};

module.exports = createTestDatabase;