const request = require('supertest');
const bcrypt = require('bcryptjs');
const createTestDatabase = require('./createTestDatabase');

const TEST_PASSWORD = 'test-password-123';
process.env.ADMIN_PASSWORD_HASH = bcrypt.hashSync(TEST_PASSWORD, 10);

const app = require('../../app');

afterAll(async () => {
    await app.prisma.$disconnect();
})

let agent;

beforeEach(async () => {
    agent = request.agent(app);
    await agent.post('/api/login').send({ password: TEST_PASSWORD });

    await createTestDatabase(app.prisma);
})

describe('Week Controller', () => {
    describe('GET /week', () => {
        it('should return each day mapped to its meal title, or null if unassigned', async () => {
            const expectedWeek = [
                { day: 'Monday', meal: 'Pasta' },
                { day: 'Tuesday', meal: null },
                { day: 'Wednesday', meal: 'Sandwich' },
                { day: 'Thursday', meal: 'Pasta' },
                { day: 'Friday', meal: null },
                { day: 'Saturday', meal: 'Burrito' },
                { day: 'Sunday', meal: 'Burrito' }
            ];

            const response = await agent.get('/api/week');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(expectedWeek);
        });
    });

    describe('PUT /week/:day', () => {
        it('should assign a recipe to the day', async () => {
            const response = await agent.put('/api/week/Tuesday').send({ recipeId: 2 });

            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({ day: 'Tuesday', recipe_id: 2 });
        });

        it('should unassign the meal when recipeId is null', async () => {
            const response = await agent.put('/api/week/Monday').send({ recipeId: null });

            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({ day: 'Monday', recipe_id: null });
        });

        it('should return status 400 when day is not a real day', async () => {
            const response = await agent.put('/api/week/Funday').send({ recipeId: 1 });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Not a valid day');
        });

        it('should return status 400 when day is not capitalized', async () => {
            const response = await agent.put('/api/week/monday').send({ recipeId: 1 });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Not a valid day');
        });

        it('should return status 400 when recipeId is not an integer', async () => {
            const response = await agent.put('/api/week/Monday').send({ recipeId: 'abc' });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Id must be an integer');
        });

        it('should return status 400 when recipeId does not exist', async () => {
            const response = await agent.put('/api/week/Monday').send({ recipeId: 999 });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Referenced record not found');
        });
    });

    describe('DELETE /week/meals', () => {
        it('should unassign every meal in the week', async () => {
            const response = await agent.delete('/api/week/meals');

            expect(response.status).toBe(204);

            const weekResponse = await agent.get('/api/week');
            weekResponse.body.forEach(row => expect(row.meal).toBeNull());
        });
    });
});
