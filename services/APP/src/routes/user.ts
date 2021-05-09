import Router from 'express';
import { login, logout } from '../routeHandlers';
export const user = Router();

user.post('/login', login());
user.get('/logout', logout());
