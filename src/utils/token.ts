import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import prisma from './prisma';
import { REFRESH_SECRET, JWT_SECRET , NODE_ENV} from '../config/env';

// HMAC for refresh tokens
export const hmac = (raw: string) =>
  crypto.createHmac('sha256', REFRESH_SECRET).update(raw).digest('hex');

// Short-lived access token
export function genAccessToken(payload: { userId: string }) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '15m',
    jwtid: crypto.randomUUID(),
  });
}

// Create refresh token row in DB
export async function createRefreshTokenRow(userId: string, days = 30) {
  const rand = crypto.randomBytes(48).toString('hex');
  const raw = `${userId}.${rand}`;
  const tokenHash = hmac(raw);
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  await prisma.refreshToken.create({
    data: { tokenHash, userId, expiresAt },
  });

  return { raw, expiresAt };
}

// Set refresh token cookie
export function setRefreshCookie(res: any, raw: string, expiresAt: Date) {
  res.cookie('taskify_refresh', raw, {
    httpOnly: true,
    secure:NODE_ENV === "production",
    sameSite: 'lax',
    maxAge: expiresAt.getTime() - Date.now(),
    path: '/api',
  });
}

// Verify refresh token from raw value
export async function verifyRefreshToken(raw: string) {
  const tokenHash = hmac(raw);
  const token = await prisma.refreshToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });
  if (!token || token.expiresAt < new Date()) return null;
  return token;
}
