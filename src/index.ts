require('dotenv').config()
import express from 'express';
import { log } from './helpers/logging';
import { checkAuthorisation } from './security/userAuthorisation';
import { getAllSecrets, getSecretById, postNewSecret, searchSecrets, updateSecret } from './routeHandlers';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(checkAuthorisation());

app.use(express.json());

app.get('/all', getAllSecrets());
app.get('/secret/:id', getSecretById());
app.get('/search', searchSecrets());
app.post('/new-secret', postNewSecret());
app.patch('/update-secret', updateSecret());


app.listen(PORT, () => log.text(`server 🔥 on port ${PORT}`));
