const Joi = require('joi');

const policyType = Joi.string().valid('privacy_policy', 'terms_and_conditions');

const getPoliciesValidationSchema = {
  body: Joi.object({
    type: policyType.required()
  })
};

const policyTypeParamValidationSchema = {
  params: Joi.object({
    type: policyType.required()
  })
};

const policyIdParamValidationSchema = {
  params: Joi.object({
    id: Joi.number().integer().positive().required()
  })
};

const createPolicyValidationSchema = {
  body: Joi.object({
    type: policyType.required(),
    content: Joi.string().required()
  })
};

const editPolicyValidationSchema = {
  body: Joi.object({
    type: policyType.required(),
    content: Joi.string().required()
  })
};

const updatePolicyByIdValidationSchema = {
  params: Joi.object({
    id: Joi.number().integer().positive().required()
  }),
  body: Joi.object({
    type: policyType.optional(),
    content: Joi.string().optional()
  }).min(1)
};

module.exports = {
  getPoliciesValidationSchema,
  policyTypeParamValidationSchema,
  policyIdParamValidationSchema,
  createPolicyValidationSchema,
  editPolicyValidationSchema,
  updatePolicyByIdValidationSchema
};
