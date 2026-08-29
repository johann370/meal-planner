const express = require('express');
if (process.env.NODE_ENV === 'test') {
    require('dotenv').config({ path: '.env.test' });
} else {
    require('dotenv').config();
}
const cors = require('cors');
const session = require('express-session');
const prisma = require('./lib/prisma.js');
const { requireAuth } = require('./middleware/requireAuth.js');
const authRoutes = require('./routes/auth');
const groceryListRoutes = require('./routes/groceryList');
const recipesRoutes = require('./routes/recipes');
const weekRoutes = require('./routes/week');

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use('/api', authRoutes());
app.use(requireAuth);
app.use('/api', groceryListRoutes(prisma));
app.use('/api', recipesRoutes(prisma));
app.use('/api', weekRoutes(prisma));

app.prisma = prisma;
module.exports = app;
