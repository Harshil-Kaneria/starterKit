const crypto = require('crypto');
const { getString } = require('../config/runtime');
const { AppError } = require('../shared/http/errors');

const TOKEN_PREFIX = 'enc.v1';
const normalizePem = (value) => String(value || '').replace(/\\n/g, '\n').trim();

const getEncryptionSecret = () => {
  const secret = getString('JWT_TOKEN_ENCRYPTION_KEY', '')
    || getString('RESPONSE_ENCRYPTION_KEY', '')
    || normalizePem(getString('JWT_PRIVATE_KEY', ''))
    || normalizePem(getString('JWT_PUBLIC_KEY', ''));
  if (!secret) {
    throw new AppError('Token encryption key is not configured', 500);
  }
  return crypto.createHash('sha256').update(secret).digest();
};

const encryptToken = (plainToken) => {
  const key = getEncryptionSecret();

  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(plainToken, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return `${TOKEN_PREFIX}.${iv.toString('base64url')}.${authTag.toString('base64url')}.${encrypted.toString('base64url')}`;
};

const decryptToken = (token) => {
  const key = getEncryptionSecret();
  if (!token || !token.startsWith(`${TOKEN_PREFIX}.`)) {
    return token;
  }
  if (!key) {
    throw new AppError('Token encryption key is not configured', 500);
  }

  const parts = token.split('.');
  if (parts.length !== 5) {
    throw new AppError('Invalid token', 401);
  }

  const iv = Buffer.from(parts[2], 'base64url');
  const authTag = Buffer.from(parts[3], 'base64url');
  const payload = Buffer.from(parts[4], 'base64url');

  try {
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);
    const decrypted = Buffer.concat([decipher.update(payload), decipher.final()]);
    return decrypted.toString('utf8');
  } catch (error) {
    throw new AppError('Invalid token', 401);
  }
};

module.exports = {
  encryptToken,
  decryptToken
};
