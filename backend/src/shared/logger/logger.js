const pino = require('pino');
const { getString } = require('../../config/runtime');

const logger = pino({
  level: getString('LOG_LEVEL', 'info'),
  base: undefined,
  redact: {
    paths: [
      'req.headers.authorization',
      'password',
      'MAIL_PASS',
      'RESPONSE_ENCRYPTION_KEY',
      'JWT_PRIVATE_KEY',
      'JWT_TOKEN_ENCRYPTION_KEY'
    ],
    remove: true
  }
});

module.exports = logger;
