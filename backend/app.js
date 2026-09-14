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
const errorHandler = require('./middleware/errorHandler.js')

const app = express();

app.set('trust proxy', 1);

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: process.env.PORT ? { sameSite: 'none', secure: true } : {},
}));
app.use('/api', authRoutes);
app.use(requireAuth);
app.use('/api', groceryListRoutes);
app.use('/api', recipesRoutes);
app.use('/api', weekRoutes);

app.use(errorHandler);

app.prisma = prisma;
module.exports = app;
