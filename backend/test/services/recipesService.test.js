jest.mock('../../lib/prisma', () => ({
    recipes: { create: jest.fn() }
}));
const prisma = require('../../lib/prisma');
const AppError = require('../../lib/AppError');
const { createRecipe } = require('../../services/recipesService');

beforeEach(() => {
    jest.clearAllMocks();
})

describe('Create Recipe', () => {
    it('should throw AppError when title is empty string', async () => {
        await expect(createRecipe('', [], [])).rejects.toThrow(AppError);
    });
})