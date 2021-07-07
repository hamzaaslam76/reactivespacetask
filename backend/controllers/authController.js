const User = require('./../models/userModel')
const catchAsync = require('./../utils/catchAsync')
const jwt = require('jsonwebtoken')
const appError = require('./../utils/appError')
const crypto = require('crypto');
const { promisify } = require('util')
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn:process.env.JWT_EXPIRES_IN
    })
}

const sendResponse = (user, statusCode, res) => {
    const Token = createToken(user._id);
    res.status(statusCode).json({
        status: 'success',
        Token,
        data: {
            user
        }
    });
    
}

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create(req.body);
    sendResponse(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        next(new appError('email and password not be a null'), 400);    
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user || ! await user.correctPassword(password, user.password)) {
        return next(new appError('Incorrect email or Password',401));
    }
    sendResponse(user, 200, res);
});


exports.protect = catchAsync(async (req, res, next) => {
    let token
    // Getting Token and check of it ,s there 

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
        return next(new appError('you are not logged in! Please log into get access',401));
    }
    // verified  token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new appError('The user belonging to this token does not longer exist',401));
    }
    // check if user changed the password after the token was issued

    if (currentUser.changedPasswordAfterGetToken(decoded.iat))
    {
        return next(new appError('user recently  changed password!please log in again',401));
    }
    req.user = currentUser
    next();
});

exports.restrictTo = (...rules) => {
    return (req, re, next) => {
        if (!rules.includes(req.user.rules)) {
            return next(new appError('You do not have permission to perform this action', 403));
        }
        next();
    };
};

exports.forgetPassword = catchAsync(async(req, res, next) =>{
   
    const user = await User.findOne({ email: req.body.email });
    if(!user) {
        return next(new appError('There is no user with email address', 404));
    }
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    //Send it to the user email

});

exports.resetPassword = catchAsync(async (req, res, next) => {
    const hashToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpire: { $gt: Date.now() } });
    if (!user) {
        return next(new appError('Token is invalid or has expired ', 400));
    }
    user.password = req.body.password;
    user.confirmPassword = req.body.confiramPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    await user.save();
    sendResponse(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne( req.body.id).select('+password');
    // check posted password is correct
    if (! await user.correctPassword(req.body.passwordCurrent, user.password)){
        return next(new appError("Your current password is wrong.", 401));
    }
    // if so update password
  
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    await user.save();
    
    // log user in send jwt
    sendResponse(user, 200, res);
})