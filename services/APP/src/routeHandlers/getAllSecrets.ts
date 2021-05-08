import { Request, Response } from 'express';
import { log } from '../helpers/logging';
import { api } from '../api';

export const getAllSecrets = () => {
    return async (req: Request, res: Response) => {
        const authorisedUser = req.session.authorisedUser;
        try {
            const allSecrets = await api.getAllSecrets(authorisedUser!);
            res.send(allSecrets);
        } catch (err) {
            log.error(err.message, req);
        }
    }
}