import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  public readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err.name === 'ZodError') {
    return res.status(400).json({ message: 'Validation Error', errors: err.errors });
  }

  console.error('Unhandled Error:', err);
  return res.status(500).json({ message: 'Internal Server Error' });
};
