const weekService = require('../services/weekService');
const AppError = require('../lib/AppError.js');
const { serializeWeek } = require('../lib/serializeData.js');
const { validateDay, validateId } = require('../lib/validateInput.js');

const getWeek = async (req, res) => {
    const week = await weekService.getWeek();

    if (!week) {
        throw new AppError('Week not found', 404);
    }

    const serializedWeek = serializeWeek(week);

    res.json(serializedWeek);
}

const updateDayMeal = async (req, res) => {
    const { day } = req.params;
    validateDay(day);

    const { recipeId } = req.body;
    if (recipeId !== null) {
        validateId(recipeId);
    }

    const weekMeal = await weekService.getDay(day);

    if (!weekMeal) {
        throw new AppError('Day not found', 404);
    }

    const updatedMeal = await weekService.updateMeal(weekMeal, recipeId);
    res.json(updatedMeal);
}

const deleteMeals = async (req, res) => {
    await weekService.deleteMeals();
    res.status(204).send();
}

module.exports = { getWeek, updateDayMeal, deleteMeals }