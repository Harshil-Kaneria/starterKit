const express = require('express');
const { validate } = require('express-validation');
const controller = require('./user.controller');
const validator = require('./user.validator');

const publicRouter = express.Router();
const protectedRouter = express.Router();

publicRouter.post('/user/login-register', validate(validator.userLoginRegisterValidationSchema), controller.loginRegister);
publicRouter.post('/user/verify-otp', validate(validator.userVerifyOtpValidationSchema), controller.verifyOtp);
publicRouter.post('/user/resend-otp', validate(validator.userResendOtpValidationSchema), controller.resendOtp);
publicRouter.post('/user/delete-user', validate(validator.deleteUserEmailValidationSchema), controller.deleteUserEmail);
publicRouter.post('/user/delete-user-verify-otp', validate(validator.verifyOtpDeleteUserEmailValidationSchema), controller.verifyOtpDeleteUserEmail);

protectedRouter.post('/user/update-profile', validate(validator.userProfileValidationSchema), controller.updateUserProfile);
protectedRouter.post('/user/update-profile-photo', validate(validator.userUploadProfilePictureValidationSchema), controller.uploadProfilePicture);
protectedRouter.post('/user/update-fcm-timezone', validate(validator.updateFcmTimezoneValidationSchema), controller.updateFcmTimezone);
protectedRouter.get('/user/details', controller.getUserData);

module.exports = {
  publicRouter,
  protectedRouter
};
