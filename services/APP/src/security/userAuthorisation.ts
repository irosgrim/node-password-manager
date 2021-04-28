import express from 'express';

export interface LoggedInRequest extends express.Request {
    authorisedUser?: number | null;
}

export const checkAuthorisation = () => {
    return async (req: LoggedInRequest, res: express.Response, next: express.NextFunction) => {
        // const token = req.cookies.token || null;

        // if(!token) {
        //     req.authorisedUser = null;
        //     next();
        // } else {
        //     try {
        //         const tokenInfo = await jwt.verify(token, jwtSecret);
        //         req.authorisedUser = tokenInfo.username;
        //         next();
        //     } catch(err) {
        //         console.log('Bad JWT format');
        //     }
        // }
        const authorisedUser: number | null = 1;

        if(!authorisedUser) {
            res.status(401).send('Please log in!');
            return;
        }

        req.authorisedUser = authorisedUser;
        next();
        
    }
}



// function requestHandler() {
//         return (req, res, next) => {
//             const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
//             req.IP = ip;
//             req.fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
//             console.log('IP: ', req.IP);
//             console.log('URL: ', req.fullUrl);
//             console.log('METHOD: ', req.method);
//             next();
//         }
// }