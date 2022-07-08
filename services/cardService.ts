import dayjs from 'dayjs';
import { faker } from '@faker-js/faker';
import Cryptr from 'cryptr';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

import { findById } from './../repositories/employeeRepository.js';
import { 
    findByTypeAndEmployeeId,
    TransactionTypes, 
    insert, 
    findById as findCardBydId, 
    update,
    find
} from './../repositories/cardRepository.js';
import { findByCardId as findChargeByCardId } from './../repositories/rechargeRepository.js';
import { findByCardId as findPaymentByCardId } from './../repositories/paymentRepository.js';
import { 
    notFound, 
    conflict, 
    gone, 
    unprocessableEntity, 
    unauthorized, 
    forbidden
} from './../middlewares/errorHandlerMiddleware.js';
import * as serviceUtils from './../utils/serviceUtils.js';
import { not } from 'joi';

dotenv.config();

async function createCard(employeeId:number, type:TransactionTypes){
    const employee = await findById(employeeId);
    if(!employee) throw notFound();

    const existTypeToEmployee = await findByTypeAndEmployeeId(type, employeeId); 
    if(existTypeToEmployee) throw conflict();

    const qntdNumberCard = 16;
    const qntdNumberSecurityCode = 3;

    const cardNumber = generateRandomNumber(qntdNumberCard);
    const cardholderName = generateCardName(employee.fullName);
    const expirationDate = generateExpirationDate();
    const securityCode = generateRandomNumber(qntdNumberSecurityCode);
    const encryptedSecurityCode = generateEncryptedSecurityCode(securityCode);

    const cardInfo = {
        employeeId,
        number: cardNumber,
        cardholderName,
        securityCode: encryptedSecurityCode,
        expirationDate,
        password: null,
        isVirtual: false,
        originalCardId: null,
        isBlocked: false,
        type
    }

    await insert(cardInfo);
}

function generateRandomNumber(number:number){
    return faker.random.numeric(number);
}

function generateCardName(employeeFullName:string){
    const arrayEmployeeName = employeeFullName.split(' ');

    for( let i = 0; i < arrayEmployeeName.length; i++ ){
        if(arrayEmployeeName[i].length <= 2){
            arrayEmployeeName[i] = "";
        }

        if( i > 0 && i < arrayEmployeeName.length - 1){
            arrayEmployeeName[i] = arrayEmployeeName[i][0];
        }
    }

    const filterArrayEmployeeName = arrayEmployeeName.filter((nome) => {
        return nome != undefined;
    })

    return filterArrayEmployeeName.join(" ").toUpperCase();
}

function generateExpirationDate(){
    return dayjs().add(5, 'year').locale('pt-br').format(`MM/YY`);
}

function generateEncryptedSecurityCode(securityCode:string){
    const cryptr = new Cryptr(process.env.SECRET_KEY);
    const encryptedSecurityCode = cryptr.encrypt(securityCode);
    return encryptedSecurityCode;
}

async function activateCard(cardId:number, securityCode:string, password:string){
    const card = await findCardBydId(cardId);
    if(!card) throw notFound();
    if(card.password) throw conflict();
    if(password.length !== 4) throw unprocessableEntity();   

    const encryptedSecurityCode = card.securityCode;
    const decryptedSecurityCode = generateDecryptedSecurityCode(encryptedSecurityCode);
    if(decryptedSecurityCode !== securityCode) throw unauthorized();

    const expireCard = serviceUtils.validateExpirationDate(card.expirationDate);
    if(expireCard) throw gone();

    const encryptedPassword = generateEncryptedPassword(password);

    await update(cardId, {password:encryptedPassword});
}

function generateDecryptedSecurityCode(encryptedSecurityCode:string){
    const cryptr = new Cryptr(process.env.SECRET_KEY);
    const decryptedSecurityCode = cryptr.decrypt(encryptedSecurityCode);
    return decryptedSecurityCode;
}

function generateEncryptedPassword(password:string){
    const SALT = 10;
    const encryptedPassword = bcrypt.hashSync(password, SALT);
    return encryptedPassword;
}

async function getEmployeeCards(employeeId:number, password:string){
    const cards = await find();

    const employeeCards = cards.filter((card) => {
        return card.employeeId == employeeId;
    });
    if( employeeCards.length === 0 ) throw notFound();

    const employeeActiveCards = employeeCards.filter((card) => {
        return card.password;
    });
    if( employeeActiveCards.length === 0 ) throw forbidden();

    employeeActiveCards.forEach((card) => {
        card.securityCode = generateDecryptedSecurityCode(card.securityCode);
        delete card.id;
        delete card.employeeId;
        delete card.password;
        delete card.isVirtual;
        delete card.originalCardId;
        delete card.isBlocked;
        delete card.type;
    });

    return employeeActiveCards;
}

async function getTransactions(cardId:number){
    const card = await findCardBydId(cardId);
    if(!card) throw notFound();

    let amountCharge:number = 0;
    const charges = await findChargeByCardId(cardId)
    if(charges.length > 0){
        charges.forEach((charge) => amountCharge += charge.amount);
    }

    let amountPayments:number = 0;
    const payments = await findPaymentByCardId(cardId);
    if(payments.length > 0){
        payments.forEach((payment) => amountPayments += payment.amount);
    }

    const chargeTotal = amountCharge - amountPayments;

    return {
        balance: chargeTotal,
        transactions: payments,
        recharges: charges
    }
}

async function blockCard(cardId:number, password:string){
    const card = await findCardBydId(cardId);
    if(!card) throw notFound();

    const expirateCard = serviceUtils.validateExpirationDate(card.expirationDate);
    if(expirateCard) throw gone();

    const cardBlock = card.isBlocked;
    if(cardBlock) throw unprocessableEntity();

    const validatePassword =  serviceUtils.validatePassword(password, card.password);
    if( !validatePassword ) throw unauthorized();

    await update(cardId, {isBlocked:true});
}

async function unblockCard(cardId:number, password:string){
    const card = await findCardBydId(cardId);
    if(!card) throw notFound();

    const expirateCard = serviceUtils.validateExpirationDate(card.expirationDate);
    if(expirateCard) throw gone();

    const cardBlock = card.isBlocked;
    if(!cardBlock) throw unprocessableEntity();

    const validatePassword = serviceUtils.validatePassword(password, card.password);
    if(!validatePassword) throw unauthorized();
    
    await update(cardId, {isBlocked:false});
}

export {
    createCard,
    activateCard,
    getEmployeeCards,
    getTransactions,
    blockCard,
    unblockCard
}