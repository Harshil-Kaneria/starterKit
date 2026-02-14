const { Op } = require('sequelize');
const { Admin, User, Policies } = require('../../models');

const isTrue = (value) => value === true || value === 'true';

const findAdminByEmail = (email) => Admin.findOne({ where: { email, isDeleted: false } });

const findAdminBySecretId = (secretId) =>
  Admin.findOne({
    where: { secretId, isDeleted: false }
  });

const findAdminByEmailExcludeSecretId = (email, secretId) =>
  Admin.findOne({
    where: {
      email,
      isDeleted: false,
      secretId: { [Op.ne]: secretId }
    }
  });

const createAdmin = (payload) => Admin.create(payload);

const listAdmins = (where = { isDeleted: false }, order = [['createdAt', 'DESC']]) =>
  Admin.findAll({
    where,
    order
  });

const updateAdminBySecretId = (secretId, payload) =>
  Admin.update(payload, { where: { secretId, isDeleted: false } });

const softDeleteAdmin = (secretId) =>
  Admin.update({ isDeleted: true }, { where: { secretId, isDeleted: false } });

const countUsers = () => User.count({ where: { isDeleted: false } });
const countAdmins = () => Admin.count({ where: { isDeleted: false } });

const listPolicies = () => Policies.findAll();

const updatePolicyByType = (type, content) => Policies.update({ content }, { where: { type } });

const buildAdminListQuery = async (query) => {
  const searchableColumns = ['name', 'email', 'adminType'];
  const whereCondition = {};

  if (!isTrue(query.includeDeleted)) {
    whereCondition.isDeleted = false;
  }

  if (query.adminType) {
    whereCondition.adminType = query.adminType;
  }

  if (query.fromDate || query.toDate) {
    whereCondition.createdAt = {
      ...(query.fromDate ? { [Op.gte]: new Date(query.fromDate) } : {}),
      ...(query.toDate ? { [Op.lte]: new Date(query.toDate) } : {})
    };
  }

  return {
    model: Admin,
    query,
    searchableColumns,
    whereCondition,
    orderColumnWhitelist: ['id', 'name', 'email', 'adminType', 'createdAt', 'updatedAt'],
    orderColumnMap: {
      Name: 'name',
      Email: 'email',
      Type: 'adminType'
    }
  };
};

const buildUserListQuery = async (query) => {
  const searchableColumns = ['name', 'email'];
  const whereCondition = {};

  if (!isTrue(query.includeDeleted)) {
    whereCondition.isDeleted = false;
  }

  if (query.isProfileCompleted === true || query.isProfileCompleted === false || query.isProfileCompleted === 'true' || query.isProfileCompleted === 'false') {
    whereCondition.isProfileCompleted = isTrue(query.isProfileCompleted);
  }

  if (query.country) {
    whereCondition.country = query.country;
  }

  if (query.goal) {
    whereCondition.goal = query.goal;
  }

  if (query.gender) {
    whereCondition.gender = query.gender;
  }

  if (query.fromDate || query.toDate) {
    whereCondition.createdAt = {
      ...(query.fromDate ? { [Op.gte]: new Date(query.fromDate) } : {}),
      ...(query.toDate ? { [Op.lte]: new Date(query.toDate) } : {})
    };
  }

  const dataTableData = {
    model: User,
    query,
    searchableColumns,
    whereCondition,
    orderColumnWhitelist: ['id', 'name', 'email', 'gender', 'country', 'goal', 'isProfileCompleted', 'createdAt', 'updatedAt'],
    orderColumnMap: {
      Name: 'name',
      Email: 'email',
      Gender: 'gender',
      Country: 'country',
      Goal: 'goal',
      Actions: 'id'
    }
  };

  return dataTableData;
};

const softDeleteUser = (secretId) =>
  User.update({ isDeleted: true }, { where: { secretId, isDeleted: false } });

const getAdminStateSummary = async () => {
  const [total, active, deleted, superAdmins] = await Promise.all([
    Admin.count(),
    Admin.count({ where: { isDeleted: false } }),
    Admin.count({ where: { isDeleted: true } }),
    Admin.count({ where: { adminType: 'superAdmin', isDeleted: false } })
  ]);

  return {
    total,
    active,
    deleted,
    superAdmins,
    admins: Math.max(active - superAdmins, 0)
  };
};

const getUserStateSummary = async () => {
  const [total, active, deleted, profileCompleted] = await Promise.all([
    User.count(),
    User.count({ where: { isDeleted: false } }),
    User.count({ where: { isDeleted: true } }),
    User.count({ where: { isDeleted: false, isProfileCompleted: true } })
  ]);

  return {
    total,
    active,
    deleted,
    profileCompleted,
    profilePending: Math.max(active - profileCompleted, 0)
  };
};

module.exports = {
  findAdminByEmail,
  findAdminBySecretId,
  findAdminByEmailExcludeSecretId,
  createAdmin,
  listAdmins,
  updateAdminBySecretId,
  softDeleteAdmin,
  countUsers,
  countAdmins,
  listPolicies,
  updatePolicyByType,
  buildAdminListQuery,
  buildUserListQuery,
  softDeleteUser,
  getAdminStateSummary,
  getUserStateSummary
};
