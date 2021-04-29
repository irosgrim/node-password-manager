import express from 'express';
import Cryptography from '../crypto/crypto';
import { LoggedInRequest } from '../security/userAuthorisation';
import { pool } from '../db/connect';
import { getCryptoKeyForUser, getSecretWithId } from '../db/queries';
import { log } from '../helpers/logging';

export const getSecretById = () => {
    return async (req: LoggedInRequest, res: express.Response) => {
        const secretId = req.params.id;
        const authorisedUser = req.authorisedUser;
        if (secretId) {
            try {
                const cryptoKeyForUser = pool.query(getCryptoKeyForUser, [authorisedUser]);
                const resultsQueryPromise = pool.query(getSecretWithId, [secretId, authorisedUser]);
                const [results, cryptoKey] = await Promise.all([resultsQueryPromise, cryptoKeyForUser]);
                if(!results.rows.length) {
                    res.status(404).send('NOT FOUND!');
                    return;
                }
                const _cryptoKey = cryptoKey.rows[0].key;
                const decryptedData = results.rows.map((entry) => {
                    const secretData = new Cryptography().decrypt(entry.secret, _cryptoKey);
                    return {
                        ...entry,
                        secret: JSON.parse(secretData),
                    };
                });
                res.send(decryptedData[0]);
            } catch (error) {
                log.error('getSecretById: ' + error.message, req);
            }
        } else {
            res.status(400).send();
        }
    }
}