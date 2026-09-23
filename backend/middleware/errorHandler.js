const AppError = require('../lib/AppError.js');
const { Prisma } = require('../lib/generated/prisma');

const errorHandler = (err, req, res, next) => {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case 'P2025':
                err = new AppError("Record not found", 404);
                break;
            case 'P2003':
                err = new AppError('Referenced record not found', 400);
                break;
        }
    }

    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            status: 'fail',
            message: err.message
        })
    } else {
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        })
    }

};

module.exports = errorHandler;