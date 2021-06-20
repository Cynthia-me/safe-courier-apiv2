//Validation
const Joi = require('joi');

//Signup Validation
const registerValidation = (data) => {
    const schema = Joi.object().keys({
        lastName: Joi.string().min(6).required(),
        firstName: Joi.string().min(6).required(),
        mail: Joi.string().min(6).required().email(),
        pwd: Joi.string().min(6).required()
    });
    //Let's validate the data before we add a user
    return schema.validate(data);
}

//Login Validation
 const loginValidation = (data) => {
    const schema = Joi.object().keys({
        mail: Joi.string().min(6).required().email(),
        pwd: Joi.string().min(6).required()
    });
    //Let's validate the data before we add a user
    return schema.validate(data);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;