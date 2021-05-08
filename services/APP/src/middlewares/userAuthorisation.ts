import express, { Request }from 'express';

export const checkAuthorisation = async (req: Request, res: express.Response, next: express.NextFunction) => {
        if(!req.session.authorisedUser) {
            res.status(401).send('Please log in!');
            return;
        }
        next();
    }
