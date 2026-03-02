const repo = require('./policy.repository');
const { AppError } = require('../../shared/http/errors');
const { getCache, setCache, delCacheByPattern } = require('../../shared/cache/cacheService');

const getPolicyByType = async (type) => {
  const cacheKey = `policy:type:${type}`;
  const cacheData = await getCache(cacheKey);
  if (cacheData) {
    return cacheData;
  }

  const policy = await repo.findPolicyByType(type);
  if (!policy) {
    throw new AppError('Data not found', 404);
  }

  const policyData = policy.get();
  delete policyData.id;
  delete policyData.updatedAt;
  delete policyData.createdAt;

  const data = { data: policyData };
  await setCache(cacheKey, data, 300);
  return data;
};

const getAllPolicies = async () => {
  const cacheKey = 'policy:all';
  const cacheData = await getCache(cacheKey);
  if (cacheData) {
    return cacheData;
  }

  const policies = await repo.listPolicies();
  const data = { data: policies };

  await setCache(cacheKey, data, 300);
  return data;
};

const updatePolicy = async ({ type, content }) => {
  await repo.updatePolicyByType(type, content);
  await delCacheByPattern('policy:*');
};

module.exports = {
  getPolicyByType,
  getAllPolicies,
  updatePolicy
};
