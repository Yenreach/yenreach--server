import { Response } from "express";

export const errorResponse = (res: Response, message = 'Something went wrong', statusCode = 500, error: any = {}) => {
  return res.status(statusCode).json({ status: false, message, error })
}
