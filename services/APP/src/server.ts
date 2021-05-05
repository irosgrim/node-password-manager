require('dotenv').config()
import express from 'express';
import session from 'express-session';
import redis from 'redis';
import connectRedis from 'connect-redis';
import { checkAuthorisation } from './security/userAuthorisation';
import { 
    secrets, 
    attachments, 
    search } from './routes';
export const app = express();
const RedisStore = connectRedis(session);

const redisClient = redis.createClient();

app.use(session({
    store: new RedisStore({client: redisClient}),
    secret: 'my deepest s3cr3t!',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 30000
    }
}));

app.use(checkAuthorisation());
app.use(express.json());

app.use('/secrets', secrets);
app.use('/attachments', attachments);
app.use('/search', search);
