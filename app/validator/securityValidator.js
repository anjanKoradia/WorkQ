const Joi = require("joi");

const passwordValidator = Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
    confirmPassword: Joi.string().required()
});


module.exports = { passwordValidator };
