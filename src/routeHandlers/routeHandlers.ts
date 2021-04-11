import Cryptography from '../crypto/crypto';
import { pool } from '../db/connect';
import { getAllEntries, getCryptoKeyForUser, getSecretWithId, insertNewSecret, search, updateSpecificSecret } from '../db/queries';
import { log } from '../helpers/logging';
import { LoggedInRequest } from '../security/userAuthorisation';
import express from 'express';


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
        const icon = req.body.icon || 'icon';
        const category = req.body.category || 'email';
        const attachments = req.body.attachments || null;
        const authorisedUser = req.authorisedUser!;
    
        if (secret) {
            const cryptography = new Cryptography();
            const cryptoKeyForUser = await pool.query(getCryptoKeyForUser, [authorisedUser]);
            const cryptoKey = cryptoKeyForUser.rows[0].key;
            const secretEncrypted = await cryptography.encrypt(secret, cryptoKey);
            try {
                const newSecretResponse = await pool.query(insertNewSecret, [label, secretEncrypted, authorisedUser, icon, category]);
                if(attachments) {
                    const {id, user_id, date_created } = newSecretResponse.rows[0];
                    console.log([id, user_id, date_created]);
                    const millis = new Date(date_created).getTime();
                    console.log(uploadSecretAttachments(user_id, id, millis, attachments));
                }
                res.send('OK!');
            } catch(err) {
                log.error(req, err);
            }
        }
    }
}

export const updateSecret = () => {
    return async (req: LoggedInRequest, res: express.Response) => {
        const secretId = req.body.secretId;
        const secret = JSON.stringify(req.body.secret);
        const label = req.body.label;
        const icon = req.body.icon || 'icon';
        const category = req.body.category || 'email';
        const attachments = req.body.attachments || null;
        const authorisedUser = req.authorisedUser;
    
        if (secretId) {
            const cryptography = new Cryptography();
            const cryptoKeyForUser = await pool.query(getCryptoKeyForUser, [authorisedUser]);
            const cryptoKey = cryptoKeyForUser.rows[0].key;
            const secretEncrypted = await cryptography.encrypt(secret, cryptoKey);
            try {
                const updateQuery = await pool.query(updateSpecificSecret, [label, secretEncrypted, icon, category, attachments, authorisedUser, secretId]);
                if(updateQuery.rows.length) {
                    const response = {
                        id : secretId, 
                        label, 
                        secret: req.body.secret,
                        date_created: updateQuery.rows[0].date_created,
                        date_modified: updateQuery.rows[0].date_modified,
                        icon,
                        category
                    };
                    res.send(response);
                } else {
                    res.status(400).send('NOT OK!');
                }
            } catch(err) {
                log.error(req, err);
                res.status(500).send('NOT OK!');
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
            res.send(rows);
            return;
        })
    }
}

function uploadSecretAttachments(userId: number, secretId: number, dateCreatedMillis:  number, attachments: string[]) {
    return [userId + '/' + secretId + '_' + dateCreatedMillis + '_' + 'path_to_uploaded_file.ext'];
}