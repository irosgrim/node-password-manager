import Router from 'express';
import { getAttachmentsById } from '../routeHandlers';
export const attachments = Router();

attachments.get('/:id', getAttachmentsById());