import { Router } from 'express';

import { buy } from '../controllers/buyController.js';

const buyRouter = Router();

buyRouter.post('/buy', buy);

export default buyRouter;