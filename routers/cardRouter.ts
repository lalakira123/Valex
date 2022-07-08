import { Router } from 'express';
import { createCard } from '../controllers/cardController.js';

import validateApiKey from './../middlewares/validateApiKeyMiddleware.js';

const cardRouter = Router();

cardRouter.post('/card/create/:id', validateApiKey, createCard);

export default cardRouter;