const { generateResponse } = require('../../helpers');

const sendSuccess = (req, res, statusCode, message, data = {}) => {
  return generateResponse(req, res, statusCode, true, message, data);
};

const sendError = (req, res, statusCode, message, data = {}) => {
  return generateResponse(req, res, statusCode, false, message, data);
};

module.exports = {
  sendSuccess,
  sendError
};
