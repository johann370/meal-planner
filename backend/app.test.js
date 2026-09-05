const request = require('supertest');
const bcrypt = require('bcryptjs');

const TEST_PASSWORD = 'test-password-123';
// Overwrite the real hash with one for a made-up test password, so this
// test file never needs (or risks leaking) the actual admin password.
process.env.ADMIN_PASSWORD_HASH = bcrypt.hashSync(TEST_PASSWORD, 10);

const app = require('./app');

afterAll(async () => {
  await app.prisma.$disconnect();
})

let agent;

beforeEach(async () => {
  agent = request.agent(app);
  await agent.post('/api/login').send({ password: TEST_PASSWORD });

  await app.prisma.week_meal.updateMany({ data: { recipe_id: null } });
  await app.prisma.ingredients.deleteMany();
  await app.prisma.instructions.deleteMany();
  await app.prisma.recipes.deleteMany();
})

test('GET /api/week without logging in returns 401', async () => {
  const response = await request(app).get('/api/week');
  expect(response.status).toBe(401);
});

test('POST /api/login with the wrong password is rejected', async () => {
  const response = await request(app).post('/api/login').send({ password: 'fdjskadfa' });
  expect(response.status).toBe(401);
});

test('POST /api/login with the correct password succeeds and unlocks a protected route', async () => {
  const agent = request.agent(app);
  const response = await agent.post('/api/login').send({ password: TEST_PASSWORD });
  expect(response.status).toBe(200);

  const protectedResponse = await agent.get('/api/week');
  expect(protectedResponse.status).not.toBe(401);
});

test('GET /api/week returns the expected shape once logged in', async () => {
  const response = await agent.get('/api/week');

  expect(response.status).toBe(200);
  expect(Array.isArray(response.body)).toBe(true);
  expect(response.body[0]).toHaveProperty('day');
  expect(response.body[0]).toHaveProperty('meal');
});

test('POST /api/recipes actually creates a recipe', async () => {
  const newRecipe = { title: 'Test Recipe', ingredients: [{ name: 'test ingredient', quantity: 1, unit: 'unit' }], instructions: [{ step: 1, instruction: 'test instructions' }] };
  const createResponse = await agent.post('/api/recipes').send(newRecipe);

  expect(createResponse.status).toBe(201);
  expect(createResponse.body.title).toBe(newRecipe.title);
  expect(createResponse.body).toHaveProperty('id');

  const listResponse = await agent.get('/api/recipes');
  const created = listResponse.body.find(recipe => recipe.id === createResponse.body.id);
  expect(created).toBeDefined();
});

test('PUT /api/week/:day actually assigns a recipe to a day', async () => {
  const newRecipe = { title: 'Test Assignment Recipe', ingredients: [{ name: 'x', quantity: 1, unit: 'x' }], instructions: [{ step: 1, instruction: 'x' }] };
  const createResponse = await agent.post('/api/recipes').send(newRecipe);

  const putResponse = await agent.put('/api/week/Monday').send({ recipeId: createResponse.body.id });
  expect(putResponse.status).toBe(200);

  const afterWeek = await agent.get('/api/week');
  const mondayAfter = afterWeek.body.find(d => d.day === 'Monday');
  expect(mondayAfter.meal).toBe(newRecipe.title);
});

test('PUT /api/week/:day with null recipeId unassigns a recipe from a day', async () => {
  const newRecipe = { title: 'Test Assignment Recipe', ingredients: [{ name: 'x', quantity: 1, unit: 'x' }], instructions: [{ step: 1, instruction: 'x' }] };
  const createResponse = await agent.post('/api/recipes').send(newRecipe);
  await agent.put('/api/week/Tuesday').send({ recipeId: createResponse.body.id });

  const putResponse = await agent.put('/api/week/Tuesday').send({ recipeId: null });
  expect(putResponse.status).toBe(200);

  const afterWeek = await agent.get('/api/week');
  const tuesdayAfter = afterWeek.body.find(d => d.day === 'Tuesday');
  expect(tuesdayAfter.meal).toBeNull();

});

test('DELETE /api/week/meals clears all meals for the week', async () => {
  const newRecipe = { title: 'Test Assignment Recipe', ingredients: [{ name: 'x', quantity: 1, unit: 'x' }], instructions: [{ step: 1, instruction: 'x' }] };
  const createResponse = await agent.post('/api/recipes').send(newRecipe);
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const assignDays = days.map(day => agent.put(`/api/week/${day}`).send({ recipeId: createResponse.body.id }));
  await Promise.all(assignDays);

  const deleteResponse = await agent.delete('/api/week/meals');
  expect(deleteResponse.status).toBe(204);

  const afterWeek = await agent.get('/api/week');
  afterWeek.body.forEach(d => {
    expect(d.meal).toBeNull();
  });
});