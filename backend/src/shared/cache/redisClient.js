const Redis = require('ioredis');
const { getBoolean, getString } = require('../../config/runtime');
const logger = require('../logger/logger');

let redisClient = null;

if (getBoolean('REDIS_ENABLED', false)) {
  redisClient = new Redis(getString('REDIS_URL', 'redis://127.0.0.1:6379'), {
    maxRetriesPerRequest: 2,
    enableReadyCheck: true
  });

  redisClient.on('connect', () => logger.info('Redis connected'));
  redisClient.on('error', (error) => logger.error({ error }, 'Redis error'));
}

module.exports = redisClient;
