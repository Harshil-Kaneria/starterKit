const redisClient = require('./redisClient');

const getCache = async (key) => {
  if (!redisClient) return null;
  const value = await redisClient.get(key);
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const setCache = async (key, value, ttlSeconds = 60) => {
  if (!redisClient) return;
  await redisClient.set(key, JSON.stringify(value), 'EX', ttlSeconds);
};

const delCacheByPattern = async (pattern) => {
  if (!redisClient) return;

  let cursor = '0';
  do {
    const [nextCursor, keys] = await redisClient.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
    cursor = nextCursor;

    if (keys.length) {
      await redisClient.del(...keys);
    }
  } while (cursor !== '0');
};

const makeCacheKey = (prefix, query = {}) => {
  const entries = Object.entries(query)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .sort(([a], [b]) => a.localeCompare(b));

  if (!entries.length) {
    return prefix;
  }

  const encodedQuery = entries
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');

  return `${prefix}:${encodedQuery}`;
};

module.exports = {
  getCache,
  setCache,
  delCacheByPattern,
  makeCacheKey
};
