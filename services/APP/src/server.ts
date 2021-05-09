require('dotenv').config()
import  express from 'express';
import session from 'express-session';
import redis from 'redis';
import connectRedis from 'connect-redis';
import { 
    secrets, 
    attachments, 
    search, 
    user } from './routes';
import { checkAuthorisation, checkSessionTimeout } from './middlewares';
import { ONE_MINUTE } from './helpers/time';
export const app = express();
const RedisStore = connectRedis(session);
const redisClient = redis.createClient();

app.use(express.json());
app.set('trust proxy', 1);

app.use(session({
    store: new RedisStore({client: redisClient}),
    name: 'SID',
    secret: process.env.REDIS_SECRET || 'D33pesTSeKr3tT',
    resave: true,
    rolling: true,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: ONE_MINUTE * 5,
    }
}));
app.use(checkSessionTimeout);
app.use('/user', user);

app.use(checkAuthorisation);
app.use('/secrets', secrets);
app.use('/attachments', attachments);
app.use('/search', search);
