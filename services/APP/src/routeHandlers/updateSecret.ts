import { Request, Response } from 'express';
import { api } from '../api';
import { log } from '../helpers/logging';

export const updateSecret = () => {
    return async (req: Request, res: Response) => {
        const { secretId, secret, label, icon, category } = req.body;
        const authorisedUser = req.session.authorisedUser;
        if (secretId) {
            try {
                const r = await api.updateSecret({id: secretId, label, secret, icon, category}, authorisedUser!, []);
                res.status(200).send(r);
            } catch (err) {
                log.error(err.message, req);
            }
        }
    }
}