import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { badRequest } from '../utils/response';

export function validate(req: Request, res: Response, next: NextFunction): void {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const details: Record<string, string[]> = {};
    errors.array().forEach((e) => {
      const field = 'path' in e ? String(e.path) : 'general';
      if (!details[field]) details[field] = [];
      details[field].push(e.msg);
    });
    badRequest(res, 'Validation failed', details);
    return;
  }
  next();
}
