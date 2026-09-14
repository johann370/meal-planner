const weekService = require('../services/weekService');
const AppError = require('../lib/AppError.js');

const getWeek = async (req, res) => {
    const week = await weekService.getWeek();

    if (!week) {
        throw new AppError('Week not found', 404);
    }

    const weekFormatted = week.map(row => row.recipes ? ({ day: row.day, meal: row.recipes.title }) : ({ day: row.day, meal: null }));
    res.json(weekFormatted);
}

const updateDayMeal = async (req, res) => {
    const { day } = req.params;
    const { recipeId } = req.body;

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