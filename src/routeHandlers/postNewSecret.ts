import express from 'express';
import Cryptography from '../crypto/crypto';
import { pool } from '../db/connect';
import { getCryptoKeyForUser, insertNewSecret } from '../db/queries';
import { log } from '../helpers/logging';
import { LoggedInRequest } from '../security/userAuthorisation';
import { uploadSecretAttachments } from './uploadFiles';
const Minio = require('minio');

const minioClient = new Minio.Client({
    endPoint: process.env.S3_ENDPOINT,
    port: parseInt(process.env.S3_PORT!) || 9000,
    useSSL: false,
    accessKey: process.env.S3_ACCESS_KEY,
    secretKey: process.env.S3_SECRET_KEY
})

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

       if(files.length) {
        files.forEach(file => {
            const timeInMilliseconds = new Date().getTime();
            const renamedFile = timeInMilliseconds +'_' + authorisedUser +'_' + file.originalname;
            minioClient.putObject('testing', renamedFile, file.buffer, (error, etag) => {
                if(error) {
                    return log.error(req, error);
                }
                console.log('upload succesful!');
            });

            minioClient.presignedUrl('GET', 'testing', renamedFile, 60*60*24, (err, presignedUrl) => {
                if (err) {
                    return console.log(err)
                }
                console.log(presignedUrl)
              })
        })
       }
    
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