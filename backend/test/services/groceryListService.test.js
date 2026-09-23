const { sumIngredients } = require('../../services/groceryListService');

describe('Sum ingredients', () => {
    it('sums quantities for ingredients that normalize to the same name and unit', () => {
        const ingredients = [
            { name: 'Flour', quantity: 1, unit: 'cup' },
            { name: 'flour', quantity: 2, unit: 'cups' },
            { name: 'Sugar', quantity: 1, unit: 'tbsp' },
        ];

        const result = sumIngredients(ingredients);

        expect(result).toEqual([
            { name: 'flour', unit: 'cup', quantity: 3 },
            { name: 'sugar', unit: 'tbsp', quantity: 1 },
        ]);
    });
})
