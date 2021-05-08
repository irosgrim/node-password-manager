import { Request, Response } from 'express';
import { pool } from '../db/connect';
import { getAttachmentsForSecretWithId } from '../db/queries';
import { log } from '../helpers/logging';
import { getPresignedFilesUrl } from '../cloudStorage/cloud';

export const getAttachmentsById = () => {
    return async (req: Request, res: Response) => {
        const secretId = req.params.id;
        const authorisedUser = req.session.authorisedUser;
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