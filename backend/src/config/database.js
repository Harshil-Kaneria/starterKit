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
  port: getNumber('DB_PORT', 3306),
  dialect: getString('DB_DIALECT', 'mysql'),
  benchmark: true,
  logging: (sql, timingMs) => {
    const modelMatch = sql.match(/FROM\s+`([^`]+)`/i) || sql.match(/UPDATE\s+`([^`]+)`/i) || sql.match(/INSERT\s+INTO\s+`([^`]+)`/i);
    const model = modelMatch ? modelMatch[1] : 'unknown';

    if (typeof timingMs === 'number') {
      dbQueryDurationMs.observe({ model }, timingMs);
    }

    logger.debug({ sql, timingMs, model }, 'DB query');
  }
});

sequelize
  .authenticate()
  .then(() => logger.info('Database connection established'))
  .catch((error) => logger.error({ error }, 'Unable to connect to database'));

module.exports = sequelize;
