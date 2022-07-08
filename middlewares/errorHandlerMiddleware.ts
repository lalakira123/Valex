import { Request, Response, NextFunction } from 'express';

const serviceErrorToStatusCode = {
    unauthorized: 401,
    notFound: 404,
    conflict: 409,
    gone: 410,
    unprocessableEntity: 422,
    forbidden: 403
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

export function gone(){
    return { type: 'gone' };
}

export function unprocessableEntity(){
    return { type: 'unprocessableEntity' }
}

export function forbidden(){
    return { type: 'forbidden' }
}

export default async function handleError(error, req:Request, res:Response, next:NextFunction) {
    if(error.type){
        res.sendStatus(serviceErrorToStatusCode[error.type]);
    }
    console.log(error);
    res.sendStatus(500);
}