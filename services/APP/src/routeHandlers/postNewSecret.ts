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
        const authorisedUser = req.authorisedUser!;
        const files = req.files;
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
                await pool.query(insertNewSecret, [label, secretEncrypted, authorisedUser, icon, category, filesPaths]);
                res.send('OK!');
            } catch(error) {
                log.error(error.message, req);
            }
        }
    }
}


