require('dotenv').config();
const jwt = require('jsonwebtoken');
const { getString } = require('../config/runtime');
const { encryptToken, decryptToken } = require('./tokenCipher');

const ACCESS_TOKEN_EXPIRY = getString('JWT_ACCESS_TOKEN_EXPIRY', '15m');
const REFRESH_TOKEN_EXPIRY = getString('JWT_REFRESH_TOKEN_EXPIRY', '30d');
const JWT_ALGORITHM = 'RS256';

const normalizePem = (value) => String(value || '').replace(/\\n/g, '\n').trim();

const privateKey = normalizePem(getString('JWT_PRIVATE_KEY', ''));
const defaultPublicKey = normalizePem(getString('JWT_PUBLIC_KEY', ''));
const currentKeyId = getString('JWT_KEY_ID', 'main').trim();

if (!privateKey) {
  throw new Error('JWT_PRIVATE_KEY is required');
}

if (!defaultPublicKey) {
  throw new Error('JWT_PUBLIC_KEY is required');
}

const parsePublicKeySet = () => {
  const raw = getString('JWT_PUBLIC_KEYS_JSON', '').trim();
  if (!raw) {
    return { [currentKeyId]: defaultPublicKey };
  }

  try {
    const parsed = JSON.parse(raw);
    const normalized = {};
    Object.keys(parsed || {}).forEach((kid) => {
      normalized[kid] = normalizePem(parsed[kid]);
    });
    if (!normalized[currentKeyId]) {
      normalized[currentKeyId] = defaultPublicKey;
    }
    return normalized;
  } catch (error) {
    throw new Error('JWT_PUBLIC_KEYS_JSON must be valid JSON object');
  }
};

const publicKeysByKid = parsePublicKeySet();

const signToken = (payload, expiresIn) => {
  const signedToken = jwt.sign(payload, privateKey, {
    algorithm: JWT_ALGORITHM,
    expiresIn,
    header: {
      kid: currentKeyId
    }
  });
  return encryptToken(signedToken);
};

const resolvePublicKeyForToken = (rawToken) => {
  const decodedHeader = jwt.decode(rawToken, { complete: true })?.header || {};
  const kid = decodedHeader.kid || currentKeyId;
  const publicKey = publicKeysByKid[kid];
  if (!publicKey) {
    throw new Error('Unknown JWT key id');
  }
  return publicKey;
};

const issueAccessToken = (payload) => signToken(payload, ACCESS_TOKEN_EXPIRY);

const issueRefreshToken = (payload) => signToken(payload, REFRESH_TOKEN_EXPIRY);

const verifyToken = (token) => {
  const rawToken = decryptToken(token);
  const publicKey = resolvePublicKeyForToken(rawToken);
  return jwt.verify(rawToken, publicKey, { algorithms: [JWT_ALGORITHM] });
};

module.exports = {
  issueAccessToken,
  issueRefreshToken,
  verifyToken
};
