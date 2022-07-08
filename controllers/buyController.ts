import { Request, Response } from 'express';

import * as buyService from './../services/buyService.js';

export async function buy(req:Request, res:Response){
    const { cardId, password, businessId, amountSale }= req.body;

    await buyService.buy(cardId, password, businessId, amountSale);

    res.sendStatus(201);
}