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

describe('Grocery List Controller', () => {
    describe('GET /grocery-list', () => {
        it('should return the summed ingredients for every assigned meal, sorted by name', async () => {
            // Pasta (Mon, Thu) and Burrito (Sat, Sun) are each assigned twice, Sandwich (Wed) once
            const expectedList = [
                { name: 'bread', unit: 'slice', quantity: 2 },
                { name: 'cheese', unit: 'slice', quantity: 1 },
                { name: 'chicken', unit: 'lb', quantity: 2 },
                { name: 'meat', unit: 'slice', quantity: 2 },
                { name: 'pasta', unit: 'lb', quantity: 2 },
                { name: 'tomato sauce', unit: 'cup', quantity: 2 },
                { name: 'tortilla', unit: '', quantity: 2 }
            ];

            const response = await agent.get('/api/grocery-list');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(expectedList);
        });

        it('should return an empty list when no meals are assigned', async () => {
            await agent.delete('/api/week/meals');

            const response = await agent.get('/api/grocery-list');

            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });
    });
});
