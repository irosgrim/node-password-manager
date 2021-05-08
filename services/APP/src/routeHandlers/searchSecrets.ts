import { Request, Response } from 'express';
import { api } from '../api';
import { log } from '../helpers/logging';

export const searchSecrets = () => {
    return async (req: Request, res: Response) => {
        const searchQuery = req.query.q || '';
        const authorisedUser = req.session.authorisedUser;
        if(searchQuery) {
            try {
                const results = await api.searchSecret(searchQuery.toString(), authorisedUser!);
                res.send(results);
            } catch(err) {
                log.error(err.message, req);
            }
        }
    }
}