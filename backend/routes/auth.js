const express = require('express');
const bcrypt = require('bcryptjs');

module.exports = () => {
    const router = express.Router();

    router.post('/login', async (req, res) => {
        const { password } = req.body;
        try {
            const isMatch = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH)
            if (isMatch) {
                req.session.authenticated = true;
                res.json({ success: true });
            } else {
                res.status(401).json({ error: 'Invalid password' });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    return router;
};
