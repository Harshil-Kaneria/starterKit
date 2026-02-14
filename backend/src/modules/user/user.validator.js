const Joi = require('joi');

const userLoginRegisterValidationSchema = {
  body: Joi.object({
    email: Joi.string().required(),
    language: Joi.string().optional()
  })
};

const userVerifyOtpValidationSchema = {
  body: Joi.object({
    secretId: Joi.string().required(),
    otp: Joi.string().required()
  })
};

const userResendOtpValidationSchema = {
  body: Joi.object({
    secretId: Joi.string().required(),
    language: Joi.string().optional()
  })
};

const userUploadProfilePictureValidationSchema = {
  body: Joi.object({
    profileImage: Joi.string().required()
  })
};

const userProfileValidationSchema = {
  body: Joi.object({
    countryCode: Joi.string().optional(),
    phoneNumber: Joi.string().optional(),
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    language: Joi.string().optional(),
    country: Joi.string().optional(),
    gender: Joi.string().optional(),
    dob: Joi.date().optional(),
    workoutPerWeek: Joi.string().optional(),
    otherApp: Joi.boolean().optional(),
    isImperial: Joi.boolean().optional(),
    height: Joi.string().optional(),
    heightUnit: Joi.string().optional(),
    heightSub: Joi.string().optional(),
    heightSubUnit: Joi.string().optional(),
    weight: Joi.string().optional(),
    weightUnit: Joi.string().optional(),
    goal: Joi.string().optional(),
    goalTarget: Joi.string().optional(),
    goalSpeed: Joi.string().optional(),
    stoppingGoal: Joi.string().optional(),
    diet: Joi.string().optional(),
    accomplish: Joi.string().optional(),
    profileImage: Joi.string().uri().optional(),
    isProfileCompleted: Joi.boolean().optional(),
    isNotificationOn: Joi.boolean().optional(),
    isDeleted: Joi.boolean().optional()
  })
};

const updateFcmTimezoneValidationSchema = {
  body: Joi.object({
    fcmToken: Joi.string().required(),
    timezone: Joi.string().optional()
  })
};

const deleteUserEmailValidationSchema = {
  body: Joi.object({
    email: Joi.string().required()
  })
};

const verifyOtpDeleteUserEmailValidationSchema = {
  body: Joi.object({
    secretId: Joi.string().required(),
    otp: Joi.string().required()
  })
};

module.exports = {
  userLoginRegisterValidationSchema,
  userVerifyOtpValidationSchema,
  userResendOtpValidationSchema,
  userUploadProfilePictureValidationSchema,
  userProfileValidationSchema,
  updateFcmTimezoneValidationSchema,
  deleteUserEmailValidationSchema,
  verifyOtpDeleteUserEmailValidationSchema
};
