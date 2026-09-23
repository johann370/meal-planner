const request = require('supertest');
const bcrypt = require('bcryptjs');

const TEST_PASSWORD = 'test-password-123';
process.env.ADMIN_PASSWORD_HASH = bcrypt.hashSync(TEST_PASSWORD, 10);

const app = require('../../app');

afterAll(async () => {
    await app.prisma.$disconnect();
})

let agent;

beforeEach(() => {
    agent = request.agent(app);
})

describe('Auth Controller', () => {
    describe('POST /login', () => {
        it('should log in and authenticate the session with the correct password', async () => {
            const response = await agent.post('/api/login').send({ password: TEST_PASSWORD });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ success: true });

            const protectedResponse = await agent.get('/api/week');
            expect(protectedResponse.status).toBe(200);
        });

        it('should return status 401 with the wrong password', async () => {
            const response = await agent.post('/api/login').send({ password: 'wrong-password' });

            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Invalid password');

            const protectedResponse = await agent.get('/api/week');
            expect(protectedResponse.status).toBe(401);
        });

        it('should return status 401 when password is missing', async () => {
            const response = await agent.post('/api/login').send({});

            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Invalid password');
        });
    });

    describe('requireAuth', () => {
        it('should return status 401 on a protected route without logging in', async () => {
            const response = await agent.get('/api/recipes');

            expect(response.status).toBe(401);
        });
    });
});
