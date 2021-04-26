import express from 'express';
import { Multer } from 'multer';
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

export async function uploadFiles(authorisedUser: number, files: Express.Multer.File[]) {
    let filePaths: string[] = [];
    for(const file of files) {
        const renamedFile = renameFile(authorisedUser, file.originalname);
        try {
            await minioClient.putObject('testing', renamedFile, file.buffer);
        } catch(err) {
            log.error(err);
        }
        filePaths = [...filePaths, renamedFile];
    }
    return filePaths;
}

export async function getPresignedFilesUrl(files: string[], validityTimeInSeconds: number = 60 * 60): Promise<string[]> {
    let urls: string[] = [];
    for(const file of files) {
        const getPresignedUrl = await minioClient.presignedUrl('GET', 'testing', file, validityTimeInSeconds);
        urls = [...urls, getPresignedUrl];
    }
    return urls;

}

function renameFile(authorisedUser: number, originalName: string): string {
    const timeInMilliseconds = new Date().getTime();
    return timeInMilliseconds +'_' + authorisedUser +'_' + originalName
}

