import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

// const validateRequest = (schemas: AnyZodObject[]) => (req: Request, res: Response, next: NextFunction) => {
//   try {
//     schemas?.map(schema => {
//       const validObj = schema.parse({
//         body: req.body,
//         query: req.query,
//         params: req.params,
//       });
//       req.body = validObj.body ? { ...req.body, ...validObj.body } : {};
//       req.query = validObj.query ? { ...req.query, ...validObj.query } : {};
//       req.params = validObj.params ? { ...req.params, ...validObj.params } : {};
//     });

//     next();
//   } catch (e: any) {
//     console.log({ body: req.body });

//     res.status(400).json({
//       success: false,
//       message: e?.errors && e.errors.length > 0 ? e.errors[0]?.message : 'Unknown error',
//       errors: e,
//     });
//   }
// };

const validateRequest = (schemas: AnyZodObject[]) => (req: Request, res: Response, next: NextFunction) => {
  try {
    for (const schema of schemas) {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (parsed.body) req.body = { ...req.body, ...parsed.body };
      if (parsed.query) req.query = { ...req.query, ...parsed.query };
      if (parsed.params) req.params = { ...req.params, ...parsed.params };
    }

    next();
  } catch (e) {
    next(e);
  }
};

export { validateRequest };
