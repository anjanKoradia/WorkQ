const Joi = require("joi");

const userDetailsValidator = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().required(),
    name: Joi.string().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipcode: Joi.string().required(),
});

module.exports = userDetailsValidator;