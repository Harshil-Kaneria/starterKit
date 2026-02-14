const { Policies } = require('../../models');

const findPolicyByType = (type) => Policies.findOne({ where: { type } });
const listPolicies = () => Policies.findAll();
const updatePolicyByType = (type, content) => Policies.update({ content }, { where: { type } });

module.exports = {
  findPolicyByType,
  listPolicies,
  updatePolicyByType
};
