const crypto = require('crypto');
const { AppError } = require('../shared/http/errors');
const { parseCookies } = require('../utils/cookies');
const { ACCESS_COOKIE_NAME, REFRESH_COOKIE_NAME, CSRF_COOKIE_NAME } = require('../utils/authCookies');

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

const useCsrfForPath = (path) =>
  path.startsWith('/api/v1/')
  || path === '/public/api/v1/auth/refresh'
  || path === '/public/api/v1/auth/logout';

const safeEqual = (a, b) => {
  if (!a || !b) return false;
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
};

module.exports = (req, res, next) => {
  try {
    if (SAFE_METHODS.has(req.method)) return next();
    if (!useCsrfForPath(req.path)) return next();

    const cookies = parseCookies(req.headers.cookie || '');
    const hasSessionCookie = Boolean(cookies[ACCESS_COOKIE_NAME] || cookies[REFRESH_COOKIE_NAME]);
    if (!hasSessionCookie) return next();

    const csrfCookie = cookies[CSRF_COOKIE_NAME];
    const csrfHeader = req.headers['x-csrf-token'];
    if (!safeEqual(csrfCookie, csrfHeader)) {
      throw new AppError('Invalid CSRF token', 403);
    }

    return next();
  } catch (error) {
    return next(error);
  }
};
