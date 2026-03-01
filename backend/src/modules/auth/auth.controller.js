const { StatusCodes } = require('http-status-codes');
const { sendSuccess } = require('../../shared/http/response');
const { REFRESH_COOKIE_NAME, setAuthCookies, setCsrfCookie, clearAuthCookies } = require('../../utils/authCookies');
const { parseCookies } = require('../../utils/cookies');
const service = require('./auth.service');

const refreshSession = async (req, res, next) => {
  try {
    const cookies = parseCookies(req.headers.cookie || '');
    const refreshToken = cookies[REFRESH_COOKIE_NAME];
    const data = await service.refreshSession({ refreshToken, req });
    setAuthCookies(res, data.accessToken, data.refreshToken);
    setCsrfCookie(res);
    return sendSuccess(req, res, StatusCodes.OK, 'Session refreshed successfully');
  } catch (error) {
    return next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const cookies = parseCookies(req.headers.cookie || '');
    const refreshToken = cookies[REFRESH_COOKIE_NAME];
    await service.logoutSession({ refreshToken, req });
    clearAuthCookies(res);
    return sendSuccess(req, res, StatusCodes.OK, 'Logged out successfully');
  } catch (error) {
    return next(error);
  }
};

const logoutAll = async (req, res, next) => {
  try {
    await service.logoutAllSessions({
      secretId: req.loggedInUser?.secretId,
      loginType: req.token?.loginType,
      req
    });
    clearAuthCookies(res);
    return sendSuccess(req, res, StatusCodes.OK, 'Logged out from all devices successfully');
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  refreshSession,
  logout,
  logoutAll
};
