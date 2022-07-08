import { Router } from 'express';

import { buy } from '../controllers/buyController.js';
import validateSchema from '../middlewares/validateSchemaMiddleware.js';
import * as buySchemas from './../schemas/buySchemas.js';

const buyRouter = Router();

buyRouter.post('/buy', validateSchema(buySchemas.buySchema), buy);

export default buyRouter;