const { AuthSession, LoginLog } = require('../../models');

const createSession = (payload) => AuthSession.create(payload);

const findActiveSessionBySessionId = (sessionId) =>
  AuthSession.findOne({
    where: {
      sessionId,
      isRevoked: false
    }
  });

const rotateSessionRefreshToken = (sessionId, payload) =>
  AuthSession.update(payload, {
    where: {
      sessionId,
      isRevoked: false
    }
  });

const revokeSession = (sessionId) =>
  AuthSession.update(
    { isRevoked: true },
    {
      where: {
        sessionId,
        isRevoked: false
      }
    }
  );

const revokeAllSessionsByIdentity = (secretId, loginType) =>
  AuthSession.update(
    { isRevoked: true },
    {
      where: {
        secretId,
        loginType,
        isRevoked: false
      }
    }
  );

const createLoginLog = (payload) => LoginLog.create(payload);

module.exports = {
  createSession,
  findActiveSessionBySessionId,
  rotateSessionRefreshToken,
  revokeSession,
  revokeAllSessionsByIdentity,
  createLoginLog
};
