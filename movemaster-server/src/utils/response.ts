import { Response } from 'express';
import type { ApiSuccess, ApiError } from '../models/types';

export function ok<T>(res: Response, data: T, message?: string, status = 200): Response {
  const body: ApiSuccess<T> = { success: true, data };
  if (message) body.message = message;
  return res.status(status).json(body);
}

export function created<T>(res: Response, data: T, message?: string): Response {
  return ok(res, data, message, 201);
}

export function paginated<T>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  perPage: number
): Response {
  const body: ApiSuccess<T[]> = {
    success: true,
    data,
    meta: {
      total,
      page,
      perPage,
      pages: Math.ceil(total / perPage),
    },
  };
  return res.status(200).json(body);
}

export function badRequest(res: Response, error: string, details?: Record<string, string[]>): Response {
  const body: ApiError = { success: false, error, code: 'BAD_REQUEST' };
  if (details) body.details = details;
  return res.status(400).json(body);
}

export function unauthorized(res: Response, error = 'Unauthorized'): Response {
  return res.status(401).json({ success: false, error, code: 'UNAUTHORIZED' } as ApiError);
}

export function forbidden(res: Response, error = 'Forbidden'): Response {
  return res.status(403).json({ success: false, error, code: 'FORBIDDEN' } as ApiError);
}

export function notFound(res: Response, error = 'Not found'): Response {
  return res.status(404).json({ success: false, error, code: 'NOT_FOUND' } as ApiError);
}

export function conflict(res: Response, error: string): Response {
  return res.status(409).json({ success: false, error, code: 'CONFLICT' } as ApiError);
}

export function serverError(res: Response, error = 'Internal server error'): Response {
  return res.status(500).json({ success: false, error, code: 'INTERNAL_ERROR' } as ApiError);
}
