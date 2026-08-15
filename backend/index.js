const express = require('express');
require('dotenv').config();
const {Pool} = require('pg');
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const app = express();
const cors = require('cors');
app.use(cors());

app.get('/api/week', (req, res) => {
    pool.query('SELECT * FROM recipes ORDER BY id')
    .then(result => {
        res.json(result.rows);
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({error: 'Internal server error'});
    });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});