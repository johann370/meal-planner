function requireAuth(req, res, next) {
    if (!process.env.DATABASE_URL && process.env.NODE_ENV !== 'test') {
        return next();
    }
    if (req.session.authenticated) {
        next();
    } else {
        res.status(401).json({error: 'Not authenticated'});
    }
}

module.exports = {requireAuth}