const Joi = require('joi');

module.exports = Joi.array()
  .required()
  .items(
    Joi.object({
      hex: Joi.string().required(),
      code: Joi.string().required(),
      group: Joi.string().required(),
      var: Joi.string(),
    }),
  );
