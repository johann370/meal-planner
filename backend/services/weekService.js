const prisma = require('../lib/prisma');

const getWeek = async () => {
    return await prisma.week_meal.findMany({
        include: { recipes: true },
        orderBy: { id: 'asc' }
    });
}

const getDay = async (day) => {
    return await prisma.week_meal.findFirst({ where: { day } });
}

const updateMeal = async (weekMeal, recipeId) => {
    return await prisma.week_meal.update({ where: { id: weekMeal.id }, data: { recipe_id: recipeId ? parseInt(recipeId) : null } });
}

const deleteMeals = async () => {
    await prisma.week_meal.updateMany({ data: { recipe_id: null } });
}


module.exports = { getWeek, getDay, updateMeal, deleteMeals };