import { Router } from 'express';

import { rechargeCard } from './../controllers/rechargeController.js';
import validateApiKey from './../middlewares/validateApiKeyMiddleware.js';
import validateSchema from './../middlewares/validateSchemaMiddleware.js';
import * as rechargeSchemas from './../schemas/rechargeSchemas.js';

const rechargeRouter = Router();

rechargeRouter.post('/recharge/:id', validateApiKey, validateSchema(rechargeSchemas.rechargeCardSchema), rechargeCard);

export default rechargeRouter;