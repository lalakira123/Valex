import { forbidden, gone, notFound, unauthorized, unprocessableEntity } from "../middlewares/errorHandlerMiddleware.js"
import { findById } from "../repositories/cardRepository.js";
import { findById as findBusinessById } from "../repositories/businessRepository.js";
import * as serviceUtils from './../utils/serviceUtils.js';
import { findByCardId } from "../repositories/rechargeRepository.js";
import { findByCardId as findPaymentsByCardId, insert } from "../repositories/paymentRepository.js";

async function buy(cardId:number, password:string, businessId:number, amountSale:number){
    if(amountSale <= 0) throw unprocessableEntity();

    const card = await findById(cardId);
    if(!card) throw notFound();
    if(!card.password) throw forbidden();
    if(card.isBlocked) throw unauthorized();

    const expirateCard = serviceUtils.validateExpirationDate(card.expirationDate);
    if( expirateCard ) throw gone();

    const validatePassword = serviceUtils.validatePassword(password, card.password);
    if( !validatePassword ) throw unauthorized();

    const business = await findBusinessById(businessId);
    if(!business) throw notFound();

    if( card.type !== business.type ) throw forbidden();
    
    let amountCharge:number = 0;
    const charges = await findByCardId(cardId)
    if(charges.length > 0){
        charges.forEach((charge) => amountCharge += charge.amount);
    }

    let amountPayments:number = 0;
    const payments = await findPaymentsByCardId(cardId);
    if(payments.length > 0){
        payments.forEach((payment) => amountPayments += payment.amount);
    }

    const chargeTotal = amountCharge - amountPayments;
    if(chargeTotal - amountSale < 0) throw forbidden();
    
    await insert({cardId, businessId, amount:amountSale});
}

export {
    buy
}