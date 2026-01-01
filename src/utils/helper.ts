import { Response } from 'express';

export const SUCCESS = (res: Response, meta: { code: number, message: string }, data?: any) => {
  return res.status(meta.code).json({
    success: true,
    ...meta,
    data
  });
};

export const ERROR = (res: Response, error: { statusCode: number, message: string }) => {
  return res.status(error.statusCode).json({
    success: false,
    message: error.message
  });
};