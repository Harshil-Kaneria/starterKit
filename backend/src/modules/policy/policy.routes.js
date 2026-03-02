const express = require('express');
const { validate } = require('express-validation');
const controller = require('./policy.controller');
const validator = require('./policy.validator');

const publicRouter = express.Router();
const protectedRouter = express.Router();

publicRouter.post('/policies', validate(validator.getPoliciesValidationSchema), controller.fetchPolicies);

protectedRouter.get('/admin/get-policies', controller.getPolicies);
protectedRouter.post('/admin/edit-policies', validate(validator.editPolicyValidationSchema), controller.editPolicies);

module.exports = {
  publicRouter,
  protectedRouter
};
