import express from 'express';
import { pool } from '../db/connect';
import { getAllEntries } from '../db/queries';
import { log } from '../helpers/logging';
import { LoggedInRequest } from '../security/userAuthorisation';

export const getAllSecrets = () => {
    return async (req: LoggedInRequest, res: express.Response) => {
        console.log(req.session);
        pool.query(getAllEntries, [req.authorisedUser], async (error, results) => {
            if (error) {
                log.error(error.message, req);
            }
            const rows = results.rows;
            res.send(rows);
            return;
        })
    }
}