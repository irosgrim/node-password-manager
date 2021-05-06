require('dotenv').config()
import  express, {Request, Response, NextFunction } from 'express';
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
app.set('trust proxy', 1);
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
        maxAge: 30000
    }
}));

app.use(express.json());
app.get('/cookie', (req: Request,res: Response) => {
    req.session.authorisedUser = 1;
    res.send('cookie');
});
app.use('/secrets', checkAuthorisation(), secrets);
app.use('/attachments', checkAuthorisation(), attachments);
app.use('/search', checkAuthorisation(), search);
