import { Response } from 'express';
export const ok      = <T>(res: Response, data: T, message?: string, status = 200) =>
  res.status(status).json({ success: true, data, ...(message ? { message } : {}) });
export const created = <T>(res: Response, data: T, message?: string) => ok(res, data, message, 201);
export const badRequest  = (res: Response, error: string, details?: object) =>
  res.status(400).json({ success: false, error, code: 'BAD_REQUEST', ...( details ? { details } : {}) });
export const unauthorized = (res: Response, error = 'Unauthorized') =>
  res.status(401).json({ success: false, error, code: 'UNAUTHORIZED' });
export const forbidden  = (res: Response, error = 'Forbidden') =>
  res.status(403).json({ success: false, error, code: 'FORBIDDEN' });
export const notFound   = (res: Response, error = 'Not found') =>
  res.status(404).json({ success: false, error, code: 'NOT_FOUND' });
export const serverError = (res: Response, error = 'Internal server error') =>
  res.status(500).json({ success: false, error, code: 'INTERNAL_ERROR' });
