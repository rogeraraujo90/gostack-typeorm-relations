import 'express-async-errors';
import { Request, NextFunction, Response } from 'express';
import AppError from '@shared/errors/AppError';
import app from './app';

app.use(
  (error: Error, request: Request, response: Response, _: NextFunction) => {
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        status: 'Error',
        message: error.message,
      });
    }

    console.log(error);

    return response.status(500).json({
      status: 'Error',
      message: 'Internal Server Error',
    });
  },
);

app.listen(3333, () => {
  console.log('🚀 Server started on port 3333!');
});
