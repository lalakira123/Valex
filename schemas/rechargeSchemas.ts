import Joi from 'joi';

const rechargeCardSchema = Joi.object({
    amount: Joi.number().required()
});

export {
    rechargeCardSchema
}