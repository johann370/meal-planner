const request = require('supertest');
const bcrypt = require('bcryptjs');
const createTestDatabase = require('./createTestDatabase');
const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path')

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

describe('Recipe Controller', () => {
    describe('GET /recipes', () => {
        it('should get return recipes on GET', async () => {
            const filePath = path.join(__dirname, '../test-data.yaml');
            const testDataDocument = fs.readFileSync(filePath, 'utf8');
            const testYaml = yaml.load(testDataDocument);
            const testRecipes = testYaml.recipes;

            const response = await agent.get('/api/recipes');

            expect(response.status).toBe(200);
            expect(response.body).toMatchObject(testRecipes);
        });
    })

    describe('POST /recipes', () => {
        it('should create a new recipe ', async () => {
            const newRecipe = {
                title: 'test recipe',
                instructions: [
                    {
                        step: 1,
                        instruction: 'Step 1'
                    },
                    {
                        step: 2,
                        instruction: 'Step 2'
                    }
                ],
                ingredients: [
                    {
                        name: 'test ingredient',
                        quantity: 10,
                        unit: 'lb'
                    },
                    {
                        name: 'salt',
                        quantity: 1,
                        unit: 'tsp'
                    }
                ]
            }

            const response = await agent.post('/api/recipes').send(newRecipe);

            expect(response.status).toBe(201);
            expect(response.body.id).toBe(4);
            expect(response.body).toMatchObject(newRecipe);
        });

        it('should return status 400 on missing title', async () => {
            const newRecipe = {
                instructions: [
                    {
                        step: 1,
                        instruction: 'Step 1'
                    },
                    {
                        step: 2,
                        instruction: 'Step 2'
                    }
                ],
                ingredients: [
                    {
                        name: 'test ingredient',
                        quantity: 10,
                        unit: 'lb'
                    },
                    {
                        name: 'salt',
                        quantity: 1,
                        unit: 'tsp'
                    }
                ]
            }

            const response = await agent.post('/api/recipes').send(newRecipe);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Missing title')
        });

        it('should return status 400 on missing ingredients', async () => {
            const newRecipe = {
                title: 'test recipe',
                instructions: [
                    {
                        step: 1,
                        instruction: 'Step 1'
                    },
                    {
                        step: 2,
                        instruction: 'Step 2'
                    }
                ],
            }

            const response = await agent.post('/api/recipes').send(newRecipe);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Missing ingredients')
        });

        it('should return status 400 on missing instructions', async () => {
            const newRecipe = {
                title: 'test recipe',
                ingredients: [
                    {
                        name: 'test ingredient',
                        quantity: 10,
                        unit: 'lb'
                    },
                    {
                        name: 'salt',
                        quantity: 1,
                        unit: 'tsp'
                    }
                ]
            }

            const response = await agent.post('/api/recipes').send(newRecipe);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Missing instructions')
        })

        it('should return status 400 when instructions is not an array', async () => {
            const newRecipe = {
                title: 'test recipe',
                instructions: 'Step 1, Step 2',
                ingredients: [
                    {
                        name: 'test ingredient',
                        quantity: 10,
                        unit: 'lb'
                    }
                ]
            }

            const response = await agent.post('/api/recipes').send(newRecipe);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Instructions invalid type, must be array')
        });

        it('should return status 400 when ingredients is not an array', async () => {
            const newRecipe = {
                title: 'test recipe',
                instructions: [
                    {
                        step: 1,
                        instruction: 'Step 1'
                    }
                ],
                ingredients: 'test ingredient, salt'
            }

            const response = await agent.post('/api/recipes').send(newRecipe);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Ingredients invalid type, must be array')
        });

        it('should return status 400 when an instruction is missing step', async () => {
            const newRecipe = {
                title: 'test recipe',
                instructions: [
                    { instruction: 'Step 1' }
                ],
                ingredients: [
                    { name: 'test ingredient', quantity: 10, unit: 'lb' }
                ]
            }

            const response = await agent.post('/api/recipes').send(newRecipe);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Missing step in instruction')
        });

        it('should return status 400 when an instruction is missing instruction text', async () => {
            const newRecipe = {
                title: 'test recipe',
                instructions: [
                    { step: 1 }
                ],
                ingredients: [
                    { name: 'test ingredient', quantity: 10, unit: 'lb' }
                ]
            }

            const response = await agent.post('/api/recipes').send(newRecipe);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Missing instruction in instruction')
        });

        it('should return status 400 when an instruction step is not an integer', async () => {
            const newRecipe = {
                title: 'test recipe',
                instructions: [
                    { step: 1.5, instruction: 'Step 1' }
                ],
                ingredients: [
                    { name: 'test ingredient', quantity: 10, unit: 'lb' }
                ]
            }

            const response = await agent.post('/api/recipes').send(newRecipe);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Step must be an integer')
        });

        it('should return status 400 when an ingredient is missing a name', async () => {
            const newRecipe = {
                title: 'test recipe',
                instructions: [
                    { step: 1, instruction: 'Step 1' }
                ],
                ingredients: [
                    { quantity: 10, unit: 'lb' }
                ]
            }

            const response = await agent.post('/api/recipes').send(newRecipe);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Missing name in ingredient')
        });

        it('should return status 400 when an ingredient is missing a quantity', async () => {
            const newRecipe = {
                title: 'test recipe',
                instructions: [
                    { step: 1, instruction: 'Step 1' }
                ],
                ingredients: [
                    { name: 'test ingredient', unit: 'lb' }
                ]
            }

            const response = await agent.post('/api/recipes').send(newRecipe);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Missing quantity in ingredient')
        });

        it('should create a recipe with an ingredient that has no unit', async () => {
            const newRecipe = {
                title: 'test recipe',
                instructions: [
                    { step: 1, instruction: 'Step 1' }
                ],
                ingredients: [
                    { name: 'test ingredient', quantity: 10 }
                ]
            }

            const response = await agent.post('/api/recipes').send(newRecipe);

            expect(response.status).toBe(201);
            expect(response.body).toMatchObject(newRecipe);
            expect(response.body.ingredients[0].unit).toBe('');
        });

        it('should return status 400 when an ingredient quantity is not a number', async () => {
            const newRecipe = {
                title: 'test recipe',
                instructions: [
                    { step: 1, instruction: 'Step 1' }
                ],
                ingredients: [
                    { name: 'test ingredient', quantity: 'a lot', unit: 'lb' }
                ]
            }

            const response = await agent.post('/api/recipes').send(newRecipe);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Quantity must be a number')
        });

        it('should create a recipe with an empty instructions array', async () => {
            const newRecipe = {
                title: 'test recipe',
                instructions: [],
                ingredients: [
                    { name: 'test ingredient', quantity: 10, unit: 'lb' }
                ]
            }

            const response = await agent.post('/api/recipes').send(newRecipe);

            expect(response.status).toBe(201);
            expect(response.body).toMatchObject(newRecipe);
        });

        it('should create a recipe with an empty ingredients array', async () => {
            const newRecipe = {
                title: 'test recipe',
                instructions: [
                    { step: 1, instruction: 'Step 1' }
                ],
                ingredients: []
            }

            const response = await agent.post('/api/recipes').send(newRecipe);

            expect(response.status).toBe(201);
            expect(response.body).toMatchObject(newRecipe);
        });
    })

    describe('PUT /recipes/:id', () => {
        it('should update an existing recipe', async () => {
            const updatedRecipe = {
                title: 'updated title',
                instructions: [
                    { step: 1, instruction: 'Updated step 1' }
                ],
                ingredients: [
                    { name: 'updated ingredient', quantity: 5, unit: 'cup' }
                ]
            }

            const response = await agent.put('/api/recipes/1').send(updatedRecipe);

            expect(response.status).toBe(200);
            expect(response.body).toMatchObject(updatedRecipe);
        });

        it('should return status 400 on missing title, same as POST', async () => {
            const updatedRecipe = {
                instructions: [
                    { step: 1, instruction: 'Step 1' }
                ],
                ingredients: [
                    { name: 'test ingredient', quantity: 1, unit: 'lb' }
                ]
            }

            const response = await agent.put('/api/recipes/1').send(updatedRecipe);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Missing title')
        });

        it('should return status 400 on missing ingredients', async () => {
            const updatedRecipe = {
                title: 'test recipe',
                instructions: [
                    { step: 1, instruction: 'Step 1' }
                ],
            }

            const response = await agent.put('/api/recipes/1').send(updatedRecipe);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Missing ingredients')
        });

        it('should return status 400 on missing instructions', async () => {
            const updatedRecipe = {
                title: 'test recipe',
                ingredients: [
                    { name: 'test ingredient', quantity: 1, unit: 'lb' }
                ]
            }

            const response = await agent.put('/api/recipes/1').send(updatedRecipe);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Missing instructions')
        });

        it('should return status 400 when instructions is not an array', async () => {
            const updatedRecipe = {
                title: 'test recipe',
                instructions: 'Step 1, Step 2',
                ingredients: [
                    { name: 'test ingredient', quantity: 1, unit: 'lb' }
                ]
            }

            const response = await agent.put('/api/recipes/1').send(updatedRecipe);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Instructions invalid type, must be array')
        });

        it('should return status 400 when ingredients is not an array', async () => {
            const updatedRecipe = {
                title: 'test recipe',
                instructions: [
                    { step: 1, instruction: 'Step 1' }
                ],
                ingredients: 'test ingredient, salt'
            }

            const response = await agent.put('/api/recipes/1').send(updatedRecipe);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Ingredients invalid type, must be array')
        });

        it('should return status 400 when an instruction is missing step', async () => {
            const updatedRecipe = {
                title: 'test recipe',
                instructions: [
                    { instruction: 'Step 1' }
                ],
                ingredients: [
                    { name: 'test ingredient', quantity: 1, unit: 'lb' }
                ]
            }

            const response = await agent.put('/api/recipes/1').send(updatedRecipe);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Missing step in instruction')
        });

        it('should return status 400 when an instruction is missing instruction text', async () => {
            const updatedRecipe = {
                title: 'test recipe',
                instructions: [
                    { step: 1 }
                ],
                ingredients: [
                    { name: 'test ingredient', quantity: 1, unit: 'lb' }
                ]
            }

            const response = await agent.put('/api/recipes/1').send(updatedRecipe);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Missing instruction in instruction')
        });

        it('should return status 400 when an instruction step is not an integer', async () => {
            const updatedRecipe = {
                title: 'test recipe',
                instructions: [
                    { step: 1.5, instruction: 'Step 1' }
                ],
                ingredients: [
                    { name: 'test ingredient', quantity: 1, unit: 'lb' }
                ]
            }

            const response = await agent.put('/api/recipes/1').send(updatedRecipe);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Step must be an integer')
        });

        it('should return status 400 when an ingredient is missing a name', async () => {
            const updatedRecipe = {
                title: 'test recipe',
                instructions: [
                    { step: 1, instruction: 'Step 1' }
                ],
                ingredients: [
                    { quantity: 1, unit: 'lb' }
                ]
            }

            const response = await agent.put('/api/recipes/1').send(updatedRecipe);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Missing name in ingredient')
        });

        it('should return status 400 when an ingredient is missing a quantity', async () => {
            const updatedRecipe = {
                title: 'test recipe',
                instructions: [
                    { step: 1, instruction: 'Step 1' }
                ],
                ingredients: [
                    { name: 'test ingredient', unit: 'lb' }
                ]
            }

            const response = await agent.put('/api/recipes/1').send(updatedRecipe);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Missing quantity in ingredient')
        });

        it('should update a recipe with an ingredient that has no unit', async () => {
            const updatedRecipe = {
                title: 'test recipe',
                instructions: [
                    { step: 1, instruction: 'Step 1' }
                ],
                ingredients: [
                    { name: 'test ingredient', quantity: 1 }
                ]
            }

            const response = await agent.put('/api/recipes/1').send(updatedRecipe);

            expect(response.status).toBe(200);
            expect(response.body).toMatchObject(updatedRecipe);
            expect(response.body.ingredients[0].unit).toBe('');
        });

        it('should return status 400 when an ingredient quantity is not a number', async () => {
            const updatedRecipe = {
                title: 'test recipe',
                instructions: [
                    { step: 1, instruction: 'Step 1' }
                ],
                ingredients: [
                    { name: 'test ingredient', quantity: 'a lot', unit: 'lb' }
                ]
            }

            const response = await agent.put('/api/recipes/1').send(updatedRecipe);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Quantity must be a number')
        });

        it('should return status 400 when id is not a valid integer', async () => {
            const updatedRecipe = {
                title: 'test recipe',
                instructions: [
                    { step: 1, instruction: 'Step 1' }
                ],
                ingredients: [
                    { name: 'test ingredient', quantity: 1, unit: 'lb' }
                ]
            }

            const response = await agent.put('/api/recipes/abc').send(updatedRecipe);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Id must be an integer')
        });

        it('should return status 400 when id has trailing non-numeric characters', async () => {
            const updatedRecipe = {
                title: 'test recipe',
                instructions: [
                    { step: 1, instruction: 'Step 1' }
                ],
                ingredients: [
                    { name: 'test ingredient', quantity: 1, unit: 'lb' }
                ]
            }

            const response = await agent.put('/api/recipes/12abc').send(updatedRecipe);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Id must be an integer')
        });

        it('should update a recipe with an empty instructions array', async () => {
            const updatedRecipe = {
                title: 'test recipe',
                instructions: [],
                ingredients: [
                    { name: 'test ingredient', quantity: 1, unit: 'lb' }
                ]
            }

            const response = await agent.put('/api/recipes/1').send(updatedRecipe);

            expect(response.status).toBe(200);
            expect(response.body).toMatchObject(updatedRecipe);
        });

        it('should update a recipe with an empty ingredients array', async () => {
            const updatedRecipe = {
                title: 'test recipe',
                instructions: [
                    { step: 1, instruction: 'Step 1' }
                ],
                ingredients: []
            }

            const response = await agent.put('/api/recipes/1').send(updatedRecipe);

            expect(response.status).toBe(200);
            expect(response.body).toMatchObject(updatedRecipe);
        });
    })

    describe('DELETE /recipes/:id', () => {
        it('should delete an existing recipe', async () => {
            const response = await agent.delete('/api/recipes/1');

            expect(response.status).toBe(204);

            const getResponse = await agent.get('/api/recipes');
            expect(getResponse.body.find(recipe => recipe.id === 1)).toBeUndefined();
        });

        it('should unassign the recipe from the week plan when deleted', async () => {
            const response = await agent.delete('/api/recipes/1');

            expect(response.status).toBe(204);

            const weekResponse = await agent.get('/api/week');

            const monday = weekResponse.body.find(row => row.day === 'Monday');
            const thursday = weekResponse.body.find(row => row.day === 'Thursday');

            expect(monday.meal).toBeNull();
            expect(thursday.meal).toBeNull();
        });

        it('should return status 400 when id is not a valid integer', async () => {
            const response = await agent.delete('/api/recipes/abc');

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Id must be an integer')
        });
    })

})