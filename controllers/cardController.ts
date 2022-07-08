import { Request, Response } from 'express';

import * as cardService from './../services/cardService.js';

export async function createCard(req:Request, res:Response){
    const { id } = req.params;
    const { type } = req.body;

    await cardService.createCard(Number(id), type);

    res.sendStatus(201);
}