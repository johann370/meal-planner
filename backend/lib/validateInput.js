const AppError = require('../lib/AppError');

const validateInstructions = (instructions) => {
    if (!instructions) {
        return;
    }

    instructions.forEach(instruction => {
        if (!instruction.step) {
            throw new AppError('Missing step in instruction', 400);
        } else if (!instruction.instruction) {
            throw new AppError('Missing instruction in instruction', 400);
        }

        if (!Number.isInteger(instruction.step)) {
            throw new AppError('Step must be an integer', 400);
        }
    })
}

const validateIngredients = (ingredients) => {
    if (!ingredients) {
        return;
    }

    ingredients.forEach(ingredient => {
        if (!ingredient.name) {
            throw new AppError('Missing name in ingredient', 400);
        } else if (!ingredient.quantity) {
            throw new AppError('Missing quantity in ingredient', 400);
        }

        if (Number.isNaN(Number(ingredient.quantity))) {
            throw new AppError('Quantity must be a number', 400);
        }
    })
}

const validateRecipe = (recipe) => {
    if (!recipe.title) {
        throw new AppError('Missing title', 400);
    } else if (!recipe.instructions) {
        throw new AppError('Missing instructions', 400);
    } else if (!recipe.ingredients) {
        throw new AppError('Missing ingredients', 400);
    }

    if (!Array.isArray(recipe.instructions)) {
        throw new AppError('Instructions invalid type, must be array', 400);
    } else if (!Array.isArray(recipe.ingredients)) {
        throw new AppError('Ingredients invalid type, must be array', 400);
    }

    validateInstructions(recipe.instructions);
    validateIngredients(recipe.ingredients);
}

const validateId = (id) => {
    if (!id) {
        throw new AppError('Id must be present', 400);
    }

    if (Number.isNaN(Number(id))) {
        throw new AppError('Id must be an integer', 400);
    }
}

const validateDay = (day) => {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    if (!daysOfWeek.includes(day)) {
        throw new AppError('Not a valid day', 400);
    }
}

module.exports = { validateRecipe, validateId, validateDay };