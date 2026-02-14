const jwt = require('jsonwebtoken');
const { Admin, User } = require('../models');
const { getString } = require('../config/runtime');
const { AppError } = require('../shared/http/errors');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new AppError('Authorization header is required', 401);
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || !/^Bearer$/i.test(parts[0])) {
      throw new AppError('Format is Authorization: Bearer [token]', 401);
    }

    const token = parts[1];
    const decodedToken = jwt.verify(token, getString('JWT_SECRET', ''));

    if (!decodedToken || !decodedToken.secretId) {
      throw new AppError('Token mismatch', 401);
    }

    let userObj = null;

    if (decodedToken.loginType === 'admin') {
      if (req.path.startsWith('/user')) {
        throw new AppError('Admins are not authorized to access user APIs', 403);
      }
      userObj = await Admin.findOne({ where: { secretId: decodedToken.secretId, isDeleted: false } });
      if (userObj) userObj.loginUserType = 'admin';
    }

    if (decodedToken.loginType === 'user') {
      if (req.path.startsWith('/admin')) {
        throw new AppError('Users are not authorized to access admin APIs', 403);
      }
      userObj = await User.findOne({ where: { secretId: decodedToken.secretId, isDeleted: false } });
      if (userObj) userObj.loginUserType = 'user';
    }

    if (!userObj) {
      throw new AppError('Token mismatch', 401);
    }

    req.token = decodedToken;
    req.loggedInUser = userObj;
    return next();
  } catch (error) {
    return next(error);
  }
};
