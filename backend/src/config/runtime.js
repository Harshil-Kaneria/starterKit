const getString = (key, fallback = '') => {
  const value = process.env[key];
  if (value === undefined || value === null || value === '') {
    return fallback;
  }
  return value;
};

const getNumber = (key, fallback) => {
  const value = process.env[key];
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const getBoolean = (key, fallback = false) => {
  const value = process.env[key];
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  const normalized = String(value).toLowerCase();
  if (['true', '1', 'yes', 'on'].includes(normalized)) return true;
  if (['false', '0', 'no', 'off'].includes(normalized)) return false;
  return fallback;
};

module.exports = {
  getString,
  getNumber,
  getBoolean
};
