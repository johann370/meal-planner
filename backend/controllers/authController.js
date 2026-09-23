const bcrypt = require('bcryptjs');
const AppError = require('../lib/AppError.js')

const login = async (req, res) => {
    const { password } = req.body;

    if (!password) {
        throw new AppError('Invalid password', 401);
    }

    const isMatch = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH)
    if (isMatch) {
        req.session.authenticated = true;
        res.json({ success: true });
    } else {
        throw new AppError('Invalid password', 401);
    }
}

module.exports = { login };