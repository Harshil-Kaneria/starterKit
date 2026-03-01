const { Sequelize } = require('sequelize');
const { getString, getNumber } = require('./runtime');
const logger = require('../shared/logger/logger');
const { dbQueryDurationMs } = require('../shared/metrics');

const sequelize = new Sequelize(
  getString('DB_NAME', ''),
  getString('DB_USER', ''),
  getString('DB_PASS', ''),
  {
    host: getString('DB_HOST', 'localhost'),
    port: getNumber('DB_PORT', 5432),
    dialect: getString('DB_DIALECT', 'postgres'),
    benchmark: true,
    pool: {
      max: getNumber('DB_POOL_MAX', 20),
      min: getNumber('DB_POOL_MIN', 2),
      acquire: getNumber('DB_POOL_ACQUIRE_MS', 30000),
      idle: getNumber('DB_POOL_IDLE_MS', 10000),
      evict: getNumber('DB_POOL_EVICT_MS', 1000)
    },
    dialectOptions: {
      ssl: getString('DB_SSL_ENABLED', 'false') === 'true'
        ? {
            require: true,
            rejectUnauthorized: getString('DB_SSL_REJECT_UNAUTHORIZED', 'true') === 'true'
          }
        : false
    },
    logging: (sql, timingMs) => {
      const modelRegex = /(?:FROM|UPDATE|INSERT\s+INTO)\s+(?:`([^`]+)`|"([^"]+)"|([a-zA-Z0-9_.]+))/i;
      const modelMatch = sql.match(modelRegex);
      const model = modelMatch ? (modelMatch[1] || modelMatch[2] || modelMatch[3]) : 'unknown';

      if (typeof timingMs === 'number') {
        dbQueryDurationMs.observe({ model }, timingMs);
      }

      logger.debug({ sql, timingMs, model }, 'DB query');
    }
  }
);

sequelize
  .authenticate()
  .then(() => logger.info('Database connection established'))
  .catch((error) => logger.error({ error }, 'Unable to connect to database'));

module.exports = sequelize;
