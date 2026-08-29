const express = require('express');
if(process.env.NODE_ENV === 'test') {
    require('dotenv').config({path: '.env.test'});
}else {
    require('dotenv').config();
}
const {Pool} = require('pg');
const bcrypt = require('bcryptjs');
const session = require('express-session');
// TODO(you): build a `poolConfig` variable — if process.env.DATABASE_URL is
// set (Render), use { connectionString: process.env.DATABASE_URL };
// otherwise (local dev/test) use the same discrete fields as below.

let poolConfig;

if(process.env.DATABASE_URL) {
    poolConfig = {connectionString: process.env.DATABASE_URL};
}else {
    poolConfig = {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    };
}
const pool = new Pool(poolConfig);

const app = express();
const cors = require('cors');
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));

app.post('/api/login', (req, res) => {
    const {password} = req.body;
    bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH)
    .then(isMatch => {
        if (isMatch) {
            req.session.authenticated = true;
            res.json({success: true});
        } else {
            res.status(401).json({error: 'Invalid password'});
        }
    })
});

function requireAuth(req, res, next) {
    // TODO(you): skip the check when running local dev — no DATABASE_URL
    // (same signal poolConfig uses for "not on Render") AND not under Jest
    // (NODE_ENV !== 'test', so the real 401 test still exercises real auth).
    if (!process.env.DATABASE_URL && process.env.NODE_ENV !== 'test') {
        return next();
    }
    if (req.session.authenticated) {
        next();
    } else {
        res.status(401).json({error: 'Not authenticated'});
    }
}

app.use(requireAuth);

app.get('/api/week', (req, res) => {
    pool.query('SELECT week_meal.day, recipes.title AS meal FROM week_meal JOIN recipes ON recipe_id = recipes.id ORDER BY week_meal.id')
    .then(result => {
        res.json(result.rows);
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({error: 'Internal server error'});
    });
});

app.get('/api/grocery-list', (req, res) => {
    pool.query('SELECT ingredients.name, ingredients.unit, SUM(ingredients.quantity) AS quantity FROM week_meal JOIN recipes ON week_meal.recipe_id = recipes.id JOIN ingredients ON ingredients.recipe_id = recipes.id GROUP BY ingredients.name, ingredients.unit ORDER BY ingredients.name')
    .then(result => {
        res.json(result.rows);
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({error: 'Internal server error'});
    });
});

app.get('/api/recipes', (req, res) => {
    pool.query('SELECT * FROM recipes ORDER BY id')
    .then(recipesResult => {
        pool.query('SELECT * FROM ingredients ORDER BY id')
        .then(ingredientsResult => {
            const recipes = recipesResult.rows.map(recipe => ({
                ...recipe,
                ingredients: ingredientsResult.rows.filter(ingredient => ingredient.recipe_id === recipe.id)
            }));
            res.json(recipes);
        });
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({error: 'Internal server error'});
    });
});

const cheerio = require('cheerio');

function stripTrailingParenthetical(str) {
    return str.replace(/\s*\(.*\)\s*$/, '');
}

const fractionMap = {
    '¼': 0.25, '1/4': 0.25, '&frac14;': 0.25,
    '½': 0.5, '1/2': 0.5, '&frac12;': 0.5,
    '¾': 0.75, '3/4': 0.75, '&frac34;': 0.75,
    '⅛': 0.125, '1/8': 0.125, '&frac18;': 0.125,
};

function parseIngredient(raw) {
    const cleaned = stripTrailingParenthetical(raw);
    const [quantityRaw, unit, ...nameParts] = cleaned.split(/\s+/);
    const quantity = fractionMap[quantityRaw] ? fractionMap[quantityRaw] : parseFloat(quantityRaw);
    const name = nameParts.join(' ');
    return { quantity, unit, name };
}

app.post('/api/recipes/import-from-url', (req, res) => {
    const { url } = req.body;
    fetch(url)
    .then(response => response.text())
    .then(html => {
        const $ = cheerio.load(html);
        const jsonLdText = $('script[type="application/ld+json"]').first().html()
        if (!jsonLdText) {
            throw new Error('Could not get recipe data');
        }
        const jsonLd = JSON.parse(jsonLdText);
        const recipeData = (jsonLd['@graph'] || []).find(item => item['@type'] === 'Recipe');
        if(!recipeData) {
            throw new Error('Could not get recipe data');
        }
        const title = recipeData.name;
        const ingredients = recipeData.recipeIngredient.map(ingredient => parseIngredient(ingredient));
        const instructions = recipeData.recipeInstructions.map(instruction => instruction.text).join('\n');
        return createRecipe({title, ingredients, instructions});
    })
    .then(newRecipe => res.status(201).json(newRecipe))
    .catch(err => res.status(500).json({error: err.message}));
});

function createRecipe({title, ingredients, instructions}) {
    return pool.query('INSERT INTO recipes (title, instructions) VALUES ($1, $2) RETURNING *', [title, instructions])
    .then(recipeResult => {
        const newRecipe = recipeResult.rows[0];
        const insertPromises = ingredients.map(ingredient =>  pool.query('INSERT INTO ingredients (name, quantity, unit, recipe_id) VALUES ($1, $2, $3, $4) RETURNING *', [ingredient.name, ingredient.quantity, ingredient.unit, newRecipe.id]));

        return Promise.all(insertPromises)
        .then(ingredientsResult => {
            newRecipe.ingredients = ingredientsResult.map(ingredient => ingredient.rows[0]);
            return newRecipe;
        });
    });
}

app.post('/api/recipes', (req, res) => {
    createRecipe(req.body)
    .then(newRecipe => res.status(201).json(newRecipe))
    .catch(err => res.status(500).json({error: err.message}));
});

app.put('/api/recipes/:id', (req, res) => {
    const {id} = req.params;
    const {title, ingredients, instructions } = req.body;
    let updatedRecipe;
    pool.query('UPDATE recipes SET title = $1, instructions = $2 WHERE id = $3 RETURNING *', [title, instructions, id])
    .then((result) => {
        updatedRecipe = result.rows[0];
        return pool.query('DELETE FROM ingredients WHERE recipe_id = $1', [id])})
    .then(() => {
        const insertPromises = ingredients.map(ingredient => pool.query('INSERT INTO ingredients (name, quantity, unit, recipe_id) VALUES ($1, $2, $3, $4) RETURNING *', [ingredient.name, ingredient.quantity, ingredient.unit, id]));
        return Promise.all(insertPromises);
    })
    .then(ingredientsResult => {
        updatedRecipe.ingredients = ingredientsResult.map(ingredient => ingredient.rows[0]);
        res.json(updatedRecipe);
    }
    )
    .catch(err => res.status(500).json({error: err.message}));
});

app.delete('/api/recipes/:id', (req, res) => {
    const {id} = req.params;
    pool.query('DELETE FROM ingredients WHERE recipe_id = $1', [id])
    .then(() => {
        return pool.query('DELETE FROM recipes WHERE id = $1 RETURNING *', [id]);
    })
    .then(() => res.status(204).send())
    .catch(err => res.status(500).json({error: err.message}));
});

app.put('/api/week/:day', (req, res) => {
    const {day} = req.params;
    const {recipeId} = req.body;
    pool.query('UPDATE week_meal SET recipe_id = $1 WHERE day = $2 RETURNING *', [recipeId, day])
    .then(result => res.json(result.rows[0]))
    .catch(err => res.status(500).json({error: err.message}));
})

app.pool = pool;
module.exports = app;
