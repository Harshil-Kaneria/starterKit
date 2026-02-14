const express = require('express');
const { validate } = require('express-validation');
const controller = require('./admin.controller');
const validator = require('./admin.validator');

const publicRouter = express.Router();
const protectedRouter = express.Router();

publicRouter.post('/admin/login', validate(validator.adminLoginValidationSchema), controller.login);

protectedRouter.get('/admin/get-profile', controller.getProfileDetails);
protectedRouter.get('/admin/admin-list', validate(validator.adminListQueryValidator), controller.list);
protectedRouter.get('/admin/dashboards', controller.adminDashboards);
protectedRouter.post('/admin/details', validate(validator.detailsAdminValidator), controller.details);
protectedRouter.post('/admin/delete-admin', validate(validator.deleteAdminValidator), controller.deleteAdmin);
protectedRouter.post('/admin/update-admin', validate(validator.updateValidator), controller.updateAdmin);
protectedRouter.post('/admin/register', validate(validator.registerValidator), controller.register);
protectedRouter.get('/admin/get-policies', controller.getAllPolicies);
protectedRouter.post('/admin/edit-policies', validate(validator.editPoliciesValidator), controller.editPolicies);
protectedRouter.get('/admin/user-list', validate(validator.userListQueryValidator), controller.userList);
protectedRouter.post('/admin/delete-user', validate(validator.deleteUserValidator), controller.deleteUser);
protectedRouter.get('/admin/toolkit', controller.toolkit);

module.exports = {
  publicRouter,
  protectedRouter
};
