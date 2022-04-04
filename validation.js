// Validation
const Joi = require("joi");

const registerValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(4).max(255).required(),
    number: Joi.string().min(9).max(11),
    address: Joi.string().max(1024),
    password: Joi.string().min(4).max(255).required(),
  });
  return schema.validate(data);
};
const loginValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(4).max(255).required(),
    password: Joi.string().min(4).max(255).required(),
  });
  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
