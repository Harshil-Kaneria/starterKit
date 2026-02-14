const pinoHttp = require('pino-http');
const logger = require('./logger');

const httpLogger = pinoHttp({
  logger,
  customProps: (req) => ({ requestId: req.requestId }),
  serializers: {
    req: (req) => ({
      id: req.id,
      method: req.method,
      url: req.url
    }),
    res: (res) => ({
      statusCode: res.statusCode
    })
  }
});

module.exports = httpLogger;
