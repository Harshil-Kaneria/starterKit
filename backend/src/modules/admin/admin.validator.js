const Joi = require('joi');

const adminLoginValidationSchema = {
  body: Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
  })
};

const registerValidator = {
  body: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  })
};

const updateValidator = {
  body: Joi.object({
    secretId: Joi.string().required(),
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().allow('').optional()
  })
};

const deleteAdminValidator = {
  body: Joi.object({
    secretId: Joi.string().required()
  })
};

const detailsAdminValidator = {
  body: Joi.object({
    secretId: Joi.string().required()
  })
};

const updatePasswordValidator = {
  body: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required()
  })
};

const updateProfileValidator = {
  body: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required()
  })
};

const editPoliciesValidator = {
  body: Joi.object({
    type: Joi.string().valid('privacy_policy', 'terms_and_conditions').required(),
    content: Joi.string().required()
  })
};

const deleteUserValidator = {
  body: Joi.object({
    secretId: Joi.string().required()
  })
};

const adminListQueryValidator = {
  query: Joi.object({
    search: Joi.string().allow('').optional(),
    orderColumn: Joi.string().max(100).optional(),
    orderDirection: Joi.string().valid('ASC', 'DESC', 'asc', 'desc').optional(),
    start: Joi.number().integer().min(0).optional(),
    length: Joi.number().integer().min(1).max(200).optional(),
    adminType: Joi.string().valid('superadmin', 'admin').optional(),
    includeDeleted: Joi.boolean().truthy('true').falsy('false').optional(),
    fromDate: Joi.date().iso().optional(),
    toDate: Joi.date().iso().optional()
  })
};

const userListQueryValidator = {
  query: Joi.object({
    search: Joi.string().allow('').optional(),
    orderColumn: Joi.string().max(100).optional(),
    orderDirection: Joi.string().valid('ASC', 'DESC', 'asc', 'desc').optional(),
    start: Joi.number().integer().min(0).optional(),
    length: Joi.number().integer().min(1).max(200).optional(),
    includeDeleted: Joi.boolean().truthy('true').falsy('false').optional(),
    isProfileCompleted: Joi.boolean().truthy('true').falsy('false').optional(),
    country: Joi.string().max(100).optional(),
    goal: Joi.string().max(100).optional(),
    gender: Joi.string().max(50).optional(),
    fromDate: Joi.date().iso().optional(),
    toDate: Joi.date().iso().optional()
  })
};

module.exports = {
  adminLoginValidationSchema,
  registerValidator,
  updateValidator,
  deleteAdminValidator,
  detailsAdminValidator,
  updatePasswordValidator,
  updateProfileValidator,
  editPoliciesValidator,
  deleteUserValidator,
  adminListQueryValidator,
  userListQueryValidator
};
