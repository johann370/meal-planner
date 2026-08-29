function requireAuth(req, res, next) {
    if (process.env.LOCAL_DEV_BYPASS_AUTH) {
        return next();
    }
    if (req.session.authenticated) {
        next();
    } else {
        res.status(401).json({ error: 'Not authenticated' });
    }
}

module.exports = { requireAuth }