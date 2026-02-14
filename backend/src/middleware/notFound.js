const { StatusCodes } = require('http-status-codes');
const { sendError } = require('../shared/http/response');

module.exports = (req, res) => {
  return sendError(req, res, StatusCodes.NOT_FOUND, 'Route not found');
};
