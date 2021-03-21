require('dotenv').config()
import express from 'express';
import { pool } from './db/connect';
import { log } from './helpers/logging';
import { checkAuthorisation } from './security/userAuthorisation';
import { getSecretById, postNewSecret, searchSecrets } from './routeHandlers/routeHandlers';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const getAll = `SELECT * FROM wallet`;

interface Entry {
    id: number;
    label: string;
    secret: string;
    user_id: number;
}

app.get('/', checkAuthorisation(), (req, res) => {
    pool.query(getAll, async (error, results) => {
        if (error) {
            log.error(req, error);
        }
        const rows: Entry[] = results.rows;
        log.info(req, rows);
        res.send(rows);
        return;
    })
})

app.get('/secret/:id', checkAuthorisation(), getSecretById());

app.get('/search', checkAuthorisation(), searchSecrets())

app.post('/secret', checkAuthorisation(), postNewSecret())

app.listen(PORT, () => log.text(`server 🔥 on port ${PORT}`));
