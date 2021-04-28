import PG from 'pg';
const PGPool = PG.Pool;

export const pool = new PGPool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: parseInt(process.env.PG_PORT!)
});