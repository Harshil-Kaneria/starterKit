const { getString } = require('../config/runtime');
const { AppError } = require('../shared/http/errors');

const STORAGE_DRIVER = getString('FILE_STORAGE_DRIVER', 's3').toLowerCase();
const S3_PUBLIC_BASE_URL = getString('S3_PUBLIC_BASE_URL', '').trim();

const isValidUrl = (value) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch (error) {
    return false;
  }
};

const assertValidStoredFileUrl = (value, fieldName = 'file') => {
  if (!value) return;
  if (!isValidUrl(value)) {
    throw new AppError(`${fieldName} must be a valid URL`, 400);
  }

  if (STORAGE_DRIVER === 's3' && S3_PUBLIC_BASE_URL) {
    const normalizedBase = S3_PUBLIC_BASE_URL.endsWith('/') ? S3_PUBLIC_BASE_URL : `${S3_PUBLIC_BASE_URL}/`;
    if (!value.startsWith(normalizedBase)) {
      throw new AppError(`${fieldName} must be uploaded to configured S3 base URL`, 400);
    }
  }
};

module.exports = {
  STORAGE_DRIVER,
  assertValidStoredFileUrl
};
