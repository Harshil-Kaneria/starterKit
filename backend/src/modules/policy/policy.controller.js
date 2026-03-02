const { StatusCodes } = require('http-status-codes');
const service = require('./policy.service');
const { sendSuccess } = require('../../shared/http/response');

const fetchPolicies = async (req, res, next) => {
  try {
    const data = await service.getPolicyByType(req.body.type);
    return sendSuccess(req, res, StatusCodes.OK, 'Data fetched successfully', data);
  } catch (error) {
    return next(error);
  }
};

const getPolicies = async (req, res, next) => {
  try {
    const data = await service.getAllPolicies();
    return sendSuccess(req, res, StatusCodes.OK, 'Data fetched successfully', data);
  } catch (error) {
    return next(error);
  }
};

const editPolicies = async (req, res, next) => {
  try {
    await service.updatePolicy(req.body);
    return sendSuccess(req, res, StatusCodes.OK, 'Data updated successfully !');
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  fetchPolicies,
  getPolicies,
  editPolicies
};
