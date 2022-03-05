const Joi = require("joi");

const workDetailsValidator = Joi.object({
    title: Joi.string().required(),
    subtitle: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string().required()
});


module.exports = workDetailsValidator;
