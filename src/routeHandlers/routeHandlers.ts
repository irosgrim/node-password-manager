import Cryptography from '../crypto/crypto';
import { pool } from '../db/connect';
import { getSecretWithId, insertNewSecret } from '../db/queries';
import { log } from '../helpers/logging';
import { LoggedInRequest } from '../security/userAuthorisation';
import express from 'express';


export const getSecretById = () => {
    return async (req: LoggedInRequest, res: express.Response) => {
        const secretId = req.params.id;
        const authorisedUser = req.authorisedUser;
    
        if (secretId) {
            try {
                const results = await pool.query(getSecretWithId, [secretId, authorisedUser]);
                const decryptedData = results.rows.map((entry) => {
                    const secretData = new Cryptography().decrypt(entry.secret);
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
            const secretEncrypted = await new Cryptography().encrypt(secret);
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
    return async (req: LoggedInRequest) => {
        const searchQuery = req.query.q || '';
        
        if(searchQuery) {
            console.log(searchQuery);
        }
    }
}