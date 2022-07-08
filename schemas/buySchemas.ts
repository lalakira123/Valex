import Joi from 'joi';

const buySchema = Joi.object({
    cardId: Joi.number().required(),
    password: Joi.string().required(),
    business: Joi.number().required(),
    amountSale: Joi.number().required()
});

export {
    buySchema
}