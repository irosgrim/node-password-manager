import express from 'express';

class LogHandler {

    error(req: express.Request, err: Error) {
        const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        console.log('URL: ', fullUrl)
        console.log('METHOD: ', req.method);
        console.log('DATE: ', new Date());
        console.log('ERROR: ', err.message);
    }

    info(req: express.Request, log: any) {
        const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        console.log('URL: ', fullUrl);
        console.log('METHOD: ', req.method);
        console.log('DATE: ', new Date());
        console.log('LOG: ', log);
    }

    text(log: any) {
        console.log(log);
    }
}

export const log = new LogHandler();