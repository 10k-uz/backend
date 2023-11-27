import { NextFunction, Request, Response } from 'express';

export default (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(`[ERROR]: --> ${req.method}`);
  console.log(`[ORIGINAL_URL]: --> ${req.originalUrl}`);
  console.log(`[MESSAGE]: --> ${error.message}`);

  res.status(500).send({
    errName: 'Internal Server Error',
    message: error.message,
  });
};
