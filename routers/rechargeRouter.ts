import { Router } from 'express';

import { rechargeCard } from './../controllers/rechargeController.js';
import validateApiKey from './../middlewares/validateApiKeyMiddleware.js';

const rechargeRouter = Router();

rechargeRouter.post('/recharge/:id', validateApiKey, rechargeCard);

export default rechargeRouter;