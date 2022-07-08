import { Request, Response, NextFunction } from 'express';

const serviceErrorToStatusCode = {
    unauthorized: 401,
    notFound: 404,
    conflict: 409
};

export function unauthorized(){
    return { type: 'unauthorized' };
}

export function notFound(){
    return { type: 'notFound' };
}

export function conflict(){
    return { type: 'conflict' };
}

export default async function handleError(error, req:Request, res:Response, next:NextFunction) {
    if(error.type){
        res.sendStatus(serviceErrorToStatusCode[error.type]);
    }
    console.log(error);
    res.sendStatus(500);
}