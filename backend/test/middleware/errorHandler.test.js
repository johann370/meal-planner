const errorHandler = require('../../middleware/errorHandler');
const AppError = require('../../lib/AppError');
const { Prisma } = require('../../lib/generated/prisma');

describe('errorHandler', () => {
    it('AppError instance — responds with its own statusCode and message, status: fail', () => {
        const err = new AppError('Test Error', 400);

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        }

        errorHandler(err, {}, res, {});

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: err.message
        })

    });

    it('Prisma P2025 error — converted to AppError 404, handled the same way', () => {
        const err = new Prisma.PrismaClientKnownRequestError('Record not found', { code: 'P2025', clientVersion: '7.10.0' });

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        }

        errorHandler(err, {}, res, {});

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Record not found'
        })
    });

    it('Prisma P2003 error — converted to AppError 400, handled the same way', () => {
        const err = new Prisma.PrismaClientKnownRequestError('Foreign key constraint violated', { code: 'P2003', clientVersion: '7.10.0' });

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        }

        errorHandler(err, {}, res, {});

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Referenced record not found'
        })
    });

    it('unknown/generic error — 500, status: error, message "Internal Server Error"', () => {
        jest.spyOn(console, 'error').mockImplementation(() => { })

        const err = new Error('Test Error');

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        }

        errorHandler(err, {}, res, {});

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'error',
            message: 'Internal Server Error'
        })

    });
});
