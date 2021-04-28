import Router from 'express';
import { searchSecrets } from '../routeHandlers';

export const search = Router();

search.get('/', searchSecrets());
