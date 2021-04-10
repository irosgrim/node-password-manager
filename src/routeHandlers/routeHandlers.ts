import Cryptography from '../crypto/crypto';
import { pool } from '../db/connect';
import { getAllEntries, getCryptoKeyForUser, getSecretWithId, insertNewSecret, search } from '../db/queries';
import { log } from '../helpers/logging';
import { LoggedInRequest } from '../security/userAuthorisation';
import express from 'express';


export const getSecretById = () => {
    return async (req: LoggedInRequest, res: express.Response) => {
        const secretId = req.params.id;
        const authorisedUser = req.authorisedUser;
    
        if (secretId) {
            try {
                const crytpoKeyQueryPromise = pool.query(getCryptoKeyForUser, [authorisedUser]);
                const resultsQueryPromise = pool.query(getSecretWithId, [secretId, authorisedUser]);
                const [results, cryptoKey] = await Promise.all([resultsQueryPromise, crytpoKeyQueryPromise]);

                const _cryptoKey = cryptoKey.rows[0].key;
                const decryptedData = results.rows.map((entry) => {
                    const secretData = new Cryptography().decrypt(entry.secret, _cryptoKey);
                    return {
                        id: entry.id,
                        label: entry.label,
                        secret: secretData,
                        user_id: entry.user_id
                    };
                });
                res.send(decryptedData);
            } catch (err) {
                log.error(req, err);
            }
        } else {
            res.status(400).send();
        }
    }
}

export const postNewSecret = () => {
    return async (req: LoggedInRequest, res: express.Response) => {
        const secret = JSON.stringify(req.body.secret);
        const label = req.body.label;
        const authorisedUser = req.authorisedUser;
    
        if (secret) {
            const crytpoKeyQueryPromise = await pool.query(getCryptoKeyForUser, [authorisedUser]);
            const cryptoKey = crytpoKeyQueryPromise.rows[0].key;
            const secretEncrypted = await new Cryptography().encrypt(secret, cryptoKey);
            try {
                await pool.query(insertNewSecret, [label, secretEncrypted, authorisedUser]);
                res.send('OK!');
            } catch(err) {
                log.error(req, err);
            }
        }
    }
}

export const searchSecrets = () => {
    return async (req: LoggedInRequest, res: express.Response) => {
        const searchQuery = req.query.q || '';
        const authorisedUser = req.authorisedUser;
        
        if(searchQuery) {
            try {
                const results = await pool.query(search, [searchQuery, authorisedUser]);
                res.send(results.rows);
            } catch(err) {
                log.error(req, err);
            }
        }
    }
}

interface Entry {
    id: number;
    label: string;
    secret: string;
    user_id: number;
}

export const getAllSecrets = () => {
    return async (req: LoggedInRequest, res: express.Response) => {
        pool.query(getAllEntries, [req.authorisedUser], async (error, results) => {
            if (error) {
                log.error(req, error);
            }
            const rows: Entry[] = results.rows;
            log.info(req, rows);
            res.send(rows);
            return;
        })
    }
}