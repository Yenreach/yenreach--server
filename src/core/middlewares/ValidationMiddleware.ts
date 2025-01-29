import { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { RequestHandler } from 'express';
import { HttpException } from '../../core/exceptions/HttpException';
import { HttpCodes } from '../../core/constants'
import { AnyZodObject } from 'zod';

const validateRequest =
  (schemas: AnyZodObject[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
     schemas?.map(schema => {
      const validObj = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      })
        req.body = validObj.body ? { ...req.body, ...validObj.body } : {}
        req.query = validObj.query ?  { ...req.query, ...validObj.query } : {}
        req.params = validObj.params ?  { ...req.params, ...validObj.params }: {}
      }
    );
   
      next();
    } catch (e: any) {
      console.log({ body: req.body })

        res.status(400).json({
            success: false,
            message: e?.errors && e.errors.length > 0
            ? e.errors[0]?.message
            : 'Unknown error',
            errors: e
        });
        
    }
};


const validationMiddleware = (
  type: any,
  value: string | 'body' | 'query' | 'params' = 'body',
  skipMissingProperties = false,
  whitelist = true,
  forbidNonWhitelisted = true,
): RequestHandler => {
  return (req, res, next) => {
    validate(plainToInstance(type, req[value]), { skipMissingProperties, whitelist, forbidNonWhitelisted }).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const message = errors.map((error: ValidationError) => Object.values(error.constraints)).join(', ');
        next(new HttpException(HttpCodes.BAD_REQUEST, message));
      } else {
        next();
      }
    });
  };
};


export { validateRequest, validationMiddleware }
