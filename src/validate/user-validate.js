const Joi = require('joi');
const { ENUM_ROLE } = require('../constants');

exports.registerUser = (req, res, next) => {
    const registerUserSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).max(9).optional(),
        typeRol: Joi.alternatives().try(...ENUM_ROLE).required(),
        description: Joi.string().optional(),
    }).required();

    const response = registerUserSchema.validate(req.body);

    if (response.error) {
        console.error(JSON.stringify(response.error));
        return res.status(400).json({ error: response.error.details[0].message });
    }

    next();
};
