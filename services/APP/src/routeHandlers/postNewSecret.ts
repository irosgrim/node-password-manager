import express from 'express';
import { uploadFiles } from '../cloudStorage/cloud';
import Cryptography from '../crypto/crypto';
import { pool } from '../db/connect';
import { getCryptoKeyForUser, insertNewSecret } from '../db/queries';
import { log } from '../helpers/logging';
import { LoggedInRequest } from '../security/userAuthorisation';

export const postNewSecret = () => {
    return async (req: LoggedInRequest, res: express.Response) => {
        const secret = JSON.stringify(req.body.secret);
        const label = req.body.label;
        const icon = req.body.icon || 'icon';
        const category = req.body.category || 'email';
        const attachments: string[] = [];
        const authorisedUser = req.authorisedUser!;
        const files = req.files;
        console.log(files);
        
        if (secret) {
            let filesPaths: string[] | null = null; 
            if(files.length) {
                 filesPaths = await uploadFiles(authorisedUser, files as Express.Multer.File[]);
            }
            const cryptography = new Cryptography();
            const cryptoKeyForUser = await pool.query(getCryptoKeyForUser, [authorisedUser]);
            const cryptoKey = cryptoKeyForUser.rows[0].key;
            const secretEncrypted = await cryptography.encrypt(secret, cryptoKey);
            try {
                const newSecretResponse = await pool.query(insertNewSecret, [label, secretEncrypted, authorisedUser, icon, category, filesPaths]);
                if(attachments) {
                    const {id, user_id, date_created } = newSecretResponse.rows[0];
                    console.log([id, user_id, date_created]);
                    const millis = new Date(date_created).getTime();
                    // console.log(uploadSecretAttachments(user_id, id, millis, attachments));
                }
                res.send('OK!');
            } catch(err) {
                log.error(err, req);
            }
        }
    }
}


