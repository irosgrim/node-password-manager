require('dotenv').config()
import express from 'express';
import { log } from './helpers/logging';
import { checkAuthorisation } from './security/userAuthorisation';
import { getAllSecrets, getSecretById, postNewSecret, searchSecrets } from './routeHandlers/routeHandlers';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', checkAuthorisation(), getAllSecrets())
app.get('/secret/:id', checkAuthorisation(), getSecretById());
app.get('/search', checkAuthorisation(), searchSecrets())

app.post('/secret', checkAuthorisation(), postNewSecret())

app.listen(PORT, () => log.text(`server 🔥 on port ${PORT}`));
