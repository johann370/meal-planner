const { requireAuth } = require('../../middleware/requireAuth');
const AppError = require('../../lib/AppError');

describe('requireAuth', () => {
    afterEach(() => {
        delete process.env.LOCAL_DEV_BYPASS_AUTH;
    });

    it('authenticated session — calls next()', () => {
        const req = { session: { authenticated: true } };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        }

        const next = jest.fn();

        requireAuth(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    it('unauthenticated session — throws AppError "Not authenticated", next() not called', () => {
        const req = { session: { authenticated: false } };
        const next = jest.fn();

        expect(() => requireAuth(req, {}, next)).toThrow(AppError);
        expect(() => requireAuth(req, {}, next)).toThrow('Not authenticated');
        expect(next).not.toHaveBeenCalled();
    });

    it('LOCAL_DEV_BYPASS_AUTH set — calls next() even without an authenticated session', () => {
        process.env.LOCAL_DEV_BYPASS_AUTH = 'true';

        const req = { session: { authenticated: false } };
        const next = jest.fn();

        requireAuth(req, {}, next);

        expect(next).toHaveBeenCalled();
    });
});
