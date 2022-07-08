import { findById } from '../repositories/cardRepository.js';
import { insert } from '../repositories/rechargeRepository.js';
import { gone, forbidden, notFound, unprocessableEntity } from './../middlewares/errorHandlerMiddleware.js';
import * as serviceUtils from './../utils/serviceUtils.js';

async function rechargeCard(cardId:number, amount:number){
    if( amount <= 0 ) throw unprocessableEntity();

    const card = await findById(cardId);
    if(!card) throw notFound();
    if(!card.password) throw forbidden();

    const expirateCard = serviceUtils.validateExpirationDate(card.expirationDate);
    if(expirateCard) throw gone();

    await insert({cardId, amount});
}

export {
    rechargeCard
}