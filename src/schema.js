const Joi = require('joi');

module.exports = Joi.array()
  .required()
  .items(
    Joi.alternatives().try(
      Joi.object({
        hex: Joi.string().required(),
        code: Joi.string().required().warning('code.deprecated').message({
          'code.deprecated': '"Code" is deprecated, please use "name"!',
        }),
        group: Joi.string().required(),
        var: Joi.string(),
      }),
      Joi.object({
        hex: Joi.string().required(),
        name: Joi.string().required(),
        group: Joi.string().required(),
        var: Joi.string(),
      }),
    ),
  );
