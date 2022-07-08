import dayjs from 'dayjs';

import { findById } from '../repositories/cardRepository.js';
import { insert } from '../repositories/rechargeRepository.js';
import { gone, inactive, notFound, unprocessableEntity } from './../middlewares/errorHandlerMiddleware.js';

async function rechargeCard(cardId:number, amount:number){
    if( amount <= 0 ) throw unprocessableEntity();

    const card = await findById(cardId);
    if(!card) throw notFound();
    if(!card.password) throw inactive();

    const expirateCard = validateExpirationDate(card.expirationDate);
    if(expirateCard) throw gone();

    await insert({cardId, amount});
}

function validateExpirationDate(expirationDate:string){
    const expirationDateDay = `01/${expirationDate}`;
    const differenceDates = dayjs(expirationDateDay, 'DD/MM/YY').diff(dayjs().format('DD/MM/YY'), 'month'); 

    if(differenceDates <= 0) return true;
    return false;
}

export {
    rechargeCard
}