import { Router } from 'express';
import { createCard, activateCard, getCardByEmployee, blockCard } from '../controllers/cardController.js';

import validateApiKey from './../middlewares/validateApiKeyMiddleware.js';

const cardRouter = Router();

cardRouter.post('/card/create/:id', validateApiKey, createCard);
cardRouter.post('/card/activate/:id', activateCard);
cardRouter.get('/card/:id', getCardByEmployee);
cardRouter.post('/card/block/:id', blockCard);

export default cardRouter;