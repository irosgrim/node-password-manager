import { Request, Response } from 'express';
import { log } from '../helpers/logging';

export const logout = () => {
    return (req: Request, res: Response) => {
    if(req.session.authorisedUser) {
        req.session.destroy((err) => {
            if(err) {
                log.error(err.message, req);
                return;
            }
        })
    }
    res.status(200).send('LOGGED OUT!');
    return;
    }
}