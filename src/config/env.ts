import dotenv from "dotenv";
dotenv.config();
import { z } from "zod";



const envSchema = z.object({
  PORT: z.string().optional().transform((val) => Number(val) || 5000),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  REFRESH_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().optional().default("7d"),
  MAIL_USER: z.string(),
  MAIL_PASS: z.string(),
  CLIENT_URL: z.string(),
  ROTATE_REFRESH_TOKEN: z.string().transform((val) => val === "true"), 
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_CALLBACK_URL: z.string(),
});

const parsedEnv = envSchema.parse(process.env);

export const port: number = parsedEnv.PORT;
export const databaseUrl: string = parsedEnv.DATABASE_URL;
export const JWT_SECRET: string = parsedEnv.JWT_SECRET;
export const REFRESH_SECRET: string = parsedEnv.REFRESH_SECRET;
export const jwtExpiresIn: string = parsedEnv.JWT_EXPIRES_IN;
export const mailUser: string = parsedEnv.MAIL_USER;
export const mailPass: string = parsedEnv.MAIL_PASS;
export const clientUrl: string = parsedEnv.CLIENT_URL;
export const rotate: boolean = parsedEnv.ROTATE_REFRESH_TOKEN;
export const googleClientId: string = parsedEnv.GOOGLE_CLIENT_ID;
export const googleClientSecret: string = parsedEnv.GOOGLE_CLIENT_SECRET;
export const googleCallbackUrl: string = parsedEnv.GOOGLE_CALLBACK_URL;
