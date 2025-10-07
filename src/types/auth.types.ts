// src/types/auth.types.ts
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
  };
}