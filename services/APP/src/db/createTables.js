require('dotenv').config({path:'../../.env'})
const { Client } = require('pg');

const client = new Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT
});
client.connect();

const createUsersTable = () => {
    const usersTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username character varying(30) NOT NULL UNIQUE,
            password text NOT NULL,
            email character varying(70) NOT NULL UNIQUE,
            registration_date timestamp without time zone,
            last_login_date timestamp without time zone
        );
    `;
    return usersTableQuery;
}

const createEncryptionKeysTable = () => {
    const encryptionKeysTable = `
        CREATE TABLE encryption_keys (
            id SERIAL PRIMARY KEY REFERENCES users(id),
            key text NOT NULL
        );
    `;
    return encryptionKeysTable;
}

const createWalletTable = () => {
    const walletTableQuery = `
        CREATE TABLE IF NOT EXISTS wallet (
            id SERIAL PRIMARY KEY,
            label character varying(200) NOT NULL,
            secret text,
            user_id integer NOT NULL REFERENCES users(id),
            date_created timestamp without time zone,
            date_modified timestamp without time zone,
            icon character varying(100) DEFAULT 'email'::character varying,
            category character varying(100) DEFAULT 'email'::character varying,
            attachments text[]
        );
    `;
    return walletTableQuery;
}


const createAllTables = async () => {
    try {
        await client.query(createUsersTable());
        console.log('USERS TABLE CREATED ✅');

        await client.query(createEncryptionKeysTable());
        console.log('ENCRYPTION KEYS TABLE CREATED ✅');

        await client.query(createWalletTable());
        console.log('WALLET TABLE CREATED ✅');

        await client.end();
    } catch (err) {
        console.log(err);
    }
}

createAllTables();
