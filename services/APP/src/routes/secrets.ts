import Router from 'express';
import multer from 'multer';
import { 
    getAllSecrets, 
    getSecretById, 
    deleteSecretWithId, 
    updateSecret, 
    postNewSecret } from '../routeHandlers';
export const secrets = Router();

const maxFileSize = 100000;
const temporaryStorage = multer.memoryStorage();
const multerUpload =  multer({storage: temporaryStorage, limits: {fileSize: maxFileSize}}).array('attachments', 10);

secrets.get('/', getAllSecrets());
secrets.get('/:id', getSecretById());
secrets.post('/new', multerUpload, postNewSecret());
secrets.patch('/update', multerUpload, updateSecret())
secrets.delete('/delete/:id', deleteSecretWithId());