require('dotenv').config({path:'../../.env'})
const { Client } = require('pg');

const client = new Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: 5432
});
client.connect();

const createUsersTable = () => {
    const usersTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username character varying(30) NOT NULL UNIQUE,
                password text NOT NULL,
                email character varying(70) NOT NULL UNIQUE
            );
    `;
    return usersTableQuery;
}

const createWalletTable = () => {
    const walletTableQuery = `
        CREATE TABLE IF NOT EXISTS wallet (
            id SERIAL PRIMARY KEY,
            label character varying(200) NOT NULL,
            secret json,
            user_id integer NOT NULL REFERENCES users(id)
        );
    `;
    return walletTableQuery;
}


const createAllTables = async () => {
    try {
        await client.query(createUsersTable());
        console.log('USERS TABLE CREATED ✅');

        await client.query(createWalletTable());
        console.log('WALLET TABLE CREATED ✅');
        await client.end();
    } catch (err) {
        console.log(err);
    }
}

createAllTables();
