import { type Request, type Response, type NextFunction } from "express";
import { z, type ZodType } from "zod";

export const validateBody = <T>(schema: ZodType<T>) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    return res.status(422).json({ error: z.treeifyError(result.error) });
  }

  res.locals.validated = result.data as T;
  next();
};
