require('dotenv').config()
import  express, { Request, Response } from 'express';
import session from 'express-session';
import redis from 'redis';
import connectRedis from 'connect-redis';
import { 
    secrets, 
    attachments, 
    search } from './routes';
import { checkAuthorisation, checkSessionTimeout } from './middlewares';
export const app = express();

const RedisStore = connectRedis(session);

const redisClient = redis.createClient();
app.set('trust proxy', 1);
const ONE_MINUTE = 1000 * 60;
const FIVE_MINUTES = ONE_MINUTE * 5;
app.use(session({
    store: new RedisStore({client: redisClient}),
    name: 'SID',
    secret: 'my deepest s3cr3t!',
    resave: true,
    rolling: true,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: FIVE_MINUTES,
    }
}));
app.use(checkSessionTimeout);
app.use(express.json());

app.get('/cookie', (req: Request,res: Response) => {
    req.session.authorisedUser = 1;
    req.session.createdAt = Date.now();
    res.send('cookie');
});

app.use(checkAuthorisation);
app.use('/secrets', secrets);
app.use('/attachments', attachments);
app.use('/search', search);
