import { Router } from 'express';
import { createCard, activateCard } from '../controllers/cardController.js';

import validateApiKey from './../middlewares/validateApiKeyMiddleware.js';

const cardRouter = Router();

cardRouter.post('/card/create/:id', validateApiKey, createCard);
cardRouter.put('/card/activate/:id', activateCard);

export default cardRouter;