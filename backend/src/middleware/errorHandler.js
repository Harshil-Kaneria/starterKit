const { StatusCodes } = require('http-status-codes');
const { sendError } = require('../shared/http/response');
const logger = require('../shared/logger/logger');

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err && (err.message === 'validation error' || err.message === 'Validation Failed')) {
    let messages = [];
    let messageType = null;

    if (err?.details?.body && Array.isArray(err?.details?.body)) {
      messages = err.details.body.map((e) => e.message);
      messageType = err.details.body.map((e) => e.type);
    } else if (err?.details?.query && Array.isArray(err?.details?.query)) {
      messages = err.details.query.map((e) => e.message);
      messageType = err.details.query.map((e) => e.type);
    }

    const message = messageType?.[0] !== 'any.unknown'
      ? messages.length > 1
        ? `${messages.join(', ')} are required fields`
        : `${messages.join(', ')} field`
      : messages[0] || 'Validation failed';

    return sendError(req, res, StatusCodes.BAD_REQUEST, message);
  }

  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Something went wrong !';

  logger.error({ err, requestId: req.requestId }, 'Unhandled API error');

  return sendError(req, res, statusCode, message, err.meta || {});
};

module.exports = errorHandler;
