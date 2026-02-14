const cron = require('node-cron');
const { runFiveMinuteTask } = require('./cron.controller');

cron.schedule('*/5 * * * *', () => {
  runFiveMinuteTask();
});