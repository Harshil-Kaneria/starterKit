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
  const data = {
    data: {
      id: policyData.id,
      type: policyData.type,
      content: policyData.content
    }
  };
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

const getPolicyById = async (id) => {
  const cacheKey = `policy:id:${id}`;
  const cacheData = await getCache(cacheKey);
  if (cacheData) {
    return cacheData;
  }

  const policy = await repo.findPolicyById(id);
  if (!policy) {
    throw new AppError('Data not found', 404);
  }

  const policyData = policy.get();
  const data = {
    data: {
      id: policyData.id,
      type: policyData.type,
      content: policyData.content
    }
  };

  await setCache(cacheKey, data, 300);
  return data;
};

const createPolicy = async ({ type, content }) => {
  const existingPolicy = await repo.findPolicyByType(type);
  if (existingPolicy) {
    throw new AppError('Policy type already exists', 409);
  }

  const policy = await repo.createPolicy({ type, content });
  await delCacheByPattern('policy:*');

  return { data: policy.get() };
};

const updatePolicyById = async (id, payload = {}) => {
  const existingPolicy = await repo.findPolicyById(id);
  if (!existingPolicy) {
    throw new AppError('Data not found', 404);
  }

  if (payload.type) {
    const duplicatePolicy = await repo.findPolicyByTypeExcludingId(payload.type, id);
    if (duplicatePolicy) {
      throw new AppError('Policy type already exists', 409);
    }
  }

  const updatePayload = {};
  if (payload.type !== undefined) updatePayload.type = payload.type;
  if (payload.content !== undefined) updatePayload.content = payload.content;

  await repo.updatePolicyById(id, updatePayload);
  await delCacheByPattern('policy:*');

  const updatedPolicy = await repo.findPolicyById(id);
  return { data: updatedPolicy.get() };
};

const deletePolicyById = async (id) => {
  const existingPolicy = await repo.findPolicyById(id);
  if (!existingPolicy) {
    throw new AppError('Data not found', 404);
  }

  await repo.deletePolicyById(id);
  await delCacheByPattern('policy:*');
};

module.exports = {
  getPolicyByType,
  getAllPolicies,
  updatePolicy,
  getPolicyById,
  createPolicy,
  updatePolicyById,
  deletePolicyById
};
