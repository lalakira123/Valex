import { Router } from 'express';

import cardRouter from './cardRouter.js';
import rechargeRouter from './rechargeRouter.js';
import buyRouter from './buyRouter.js';

const router = Router();

router.use(cardRouter);
router.use(rechargeRouter);
router.use(buyRouter);

export default router;