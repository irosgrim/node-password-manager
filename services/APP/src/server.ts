require('dotenv').config()
import express from 'express';
import { checkAuthorisation } from './security/userAuthorisation';
import { 
    secrets, 
    attachments, 
    search } from './routes';
export const app = express();

app.use(checkAuthorisation());
app.use(express.json());

app.use('/secrets', secrets);
app.use('/attachments', attachments);
app.use('/search', search);
