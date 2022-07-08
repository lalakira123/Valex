import { Request, Response } from 'express';

import * as cardService from './../services/cardService.js';

export async function createCard(req:Request, res:Response){
    const { id } = req.params;
    const { type } = req.body;

    await cardService.createCard(Number(id), type);

    res.sendStatus(201);
}

export async function activateCard(req:Request, res:Response){
    const { id } = req.params;
    const { securityCode, password } = req.body;

    await cardService.activateCard(Number(id), securityCode, password);

    res.sendStatus(204);
}

export async function getCardByEmployee(req:Request, res:Response){
    const { id } = req.params;
    const { password, type } = req.body;

    await cardService.getEmployeeCards(Number(id), password, type);

    res.send();
}

export async function blockCard(req:Request, res:Response){
    const { id } = req.params;
    const { password } = req.body;

    await cardService.blockCard(Number(id), password);

    res.sendStatus(204);
}

export async function unblockCard(req:Request, res:Response){
    const { id } = req.params;
    const { password } = req.body;

    await cardService.unblockCard(Number(id), password);

    res.sendStatus(204);
}