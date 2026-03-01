const express = require('express');
const { validate } = require('express-validation');
const controller = require('./policy.controller');
const validator = require('./policy.validator');

const publicRouter = express.Router();
const protectedRouter = express.Router();

publicRouter.post('/policies', validate(validator.getPoliciesValidationSchema), controller.fetchPolicies);
publicRouter.get('/policies/by-type/:type', validate(validator.policyTypeParamValidationSchema), controller.fetchPolicyByType);

protectedRouter.get('/admin/get-policies', controller.getPolicies);
protectedRouter.post('/admin/edit-policies', validate(validator.editPolicyValidationSchema), controller.editPolicies);

protectedRouter.get('/policies', controller.getPolicies);
protectedRouter.post('/policies', validate(validator.createPolicyValidationSchema), controller.createPolicy);
protectedRouter.get('/policies/:id', validate(validator.policyIdParamValidationSchema), controller.getPolicyById);
protectedRouter.put('/policies/:id', validate(validator.updatePolicyByIdValidationSchema), controller.updatePolicyById);
protectedRouter.delete('/policies/:id', validate(validator.policyIdParamValidationSchema), controller.deletePolicyById);

module.exports = {
  publicRouter,
  protectedRouter
};
