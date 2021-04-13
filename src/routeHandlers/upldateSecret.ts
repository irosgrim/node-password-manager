import express from 'express';
import Cryptography from '../crypto/crypto';
import { pool } from '../db/connect';
import { getCryptoKeyForUser, updateSpecificSecret } from '../db/queries';
import { log } from '../helpers/logging';
import { LoggedInRequest } from '../security/userAuthorisation';

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
                const updateQueryResponse = await pool.query(updateSpecificSecret, [label, secretEncrypted, icon, category, attachments, authorisedUser, secretId]);
                if(updateQueryResponse.rows.length) {
                    const response = {
                        id : secretId, 
                        label, 
                        secret: req.body.secret,
                        date_created: updateQueryResponse.rows[0].date_created,
                        date_modified: updateQueryResponse.rows[0].date_modified,
                        icon,
                        category,
                        attachments: updateQueryResponse.rows[0].attachments
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