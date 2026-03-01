const { Policies } = require('../../models');
const { Op } = require('sequelize');

const findPolicyByType = (type) => Policies.findOne({ where: { type } });
const findPolicyById = (id) => Policies.findByPk(id);
const listPolicies = () => Policies.findAll();
const createPolicy = (payload) => Policies.create(payload);
const updatePolicyByType = (type, content) => Policies.update({ content }, { where: { type } });
const updatePolicyById = (id, payload) => Policies.update(payload, { where: { id } });
const deletePolicyById = (id) => Policies.destroy({ where: { id } });
const findPolicyByTypeExcludingId = (type, id) =>
  Policies.findOne({
    where: {
      type,
      id: { [Op.ne]: id }
    }
  });

module.exports = {
  findPolicyByType,
  findPolicyById,
  listPolicies,
  createPolicy,
  updatePolicyByType,
  updatePolicyById,
  deletePolicyById,
  findPolicyByTypeExcludingId
};
