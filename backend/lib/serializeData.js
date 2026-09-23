const serializeRecipe = (recipe) => {
    let serializedRecipe = recipe;
    serializedRecipe.ingredients = recipe.ingredients.map(ingredient => ({ ...ingredient, quantity: ingredient.quantity.toNumber() }));
    return serializedRecipe;
}

const serializeWeek = (week) => {
    return week.map(row => row.recipes ? ({ day: row.day, meal: row.recipes.title }) : ({ day: row.day, meal: null }));
}

module.exports = { serializeRecipe, serializeWeek };