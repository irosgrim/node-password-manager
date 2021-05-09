import { Request, Response } from 'express';
import { api } from '../api';

export const login = () => {
    return async (req: Request, res: Response) => {
        const { username, password }  = req.body;
        if(req.session.authorisedUser) {
            res.status(400).send('ALREADY LOGGED IN!');
            return;
        }
        const required  = [
            {label: 'username', value: username}, 
            {label: 'password', value: password},
        ].reduce((arr: string[], current) => {
            if(!current.value) {
                arr = [...arr, current.label];
            }
            return arr;
        }, []);
        if(required.length) {
            res.status(400).send({required});
            return;
        }
        const r = await api.checkCredentials({username, password});
        if(!r) {
            res.status(403).send('INVALID USERNAME OR PASSWORD!');
            return;
        }
        req.session.authorisedUser = r!;
        req.session.createdAt = Date.now();
        res.send('Logged in!');
    }
}