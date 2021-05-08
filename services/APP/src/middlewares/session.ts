import { NextFunction, Request, Response } from 'express';
import { log } from '../helpers/logging';
import { ONE_DAY } from '../helpers/time';
const SESSION_TIMEOUT = 2 * ONE_DAY;

export const checkSessionTimeout = async (req: Request, res: Response, next: NextFunction) => {
    if(req.session.authorisedUser) {
        const now = Date.now();
        if(now > req.session.createdAt! + SESSION_TIMEOUT) {
            req.session.destroy((err) => {
                log.error(err.message);
            });
            res.status(401).send('Please log in!');
            return;
        }
    }
    next();
}