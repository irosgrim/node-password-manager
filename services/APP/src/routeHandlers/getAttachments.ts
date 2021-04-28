import { LoggedInRequest } from '../security/userAuthorisation';
import express from 'express';
import { pool } from '../db/connect';
import { getAttachmentsForSecretWithId } from '../db/queries';
import { log } from '../helpers/logging';
import { getPresignedFilesUrl } from '../cloudStorage/cloud';

export const getAttachmentsById = () => {
    return async (req: LoggedInRequest, res: express.Response) => {
        const secretId = req.params.id;
        const authorisedUser = req.authorisedUser;
        if (secretId) {
            try {
                const results = await pool.query(getAttachmentsForSecretWithId, [secretId, authorisedUser]);
                if(results.rows.length) {
                    const attachments = results.rows[0].attachments;
                    const urls = await getPresignedFilesUrl(attachments, 600);
                    res.send(urls);
                }
            } catch (error) {
                log.error(error.message, req);
            }
        } else {
            res.status(400).send();
        }
    }
}