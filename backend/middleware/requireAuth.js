const AppError = require('../lib/AppError');

function requireAuth(req, res, next) {
    if (process.env.LOCAL_DEV_BYPASS_AUTH) {
        return next();
    }
    if (req.session.authenticated) {
        next();
    } else {
        throw new AppError('Not authenticated', 401);
    }
}

module.exports = { requireAuth }