import express from 'express';
import { pool } from '../db/connect';
import { getAllEntries } from '../db/queries';
import { log } from '../helpers/logging';
import { LoggedInRequest } from '../security/userAuthorisation';

interface Entry {
    id: number;
    label: string;
    secret?: any;
    user_id?: number;
    date_created: string, 
    date_modified: string, 
    icon: string, 
    category: string, 
    attachments: string[]
    }

export const getAllSecrets = () => {
    return async (req: LoggedInRequest, res: express.Response) => {
        pool.query(getAllEntries, [req.authorisedUser], async (error, results) => {
            if (error) {
                log.error(error.message, req);
            }
            const rows: Entry[] = results.rows;
            res.send(rows);
            return;
        })
    }
}