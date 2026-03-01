const { getBoolean, getString } = require('../config/runtime');
const crypto = require('crypto');

const ACCESS_COOKIE_NAME = 'access_token';
const REFRESH_COOKIE_NAME = 'refresh_token';
const CSRF_COOKIE_NAME = 'csrf_token';

const getCookieDomain = () => {
  const value = getString('AUTH_COOKIE_DOMAIN', '').trim();
  return value || undefined;
};

const getSameSite = () => {
  const sameSite = getString('AUTH_COOKIE_SAMESITE', 'lax').toLowerCase();
  if (sameSite === 'none' || sameSite === 'strict' || sameSite === 'lax') {
    return sameSite;
  }
  return 'lax';
};

const getBaseCookieOptions = () => {
  const secure = getBoolean('AUTH_COOKIE_SECURE', getString('NODE_ENV', 'development') === 'production');

  return {
    httpOnly: true,
    secure,
    sameSite: getSameSite(),
    domain: getCookieDomain(),
    path: '/'
  };
};

const setAuthCookies = (res, accessToken, refreshToken) => {
  const accessTokenMaxAgeMs = 15 * 60 * 1000;
  const refreshTokenMaxAgeMs = 30 * 24 * 60 * 60 * 1000;
  const baseOptions = getBaseCookieOptions();

  res.cookie(ACCESS_COOKIE_NAME, accessToken, {
    ...baseOptions,
    maxAge: accessTokenMaxAgeMs
  });

  res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
    ...baseOptions,
    maxAge: refreshTokenMaxAgeMs
  });
};

const issueCsrfToken = () => crypto.randomBytes(32).toString('base64url');

const setCsrfCookie = (res, csrfToken = issueCsrfToken()) => {
  const baseOptions = getBaseCookieOptions();
  res.cookie(CSRF_COOKIE_NAME, csrfToken, {
    ...baseOptions,
    httpOnly: false,
    maxAge: 30 * 24 * 60 * 60 * 1000
  });
  return csrfToken;
};

const clearAuthCookies = (res) => {
  const baseOptions = getBaseCookieOptions();
  res.clearCookie(ACCESS_COOKIE_NAME, baseOptions);
  res.clearCookie(REFRESH_COOKIE_NAME, baseOptions);
  res.clearCookie(CSRF_COOKIE_NAME, {
    ...baseOptions,
    httpOnly: false
  });
};

module.exports = {
  ACCESS_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  CSRF_COOKIE_NAME,
  setAuthCookies,
  setCsrfCookie,
  clearAuthCookies
};
