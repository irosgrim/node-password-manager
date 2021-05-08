import { Request, Response} from 'express';
import { api } from '../api';
import { log } from '../helpers/logging';

export const getSecretById = () => {
    return async (req: Request, res: Response) => {
        const secretId = +req.params.id;
        const authorisedUser = +req.session.authorisedUser!;
        if (secretId) {
            try {
                const r = await api.getSecretById(secretId, authorisedUser);
                if(!r) {
                    res.status(404).send('NOT FOUND!');
                    return;
                }
                res.send(r);
            } catch (err) {
                log.error(err.message, req)
            }
        } else {
            res.status(400).send();
        }
    }
}