import Cryptography from '../crypto/crypto';
import { LoggedInRequest } from '../security/userAuthorisation';
import express from 'express';
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

                const _cryptoKey = cryptoKey.rows[0].key;
                const decryptedData = results.rows.map((entry) => {
                    const secretData = new Cryptography().decrypt(entry.secret, _cryptoKey);
                    return {
                        id: entry.id,
                        label: entry.label,
                        secret: secretData,
                        date_created: entry.date_created,
                        date_modified: entry.date_modified,
                        icon: entry.icon,
                        category: entry.category,
                        attachments: entry.attachments
                    };
                });
                res.send(decryptedData);
            } catch (err) {
                log.error(err, req);
            }
        } else {
            res.status(400).send();
        }
    }
}