import Joi from 'joi';

const createCardSchema = Joi.object({
    type: Joi.string().valid(
        'education',
        'groceries',
        'restaurant',
        'transport',
        'health'
    ).required()
});

const activateCardSchema = Joi.object({
    securityCode: Joi.string().required(),
    password: Joi.string().required()
});

const passwordSchema = Joi.object({
    password: Joi.string().required()
});

export {
    createCardSchema,
    activateCardSchema,
    passwordSchema
}