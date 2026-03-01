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

const fetchPolicyByType = async (req, res, next) => {
  try {
    const data = await service.getPolicyByType(req.params.type);
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

const getPolicyById = async (req, res, next) => {
  try {
    const data = await service.getPolicyById(Number(req.params.id));
    return sendSuccess(req, res, StatusCodes.OK, 'Data fetched successfully', data);
  } catch (error) {
    return next(error);
  }
};

const createPolicy = async (req, res, next) => {
  try {
    const data = await service.createPolicy(req.body);
    return sendSuccess(req, res, StatusCodes.CREATED, 'Data created successfully !', data);
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

const updatePolicyById = async (req, res, next) => {
  try {
    const data = await service.updatePolicyById(Number(req.params.id), req.body);
    return sendSuccess(req, res, StatusCodes.OK, 'Data updated successfully !', data);
  } catch (error) {
    return next(error);
  }
};

const deletePolicyById = async (req, res, next) => {
  try {
    await service.deletePolicyById(Number(req.params.id));
    return sendSuccess(req, res, StatusCodes.OK, 'Data deleted successfully !');
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  fetchPolicies,
  fetchPolicyByType,
  getPolicies,
  getPolicyById,
  createPolicy,
  editPolicies,
  updatePolicyById,
  deletePolicyById
};
