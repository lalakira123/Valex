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
    update
} from './../repositories/cardRepository.js';

import { notFound, conflict, gone, unprocessableEntity, unauthorized } from './../middlewares/errorHandlerMiddleware.js';

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

    const expireCard = validateExpirationDate(card.expirationDate);
    if(expireCard) throw gone();

    const encryptedPassword = generateEncryptedPassword(password);

    await update(cardId, {password:encryptedPassword});
}

function generateDecryptedSecurityCode(encryptedSecurityCode:string){
    const cryptr = new Cryptr(process.env.SECRET_KEY);
    const decryptedSecurityCode = cryptr.decrypt(encryptedSecurityCode);
    return decryptedSecurityCode;
}

function validateExpirationDate(expirationDate:string){
    const expirationDateDay = `01/${expirationDate}`;
    const differenceDates = dayjs(expirationDateDay, 'DD/MM/YY').diff(dayjs().format('DD/MM/YY'), 'month'); 

    if(differenceDates <= 0) return true;
    return false;
}

function generateEncryptedPassword(password:string){
    const SALT = 10;
    const encryptedPassword = bcrypt.hashSync(password, SALT);
    return encryptedPassword;
}

export {
    createCard,
    activateCard
}