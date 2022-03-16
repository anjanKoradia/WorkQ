const Joi = require("joi");

const workDetailsValidator = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    volunteer_count: Joi.number().required(),
    category: Joi.string().required(),
    subcategory: Joi.string().required()
});


module.exports = workDetailsValidator;
