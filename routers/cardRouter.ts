import { Router } from 'express';

import { 
    createCard, 
    activateCard, 
    getCardByEmployee, 
    blockCard, 
    unblockCard, 
    getTransactionsOfCard
} from '../controllers/cardController.js';
import validateApiKey from './../middlewares/validateApiKeyMiddleware.js';
import validateSchema from '../middlewares/validateSchemaMiddleware.js';
import * as cardSchemas from './../schemas/cardSchemas.js';

const cardRouter = Router();

cardRouter.post('/card/create/:id', validateApiKey, validateSchema(cardSchemas.createCardSchema), createCard);
cardRouter.post('/card/activate/:id', validateSchema(cardSchemas.activateCardSchema), activateCard);
cardRouter.get('/card/:id', validateSchema(cardSchemas.passwordSchema), getCardByEmployee);
cardRouter.get('/card/transactions/:id', getTransactionsOfCard);
cardRouter.post('/card/block/:id', validateSchema(cardSchemas.passwordSchema), blockCard);
cardRouter.post('/card/unblock/:id', validateSchema(cardSchemas.passwordSchema), unblockCard);

export default cardRouter;