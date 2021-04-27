require('dotenv').config()
import express from 'express';
import { log } from './helpers/logging';
import { checkAuthorisation } from './security/userAuthorisation';
import { getAllSecrets, getAttachmentsById, getSecretById, postNewSecret, searchSecrets, updateSecret } from './routeHandlers';
import multer from 'multer';

const maxFileSize = 100000;

const temporaryStorage = multer.memoryStorage();
const multerUpload =  multer({storage: temporaryStorage, limits: {fileSize: maxFileSize}}).array('attachments', 10);


const app = express();
const PORT = process.env.PORT || 3000;
app.use(checkAuthorisation());

app.use(express.json());

app.get('/all', getAllSecrets());
app.get('/secret/:id', getSecretById());
app.get('/attachment/:id', getAttachmentsById());
app.get('/search', searchSecrets());
app.post('/new-secret', multerUpload, postNewSecret());
app.patch('/update-secret', multerUpload, updateSecret());


app.listen(PORT, () => log.text(`server 🔥 on port ${PORT}`));
