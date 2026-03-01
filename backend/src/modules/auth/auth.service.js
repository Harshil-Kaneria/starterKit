const crypto = require('crypto');
const { uuid } = require('unique-string-generator');
const { issueAccessToken, issueRefreshToken, verifyToken } = require('../../utils/jwtToken');
const { AppError } = require('../../shared/http/errors');
const repo = require('./auth.repository');

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const getClientIp = (req) => {
  const forwardedFor = req.headers['x-forwarded-for'];
  if (forwardedFor && typeof forwardedFor === 'string') {
    return forwardedFor.split(',')[0].trim();
  }
  return req.ip || req.socket?.remoteAddress || null;
};

const getDeviceInfo = (req) =>
  req.headers['sec-ch-ua-platform']
    || req.headers['x-device-platform']
    || req.headers['x-device-type']
    || null;

const buildLogContext = (req) => ({
  ipAddress: getClientIp(req),
  userAgent: req.headers['user-agent'] || null,
  deviceInfo: getDeviceInfo(req)
});

const createSessionAndTokens = async ({ secretId, loginType, req }) => {
  const sessionId = uuid.v4();
  const refreshToken = issueRefreshToken({
    secretId,
    loginType,
    sessionId,
    tokenType: 'refresh'
  });
  const accessToken = issueAccessToken({
    secretId,
    loginType,
    sessionId,
    tokenType: 'access'
  });

  const refreshTokenHash = hashToken(refreshToken);
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const context = buildLogContext(req);

  await repo.createSession({
    sessionId,
    secretId,
    loginType,
    refreshTokenHash,
    expiresAt,
    ...context
  });

  await repo.createLoginLog({
    sessionId,
    secretId,
    loginType,
    event: 'login',
    status: 'success',
    ...context
  });

  return {
    sessionId,
    accessToken,
    refreshToken
  };
};

const refreshSession = async ({ refreshToken, req }) => {
  let decoded;
  try {
    decoded = verifyToken(refreshToken);
  } catch (error) {
    await repo.createLoginLog({
      event: 'refresh',
      status: 'failed',
      ...buildLogContext(req),
      meta: { reason: 'invalid_token' }
    });
    throw new AppError('Invalid refresh token', 401);
  }

  if (!decoded?.secretId || !decoded?.sessionId || decoded?.tokenType !== 'refresh') {
    throw new AppError('Invalid refresh token', 401);
  }

  const session = await repo.findActiveSessionBySessionId(decoded.sessionId);
  if (!session) {
    throw new AppError('Session expired', 401);
  }

  if (new Date(session.expiresAt).getTime() <= Date.now()) {
    await repo.revokeSession(decoded.sessionId);
    throw new AppError('Session expired', 401);
  }

  const providedTokenHash = hashToken(refreshToken);
  if (session.refreshTokenHash !== providedTokenHash) {
    await repo.revokeSession(decoded.sessionId);
    await repo.createLoginLog({
      sessionId: decoded.sessionId,
      secretId: decoded.secretId,
      loginType: decoded.loginType,
      event: 'refresh',
      status: 'failed',
      ...buildLogContext(req),
      meta: { reason: 'token_reuse_detected' }
    });
    throw new AppError('Invalid refresh token', 401);
  }

  const newRefreshToken = issueRefreshToken({
    secretId: decoded.secretId,
    loginType: decoded.loginType,
    sessionId: decoded.sessionId,
    tokenType: 'refresh'
  });
  const newAccessToken = issueAccessToken({
    secretId: decoded.secretId,
    loginType: decoded.loginType,
    sessionId: decoded.sessionId,
    tokenType: 'access'
  });

  await repo.rotateSessionRefreshToken(decoded.sessionId, {
    refreshTokenHash: hashToken(newRefreshToken),
    lastUsedAt: new Date(),
    ipAddress: getClientIp(req),
    userAgent: req.headers['user-agent'] || null,
    deviceInfo: getDeviceInfo(req)
  });

  await repo.createLoginLog({
    sessionId: decoded.sessionId,
    secretId: decoded.secretId,
    loginType: decoded.loginType,
    event: 'refresh',
    status: 'success',
    ...buildLogContext(req)
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  };
};

const logoutSession = async ({ refreshToken, req }) => {
  if (!refreshToken) return;

  try {
    const decoded = verifyToken(refreshToken);
    if (!decoded?.sessionId) return;

    await repo.revokeSession(decoded.sessionId);
    await repo.createLoginLog({
      sessionId: decoded.sessionId,
      secretId: decoded.secretId || null,
      loginType: decoded.loginType || null,
      event: 'logout',
      status: 'success',
      ...buildLogContext(req)
    });
  } catch (error) {
    await repo.createLoginLog({
      event: 'logout',
      status: 'failed',
      ...buildLogContext(req),
      meta: { reason: 'invalid_refresh_token' }
    });
  }
};

const logoutAllSessions = async ({ secretId, loginType, req }) => {
  if (!secretId || !loginType) {
    throw new AppError('Token mismatch', 401);
  }

  await repo.revokeAllSessionsByIdentity(secretId, loginType);
  await repo.createLoginLog({
    secretId,
    loginType,
    event: 'logout_all',
    status: 'success',
    ...buildLogContext(req)
  });
};

module.exports = {
  createSessionAndTokens,
  refreshSession,
  logoutSession,
  logoutAllSessions
};
