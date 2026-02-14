const logger = require('../../shared/logger/logger');

const runFiveMinuteTask = async () => {
  logger.info({ at: new Date().toISOString() }, '[cron] 5-minute task executed');
};

module.exports = {
  runFiveMinuteTask
};
