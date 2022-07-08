import express, { json } from 'express';
import 'express-async-errors';
import cors from 'cors';
import dotenv from 'dotenv';

import router from './routers/index.js';
import handleError from './middlewares/errorHandlerMiddleware.js';

const app =  express();
const port = process.env.PORT || 5000;
dotenv.config();

app.use(cors());
app.use(json());
app.use(router);
app.use(handleError);

app.listen(port, () => {
    console.log(`Server is running on PORT: ${port}`);
});


