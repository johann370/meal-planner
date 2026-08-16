const express = require('express');
require('dotenv').config();
const {Pool} = require('pg');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const app = express();
const cors = require('cors');
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
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

app.get('/api/recipes', (req, res) => {
    pool.query('SELECT * FROM recipes ORDER BY id')
    .then(result => {
        res.json(result.rows);
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({error: 'Internal server error'});
    });
});

app.post('/api/recipes', (req, res) => {
    const {title, ingredients, instructions } = req.body;
    pool.query('INSERT INTO recipes (title, ingredients, instructions) VALUES ($1, $2, $3) RETURNING *', [title, ingredients, instructions])
    .then(result => res.json(result.rows[0]))
    .catch(err => res.status(500).json({error: err.message}));
});

app.put('/api/recipes/:id', (req, res) => {
    const {id} = req.params;
    const {title, ingredients, instructions } = req.body;
    pool.query('UPDATE recipes SET title = $1, ingredients = $2, instructions = $3 WHERE id = $4 RETURNING *', [title, ingredients, instructions, id])
    .then(result => res.json(result.rows[0]))
    .catch(err => res.status(500).json({error: err.message}));
});

app.delete('/api/recipes/:id', (req, res) => {
    const {id} = req.params;
    pool.query('DELETE FROM recipes WHERE id = $1 RETURNING *', [id])
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

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});