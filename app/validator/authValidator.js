const Joi = require("joi");

const signUpStep1Validator = Joi.object({
    email: Joi.string().required(),
    tAc: Joi.string().required(),
});

const signUpStep2Validator = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
});

const loginValidator = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
});

module.exports = { signUpStep1Validator, signUpStep2Validator, loginValidator };
