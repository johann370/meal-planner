const express = require('express');
const bcrypt = require('bcryptjs');
const AppError = require('../lib/AppError.js')

module.exports = () => {
    const router = express.Router();

    router.post('/login', async (req, res) => {
        const { password } = req.body;

        const isMatch = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH)
        if (isMatch) {
            req.session.authenticated = true;
            res.json({ success: true });
        } else {
            throw new AppError('Invalid password', 401);
        }

    });

    return router;
};
