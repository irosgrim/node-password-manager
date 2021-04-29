import express from 'express';
import { deleteFiles } from '../cloudStorage/cloud';
import { pool } from '../db/connect';
import { 
    getSecretWithId, 
    deleteSecretWithId as queryDeleteSecretWithId} from '../db/queries';
import { LoggedInRequest } from '../security/userAuthorisation';

export const deleteSecretWithId = () => {
    return async (req: LoggedInRequest, res: express.Response) => {
        const secretId = req.params.id;
        const authorisedUser = req.authorisedUser;
        if (secretId) {
            try {
                const results = await pool.query(getSecretWithId, [secretId, authorisedUser]);
                if(!results.rows.length) {
                    res.status(404).send('NOT FOUND');
                    return;
                }
                const attachments = results.rows[0].attachments;
                const deleteAttachments = await deleteFiles(attachments);
                const deleteResults = await pool.query(queryDeleteSecretWithId, [secretId, authorisedUser]);
                res.status(200).send('OK!')
            } catch (err) {
                console.log(err);
            }
        }
    }
}