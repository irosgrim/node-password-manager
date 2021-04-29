import express from 'express';

class LogHandler {

    private getFullUrl(req: express.Request): string {
        const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        return fullUrl;
    }

    error(errMessage: string, req?: express.Request) {
        if(req) {
            console.log('URL: ', this.getFullUrl(req))
            console.log('METHOD: ', req.method);
        }
        console.log('DATE: ', new Date());
        console.log('ERROR: ', errMessage);
    }

    info(log: any, req?: express.Request) {
        if(req) {
            console.log('URL: ', this.getFullUrl(req));
            console.log('METHOD: ', req.method);
        }
        console.log('DATE: ', new Date());
        console.log('LOG: ', log);
    }

    text(log: any) {
        console.log(log);
    }
}

export const log = new LogHandler();