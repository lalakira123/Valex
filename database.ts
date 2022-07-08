import dotenv from "dotenv";
import pg from "pg";
dotenv.config();

const user = 'postgres';
const password = process.env.PASSWORD;
const host = 'localhost';
const port = 5432;
const database = 'valex';

const { Pool } = pg;
export const connection = new Pool({
    user,
    password,
    host,
    port,
    database
});
