const Joi = require('joi');

const getPoliciesValidationSchema = {
  body: Joi.object({
    type: Joi.string().valid('privacy_policy', 'terms_and_conditions').required()
  })
};

const editPolicyValidationSchema = {
  body: Joi.object({
    type: Joi.string().valid('privacy_policy', 'terms_and_conditions').required(),
    content: Joi.string().required()
  })
};

module.exports = {
  getPoliciesValidationSchema,
  editPolicyValidationSchema
};
