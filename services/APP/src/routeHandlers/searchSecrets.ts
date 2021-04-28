import express from 'express';
import { pool } from '../db/connect';
import { search } from '../db/queries';
import { log } from '../helpers/logging';
import { LoggedInRequest } from '../security/userAuthorisation';

export const searchSecrets = () => {
    return async (req: LoggedInRequest, res: express.Response) => {
        const searchQuery = req.query.q || '';
        const authorisedUser = req.authorisedUser;
        console.log(searchQuery);
        
        if(searchQuery) {
            try {
                const results = await pool.query(search, [searchQuery, authorisedUser]);
                res.send(results.rows);
            } catch(error) {
                log.error('db search secrets: ' + error.message, req);
            }
        }
    }
}