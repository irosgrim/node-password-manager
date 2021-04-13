import express from 'express';
import Cryptography from '../crypto/crypto';
import { pool } from '../db/connect';
import { getCryptoKeyForUser, insertNewSecret } from '../db/queries';
import { log } from '../helpers/logging';
import { LoggedInRequest } from '../security/userAuthorisation';
import { uploadSecretAttachments } from './uploadFiles';

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