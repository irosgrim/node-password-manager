import { Request, Response} from 'express';
import { uploadFiles } from '../cloudStorage/cloud';
import Cryptography from '../crypto/crypto';
import { pool } from '../db/connect';
import { getCryptoKeyForUser, insertNewSecret } from '../db/queries';
import { api } from '../api';
import { log } from '../helpers/logging';

export const postNewSecret = () => {
    return async (req: Request, res: Response) => {
        const { secret, label, icon, category }  = req.body;
        const authorisedUser = req.session.authorisedUser!;
        const files = req.files;
        if (secret && label) {
            try {
                const filesPaths = await uploadFiles(authorisedUser, files as Express.Multer.File[]);
                const newSecret = await api.newSecret({secret, label, icon, category}, authorisedUser, filesPaths);
                return res.status(200).send(newSecret);
            } catch (err) {
                log.error(err.message, req);
            }
        }
    }
}


