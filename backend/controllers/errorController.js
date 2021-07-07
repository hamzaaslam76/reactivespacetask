const AppError = require('../utils/appError');
handleCastErrorDb = (err) => {
    
    const message = `Invalid ${err.path}:${err.value}. `;
    return (new AppError(message, 404));
};

handleDuplicateField = (err) => {
    const message = `Duplicate Filed value/ ${err.keyValue.name} /. Please use another value`;
    return (new AppError(message, 400));
};
handleValidationErrorDb = (err) => {
    const allerror = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data ${allerror.join('. ')}`;
    return (new AppError(message, 400));
}
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack:err.stack
    });
}

const sendErrorProduction = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }
    else {
        console.log("Error", err);
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong'
        });
    }
}

const handelJwtError = () => {
   return new AppError('Invalid token .Please log in again', 401);
}
const handleJwtExpiredTokenError = () => {
    return new AppError('Your token has expired.Please log in again', 401);
};
module.exports = (err, req, res, next) => {
    console.log(err);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV === 'development')
    {
        sendErrorDev(err, res);
    }
    else if (process.env.NODE_ENV === 'production')
    {
        
        let error = { ...err };
        if (error.kind === 'ObjectId') error = handleCastErrorDb(error);
        if (error.code === 11000) error = handleDuplicateField(error);
        if (error._message === 'Validation failed') error = handleValidationErrorDb(error);
        if (error.name === 'JsonWebTokenError') error = handelJwtError();
        if (error.name === 'TokenExpiredError') error = handleJwtExpiredTokenError(); 
        sendErrorProduction(error, res);
        }
   
};