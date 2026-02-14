const { StatusCodes } = require('http-status-codes');
const service = require('./admin.service');
const { sendSuccess } = require('../../shared/http/response');

const login = async (req, res, next) => {
  try {
    const data = await service.login(req.body);
    return sendSuccess(req, res, StatusCodes.OK, 'Login successfully !', data);
  } catch (error) {
    return next(error);
  }
};

const getProfileDetails = async (req, res, next) => {
  try {
    const data = await service.getProfile(req.loggedInUser.secretId);
    return sendSuccess(req, res, StatusCodes.OK, 'Data fetched successfully !', data);
  } catch (error) {
    return next(error);
  }
};

const register = async (req, res, next) => {
  try {
    await service.registerAdmin(req.body);
    return sendSuccess(req, res, StatusCodes.CREATED, 'Admin register successfully !');
  } catch (error) {
    return next(error);
  }
};

const list = async (req, res, next) => {
  try {
    const data = await service.getAdminList(req.query);
    return sendSuccess(req, res, StatusCodes.OK, 'Data fetch successfully !', data);
  } catch (error) {
    return next(error);
  }
};

const details = async (req, res, next) => {
  try {
    const data = await service.getAdminDetails(req.body.secretId);
    return sendSuccess(req, res, StatusCodes.OK, 'Admin data fetch successfully !', data);
  } catch (error) {
    return next(error);
  }
};

const updateAdmin = async (req, res, next) => {
  try {
    await service.updateAdmin(req.body);
    return sendSuccess(req, res, StatusCodes.OK, 'Data updated successfully !');
  } catch (error) {
    return next(error);
  }
};

const deleteAdmin = async (req, res, next) => {
  try {
    await service.deleteAdmin(req.body.secretId);
    return sendSuccess(req, res, StatusCodes.OK, 'Admin deleted successfully !');
  } catch (error) {
    return next(error);
  }
};

const adminDashboards = async (req, res, next) => {
  try {
    const data = await service.getDashboard();
    return sendSuccess(req, res, StatusCodes.OK, 'Data fetched successfully!', data);
  } catch (error) {
    return next(error);
  }
};

const getAllPolicies = async (req, res, next) => {
  try {
    const data = await service.getPolicies();
    return sendSuccess(req, res, StatusCodes.OK, 'Data fetched successfully', data);
  } catch (error) {
    return next(error);
  }
};

const editPolicies = async (req, res, next) => {
  try {
    await service.editPolicy(req.body);
    return sendSuccess(req, res, StatusCodes.OK, 'Data updated successfully !');
  } catch (error) {
    return next(error);
  }
};

const userList = async (req, res, next) => {
  try {
    const tableData = await service.getUsersDataTable(req.query);
    return sendSuccess(req, res, StatusCodes.OK, 'Data fetched successfully !', tableData);
  } catch (error) {
    return next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    await service.deleteUser(req.body.secretId);
    return sendSuccess(req, res, StatusCodes.OK, 'User deleted successfully !');
  } catch (error) {
    return next(error);
  }
};

const toolkit = async (req, res, next) => {
  try {
    const data = await service.getToolkitData();
    return sendSuccess(req, res, StatusCodes.OK, 'Toolkit data fetched successfully !', data);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  login,
  getProfileDetails,
  register,
  list,
  details,
  updateAdmin,
  deleteAdmin,
  adminDashboards,
  getAllPolicies,
  editPolicies,
  userList,
  deleteUser,
  toolkit
};
