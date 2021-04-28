require('dotenv').config()
import express from 'express';
import { log } from './helpers/logging';
import { checkAuthorisation } from './security/userAuthorisation';
import { 
    secrets, 
    attachments, 
    search } from './routes';
const app = express();
const PORT = process.env.PORT || 3000;

app.use(checkAuthorisation());
app.use(express.json());

app.use('/secrets', secrets);
app.use('/attachments', attachments);
app.use('/search', search);

app.listen(PORT, () => log.text(`server 🔥 on port ${PORT}`));
