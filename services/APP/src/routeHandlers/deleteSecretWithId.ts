import { Request, Response} from 'express';
import { api } from '../api';
import { log } from '../helpers/logging';

export const deleteSecretWithId = () => {
    return async (req: Request, res: Response) => {
        const secretId = +req.params.id;
        const authorisedUser = req.session.authorisedUser;
        if (secretId) {
            try {
                const r = await api.deleteSecret(secretId, authorisedUser!)
                res.status(200).send(r);
            } catch (err) {
                log.error(err.message, req);
            }
        }
    }
}