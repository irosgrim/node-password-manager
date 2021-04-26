import express from 'express';
import Cryptography from '../crypto/crypto';
import { pool } from '../db/connect';
import { getCryptoKeyForUser, updateSpecificSecret } from '../db/queries';
import { log } from '../helpers/logging';
import { LoggedInRequest } from '../security/userAuthorisation';
import { status } from '../helpers/responseStatusHandler';

export const updateSecret = () => {
    return async (req: LoggedInRequest, res: express.Response) => {
        const secretId = req.body.secretId;
        const secret = JSON.stringify(req.body.secret);
        const label = req.body.label;
        const icon = req.body.icon || 'icon';
        const category = req.body.category || 'email';
        const attachments = req.body.attachments || null;
        const files = req.files;
        const authorisedUser = req.authorisedUser;
    
        console.log(req.files);
        if (secretId) {
            const cryptography = new Cryptography();
            const cryptoKeyForUser = await pool.query(getCryptoKeyForUser, [authorisedUser]);
            const cryptoKey = cryptoKeyForUser.rows[0].key;
            const secretEncrypted = await cryptography.encrypt(secret, cryptoKey);
            try {
                const updateQueryResponse = await pool.query(updateSpecificSecret, [label, secretEncrypted, icon, category, attachments, authorisedUser, secretId]);
                if(updateQueryResponse.rows.length) {
                    const updateResponse = updateQueryResponse.rows[0];
                    const response = {
                        id : secretId, 
                        label, 
                        secret: req.body.secret,
                        date_created: updateResponse.date_created,
                        date_modified: updateResponse.date_modified,
                        icon,
                        category,
                        attachments: updateResponse.attachments
                    };
                    res.send(response);
                } else {
                    res.status(400).send(status.notOk);
                }
            } catch(err) {
                log.error(err, req);
                res.status(500).send(status.notOk);
            }
        }
    }
}