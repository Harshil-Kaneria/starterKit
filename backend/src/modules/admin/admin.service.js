const { uuid } = require('unique-string-generator');
const { issueAccessToken } = require('../../utils/jwtToken');
const { verifyPassword, hashPassword } = require('../../utils/passwordBcrypt');
const { dataTableHelper } = require('../../helpers');
const repo = require('./admin.repository');
const { AppError } = require('../../shared/http/errors');
const redisClient = require('../../shared/cache/redisClient');
const { getCache, setCache, delCacheByPattern, makeCacheKey } = require('../../shared/cache/cacheService');

const CACHE_KEYS = {
  adminList: 'admin:list',
  adminListDataTable: 'admin:list:datatable',
  userListDataTable: 'admin:user:list:datatable',
  dashboard: 'admin:dashboard',
  policies: 'admin:policies',
  toolkit: 'admin:toolkit'
};

const isTrue = (value) => value === true || value === 'true';

const login = async ({ email, password }) => {
  const user = await repo.findAdminByEmail(email);
  if (!user) {
    throw new AppError('Incorrect Email Id', 400);
  }

  const isMatch = await verifyPassword(password, user.password);
  if (!isMatch) {
    throw new AppError('Incorrect Password', 400);
  }

  const token = issueAccessToken({
    secretId: user.secretId,
    loginType: 'admin'
  });

  const safeUser = user.get();
  delete safeUser.password;

  return {
    data: {
      user: safeUser,
      token
    }
  };
};

const getProfile = async (secretId) => {
  const user = await repo.findAdminBySecretId(secretId);
  if (!user) {
    throw new AppError('Token mismatch', 401);
  }

  const profile = user.get();
  delete profile.password;
  delete profile.isDeleted;
  delete profile.updatedAt;

  return { user: profile };
};

const registerAdmin = async ({ email, password, name }) => {
  const existingAdmin = await repo.findAdminByEmail(email);
  if (existingAdmin) {
    throw new AppError('User already exists with same email', 409);
  }

  const hashedPassword = await hashPassword(password);
  await repo.createAdmin({
    email,
    name,
    password: hashedPassword,
    secretId: uuid.v4(),
    adminType: 'admin'
  });

  await delCacheByPattern('admin:*');
};

const getAdminList = async (query = {}) => {
  const isDataTableMode = query.start !== undefined || query.length !== undefined;
  const cacheKey = isDataTableMode
    ? makeCacheKey(CACHE_KEYS.adminListDataTable, query)
    : makeCacheKey(CACHE_KEYS.adminList, query);

  const cacheData = await getCache(cacheKey);
  if (cacheData) {
    return cacheData;
  }

  if (isDataTableMode) {
    const dataTableData = await repo.buildAdminListQuery(query);
    const tableData = await dataTableHelper(dataTableData);
    const state = await repo.getAdminStateSummary();

    const data = {
      ...tableData,
      state
    };

    await setCache(cacheKey, data, 45);
    return data;
  }

  const where = {};
  if (!isTrue(query.includeDeleted)) {
    where.isDeleted = false;
  }
  if (query.adminType) {
    where.adminType = query.adminType;
  }

  const admins = await repo.listAdmins(where);
  const state = await repo.getAdminStateSummary();
  const data = { data: admins, state };

  await setCache(cacheKey, data, 60);
  return data;
};

const getAdminDetails = async (secretId) => {
  const admin = await repo.findAdminBySecretId(secretId);
  if (!admin) {
    throw new AppError('Admin not found !', 404);
  }

  const adminData = admin.get();
  delete adminData.id;
  delete adminData.password;
  delete adminData.isDeleted;
  delete adminData.createdAt;
  delete adminData.updatedAt;

  return { data: adminData };
};

const updateAdmin = async ({ secretId, email, name, password }) => {
  const duplicateAdmin = await repo.findAdminByEmailExcludeSecretId(email, secretId);
  if (duplicateAdmin) {
    throw new AppError('User already exists with same email', 409);
  }

  const payload = { email, name };
  if (password) {
    payload.password = await hashPassword(password);
  }

  await repo.updateAdminBySecretId(secretId, payload);
  await delCacheByPattern('admin:*');
};

const deleteAdmin = async (secretId) => {
  await repo.softDeleteAdmin(secretId);
  await delCacheByPattern('admin:*');
};

const getDashboard = async () => {
  const cacheData = await getCache(CACHE_KEYS.dashboard);
  if (cacheData) {
    return cacheData;
  }

  const [userCount, adminCount] = await Promise.all([repo.countUsers(), repo.countAdmins()]);

  const data = {
    data: [
      {
        title: 'Users',
        stats: userCount.toString(),
        color: 'success',
        icon: 'ri-group-2-line'
      },
      {
        title: 'Admins',
        stats: adminCount.toString(),
        color: 'primary',
        icon: 'ri-shield-user-line'
      }
    ]
  };

  await setCache(CACHE_KEYS.dashboard, data, 30);
  return data;
};

const getPolicies = async () => {
  const cacheData = await getCache(CACHE_KEYS.policies);
  if (cacheData) {
    return cacheData;
  }

  const policies = await repo.listPolicies();
  const data = { data: policies };

  await setCache(CACHE_KEYS.policies, data, 120);
  return data;
};

const editPolicy = async ({ type, content }) => {
  await repo.updatePolicyByType(type, content);
  await delCacheByPattern('admin:policies');
  await delCacheByPattern('policy:*');
};

const getUsersDataTable = async (query) => {
  const cacheKey = makeCacheKey(CACHE_KEYS.userListDataTable, query);
  const cacheData = await getCache(cacheKey);
  if (cacheData) {
    return cacheData;
  }

  const dataTableData = await repo.buildUserListQuery(query);
  const tableData = await dataTableHelper(dataTableData);
  const state = await repo.getUserStateSummary();

  const data = {
    ...tableData,
    state
  };

  await setCache(cacheKey, data, 45);
  return data;
};

const deleteUser = async (secretId) => {
  await repo.softDeleteUser(secretId);
  await delCacheByPattern('admin:dashboard');
  await delCacheByPattern('admin:user:list:datatable*');
  await delCacheByPattern('admin:toolkit');
};

const getToolkitData = async () => {
  const cacheData = await getCache(CACHE_KEYS.toolkit);
  if (cacheData) {
    return cacheData;
  }

  const [admins, users, policies] = await Promise.all([
    repo.getAdminStateSummary(),
    repo.getUserStateSummary(),
    repo.listPolicies()
  ]);

  const data = {
    data: {
      modules: {
        admin: {
          query: ['search', 'adminType', 'includeDeleted', 'fromDate', 'toDate', 'start', 'length'],
          state: admins
        },
        users: {
          query: [
            'search',
            'includeDeleted',
            'isProfileCompleted',
            'country',
            'goal',
            'gender',
            'fromDate',
            'toDate',
            'start',
            'length'
          ],
          state: users
        }
      },
      policies: {
        total: policies.length,
        types: policies.map((policy) => policy.type)
      },
      runtime: {
        redis: {
          enabled: Boolean(redisClient),
          status: redisClient ? redisClient.status : 'disabled'
        }
      }
    }
  };

  await setCache(CACHE_KEYS.toolkit, data, 30);
  return data;
};

module.exports = {
  login,
  getProfile,
  registerAdmin,
  getAdminList,
  getAdminDetails,
  updateAdmin,
  deleteAdmin,
  getDashboard,
  getPolicies,
  editPolicy,
  getUsersDataTable,
  deleteUser,
  getToolkitData
};
