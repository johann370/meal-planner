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

// Runs fresh before every test below that uses `agent` — a pre-logged-in
// session, ready to go, without each test having to log in itself.
let agent;

beforeEach(async () => {
  agent = request.agent(app);
  await agent.post('/api/login').send({ password: TEST_PASSWORD });
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
  const newRecipe = { title: 'Test Recipe', ingredients: [{ name: 'test ingredient', quantity: 1, unit: 'unit' }], instructions: 'test instructions' };
  const createResponse = await agent.post('/api/recipes').send(newRecipe);

  expect(createResponse.status).toBe(201);
  expect(createResponse.body.title).toBe(newRecipe.title);
  expect(createResponse.body).toHaveProperty('id');

  const listResponse = await agent.get('/api/recipes');
  const created = listResponse.body.find(recipe => recipe.id === createResponse.body.id);
  expect(created).toBeDefined();

  await agent.delete(`/api/recipes/${createResponse.body.id}`);
});

test('PUT /api/week/:day actually assigns a recipe to a day', async () => {
  // Capture Monday's current assignment so we can restore it afterward —
  // there's no "delete a day," only ever a different recipe assigned to it.
  const beforeWeek = await agent.get('/api/week');
  const mondayBefore = beforeWeek.body.find(d => d.day === 'Monday');
  const recipes = await agent.get('/api/recipes');
  const originalRecipe = recipes.body.find(r => r.title === mondayBefore.meal);

  // Create a temporary recipe to assign to Monday.
  const newRecipe = { title: 'Test Assignment Recipe', ingredients: [{ name: 'x', quantity: 1, unit: 'x' }], instructions: 'x' };
  const createResponse = await agent.post('/api/recipes').send(newRecipe);

  const putResponse = await agent.put('/api/week/Monday').send({ recipeId: createResponse.body.id });
  expect(putResponse.status).toBe(200);

  const afterWeek = await agent.get('/api/week');
  const mondayAfter = afterWeek.body.find(d => d.day === 'Monday');
  expect(mondayAfter.meal).toBe(newRecipe.title);

  // Restore Monday's original assignment, then delete the temporary recipe.
  await agent.put('/api/week/Monday').send({ recipeId: originalRecipe.id });
  await agent.delete(`/api/recipes/${createResponse.body.id}`);
});

test('PUT /api/week/:day with null recipeId unassigns a recipe from a day', async () => {
  // Capture Tuesday's current assignment so we can restore it afterward.
  const beforeWeek = await agent.get('/api/week');
  const tuesdayBefore = beforeWeek.body.find(d => d.day === 'Tuesday');
  const recipes = await agent.get('/api/recipes');
  const originalRecipe = recipes.body.find(r => r.title === tuesdayBefore.meal);

  // Unassign Tuesday's recipe.
  const putResponse = await agent.put('/api/week/Tuesday').send({ recipeId: null });
  expect(putResponse.status).toBe(200);

  const afterWeek = await agent.get('/api/week');
  const tuesdayAfter = afterWeek.body.find(d => d.day === 'Tuesday');
  expect(tuesdayAfter.meal).toBeNull();

  // Restore Tuesday's original assignment.
  await agent.put('/api/week/Tuesday').send({ recipeId: originalRecipe.id });
});

test('DELETE /api/week/meals clears all meals for the week', async () => {
  // Capture the current assignments so we can restore them afterward.
  const beforeWeek = await agent.get('/api/week');
  const originalAssignments = beforeWeek.body.map(d => ({ day: d.day, meal: d.meal }));

  // Clear all meals for the week.
  const deleteResponse = await agent.delete('/api/week/meals');
  expect(deleteResponse.status).toBe(204);

  const afterWeek = await agent.get('/api/week');
  afterWeek.body.forEach(d => {
    expect(d.meal).toBeNull();
  });

  // Restore the original assignments.
  const recipes = await agent.get('/api/recipes');
  for (const assignment of originalAssignments) {
    const recipe = recipes.body.find(r => r.title === assignment.meal);
    await agent.put(`/api/week/${assignment.day}`).send({ recipeId: recipe ? recipe.id : null });
  }
});