const unitSynonyms = {
    "pound": "lb",
    "pounds": "lb",
    "tablespoon": "tbsp",
    "tablespoons": "tbsp",
    "teaspoon": "tsp",
    "teaspoons": "tsp",
    "ounce": "oz",
    "ounces": "oz",
    "cups": "cup",
};

function normalizeUnit(rawUnit) {
    const cleaned = rawUnit.trim().toLowerCase().replace(/\.$/, '');
    return unitSynonyms[cleaned] || cleaned;
}

function normalizeIngredient(rawIngredient) {
    const cleaned = rawIngredient.trim().toLowerCase();
    return cleaned;
}

module.exports = { normalizeUnit, normalizeIngredient };
