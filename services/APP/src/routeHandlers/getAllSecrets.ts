import express, {Request} from 'express';
import { pool } from '../db/connect';
import { getAllEntries } from '../db/queries';
import { log } from '../helpers/logging';

export const getAllSecrets = () => {
    return async (req: Request, res: express.Response) => {
        console.log(req.session);
        pool.query(getAllEntries, [req.session.authorisedUser], async (error, results) => {
            if (error) {
                log.error(error.message, req);
            }
            const rows = results.rows;
            res.send(rows);
            return;
        })
    }
}