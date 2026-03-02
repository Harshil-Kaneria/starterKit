const { UniqueOTP, uuid } = require('unique-string-generator');
const { issueAccessToken } = require('../../utils/jwtToken');
const { verifyPassword, hashPassword } = require('../../utils/passwordBcrypt');
const { sendMail } = require('../../helpers');
const { AppError } = require('../../shared/http/errors');
const repo = require('./user.repository');
const otpTemplate = require('../../views/otpTemplate');
const otpTemplateFr = require('../../views/otpTemplateFr');
const otpTemplateDeleteUser = require('../../views/otpTemplateDeleteUser');
const otpTemplateDeleteUserFr = require('../../views/otpTemplateDeleteUserFr');

const sendOtpMail = async (toEmail, otp, language, isDeleteFlow = false) => {
  const data = { otp };
  const useFrench = language === 'fr';

  let subject;
  let html;

  if (isDeleteFlow) {
    subject = useFrench ? 'Votre OTP pour supprimer le compte' : 'Your OTP for Delete account';
    html = useFrench ? otpTemplateDeleteUserFr(data) : otpTemplateDeleteUser(data);
  } else {
    subject = useFrench ? 'Votre OTP pour la connexion' : 'Your OTP for Login';
    html = useFrench ? otpTemplateFr(data) : otpTemplate(data);
  }

  await sendMail(toEmail, subject, html);
};

const loginRegister = async ({ email, language }) => {
  const [user] = await repo.findOrCreateUserByEmail(email, { email, secretId: uuid.v4() });

  const otp = UniqueOTP(4);
  await sendOtpMail(email, otp, language || user.language, false);

  user.otp = await hashPassword(String(otp));
  await user.save();

  return { secretId: user.secretId };
};

const verifyOtp = async ({ secretId, otp }) => {
  const user = await repo.findUserBySecretId(secretId);
  if (!user) {
    throw new AppError('User not found!', 404);
  }

  const isOtpValid = await verifyPassword(otp, user.otp);
  if (!isOtpValid) {
    throw new AppError('Invalid OTP!', 401);
  }

  user.otp = null;
  await user.save();

  const token = issueAccessToken({
    secretId: user.secretId,
    loginType: 'user'
  });

  return {
    secretId: user.secretId,
    isProfileCompleted: user.isProfileCompleted,
    token
  };
};

const resendOtp = async ({ secretId, language }) => {
  const user = await repo.findUserBySecretId(secretId);
  if (!user) {
    throw new AppError('User not found!', 404);
  }

  const otp = UniqueOTP(4);
  await sendOtpMail(user.email, otp, language || user.language, false);

  user.otp = await hashPassword(String(otp));
  await user.save();

  return { secretId: user.secretId };
};

const updateProfile = async (userId, updateFields) => {
  const user = await repo.findUserById(userId);
  if (!user) {
    throw new AppError('User not found!', 404);
  }

  Object.keys(updateFields).forEach((field) => {
    if (updateFields[field] !== undefined && field !== 'secretId' && field !== 'id') {
      user[field] = updateFields[field];
    }
  });

  await user.save();
  return { user };
};

const updateProfilePhoto = async (userId, profileImage) => {
  await repo.updateUserById(userId, { profileImage });
  return { profileImage };
};

const updateFcmTimezone = async (userId, fcmToken, timezone) => {
  await repo.updateUserById(userId, { fcmToken, timezone });
  await repo.clearDuplicateFcmTokens(userId, fcmToken);
  return { fcmToken, timezone };
};

const getUserDetails = async (user) => ({ data: user });

const deleteUserEmail = async ({ email }) => {
  const user = await repo.findUserByEmail(email);
  if (!user) {
    throw new AppError('User not found!', 404);
  }

  const otp = UniqueOTP(4);
  await sendOtpMail(email, otp, user.language, true);

  user.otp = await hashPassword(String(otp));
  await user.save();

  return { secretId: user.secretId };
};

const verifyOtpDeleteUserEmail = async ({ secretId, otp }) => {
  const user = await repo.findUserBySecretId(secretId);
  if (!user) {
    throw new AppError('User not found!', 404);
  }

  const isOtpValid = await verifyPassword(otp, user.otp);
  if (!isOtpValid) {
    throw new AppError('Invalid OTP!', 401);
  }

  user.otp = null;
  user.isDeleted = true;
  await user.save();
};

module.exports = {
  loginRegister,
  verifyOtp,
  resendOtp,
  updateProfile,
  updateProfilePhoto,
  updateFcmTimezone,
  getUserDetails,
  deleteUserEmail,
  verifyOtpDeleteUserEmail
};
