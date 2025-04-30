import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';
import { HttpCodes } from '../../core/constants';
import { ZodError } from 'zod';

const errorMiddleware = (error: any, req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if the error is a ZodError (validation error)
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.map(e => ({
        field: e.path.join('.'), // Joins path elements to create a clear field name
        message: e.message, // The validation error message
      }));

      // Log the Zod validation error
      logger.error(`[${req.method}] ${req.path} >> Validation Error: ${JSON.stringify(formattedErrors)}`);

      return res.status(HttpCodes.BAD_REQUEST).json({
        status: HttpCodes.BAD_REQUEST,
        message: 'Validation failed',
        errors: formattedErrors,
      });
    }

    console.log(error);

    const status: number = error.status || HttpCodes.SERVER_ERROR;

    const message: string = error.message || 'Something went wrong';

    const { stack } = error;

    res.locals.errorMessage = message;

    const response: { status: number; message: string; stack?: string } = {
      status,
      message,
    };

    if (process.env.NODE_ENV === 'development') {
      response.stack = stack;
    }

    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);

    res.status(status).json({ status, message });
  } catch (error) {
    // next(error);
    res.status(500).json(error);
  }
};

export { errorMiddleware };
