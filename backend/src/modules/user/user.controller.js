const { StatusCodes } = require('http-status-codes');
const service = require('./user.service');
const { sendSuccess } = require('../../shared/http/response');

const loginRegister = async (req, res, next) => {
  try {
    const data = await service.loginRegister(req.body);
    return sendSuccess(req, res, StatusCodes.OK, 'OTP send successfully !', data);
  } catch (error) {
    return next(error);
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    const data = await service.verifyOtp(req.body);
    return sendSuccess(req, res, StatusCodes.OK, 'OTP verified successfully!', data);
  } catch (error) {
    return next(error);
  }
};

const resendOtp = async (req, res, next) => {
  try {
    const data = await service.resendOtp(req.body);
    return sendSuccess(req, res, StatusCodes.OK, 'OTP send successfully !', data);
  } catch (error) {
    return next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const data = await service.updateProfile(req.loggedInUser.id, req.body);
    return sendSuccess(req, res, StatusCodes.OK, 'Profile updated successfully!', data);
  } catch (error) {
    return next(error);
  }
};

const uploadProfilePicture = async (req, res, next) => {
  try {
    const data = await service.updateProfilePhoto(req.loggedInUser.id, req.body.profileImage);
    return sendSuccess(req, res, StatusCodes.OK, 'Profile picture updated successfully', data);
  } catch (error) {
    return next(error);
  }
};

const updateFcmTimezone = async (req, res, next) => {
  try {
    const data = await service.updateFcmTimezone(req.loggedInUser.id, req.body.fcmToken, req.body.timezone);
    return sendSuccess(req, res, StatusCodes.OK, 'Data updated successfully', { data });
  } catch (error) {
    return next(error);
  }
};

const getUserData = async (req, res, next) => {
  try {
    const data = await service.getUserDetails(req.loggedInUser);
    return sendSuccess(req, res, StatusCodes.OK, 'Data fetched successfully', data);
  } catch (error) {
    return next(error);
  }
};

const deleteUserEmail = async (req, res, next) => {
  try {
    const data = await service.deleteUserEmail(req.body);
    return sendSuccess(req, res, StatusCodes.OK, 'OTP send successfully !', data);
  } catch (error) {
    return next(error);
  }
};

const verifyOtpDeleteUserEmail = async (req, res, next) => {
  try {
    await service.verifyOtpDeleteUserEmail(req.body);
    return sendSuccess(req, res, StatusCodes.OK, 'User account deleted successfully!');
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  loginRegister,
  verifyOtp,
  resendOtp,
  updateUserProfile,
  uploadProfilePicture,
  updateFcmTimezone,
  getUserData,
  deleteUserEmail,
  verifyOtpDeleteUserEmail
};
