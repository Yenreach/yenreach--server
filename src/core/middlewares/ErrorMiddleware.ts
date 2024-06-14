import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../../core/exceptions/HttpException';
import { logger } from '../utils/logger';
import { HttpCodes } from '../../core/constants'


const errorMiddleware = (error: any, req: Request, res: Response, next: NextFunction) => {
  try {
    const status: number = error.status || HttpCodes.SERVER_ERROR;

    const message: string = error.message || 'Something went wrong';


    const { stack } = error

    res.locals.errorMessage = message

    const response: { status: number; message: string; stack?: string } = {
      status,
      message,
    }

    if (process.env.NODE_ENV === 'development') {
      response.stack = stack
    }

    res.status(status).json({ status, message })

    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);

    res.status(status).json({ message });
  } catch (error) {
    next(error);
  }
};

export { errorMiddleware }
