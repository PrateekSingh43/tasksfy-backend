// src/auth/services/auth.services.ts
import prisma from "../../utils/prisma";
import { hashPassword, verifyPassword } from "../../utils/hash";
import { genAccessToken, createRefreshTokenRow, setRefreshCookie, verifyRefreshToken } from "../../utils/token";
import { Prisma } from "@prisma/client";
import { rotate } from "../../config/env";

import { Response } from "express";

export async function signupService(payload: { email: string; password: string; name?: string }, res: any, opts?: { autoLogin?: boolean }) {
	const { email, password, name } = payload;
	const passwordHash = await hashPassword(password);

	try {
		const user = await prisma.user.create({
			data: { email, name, passwordHash },
			select: { id: true, email: true, name: true },
		});

		if (opts?.autoLogin) {
			const accessToken = genAccessToken({ userId: user.id });
			const { raw, expiresAt } = await createRefreshTokenRow(user.id);
			setRefreshCookie(res, raw, expiresAt);
			return { user, accessToken };
		}

		return { user };
	} catch (err: any) {
		if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
			throw { status: 409, message: "Email already in use" };
		}
		throw err;
	}
}

export async function loginService(payload: { email: string; password: string }, res: any ) {
	const { email, password } = payload;

	const user = await prisma.user.findUnique({ where: { email } });
	if (!user || !user.passwordHash) throw { status: 400, message: "Invalid credentials" };

	const ok = await verifyPassword(user.passwordHash, password);
	if (!ok) throw { status: 400, message: "Invalid credentials" };

	const accessToken = genAccessToken({ userId: user.id });
	const { raw, expiresAt } = await createRefreshTokenRow(user.id);
	setRefreshCookie(res, raw, expiresAt);

	return { user: { id: user.id, email: user.email, name: user.name }, accessToken };
}


// refersh Service 

export async function refreshTokenService(rawToken: string, res: any, rotate: boolean ) {
	// 1. Verify existing refresh token
	const token = await verifyRefreshToken(rawToken);
	if (!token) throw { status: 401, message: 'Invalid or expired refresh token' };

	const userId = token.userId;

	// 2. Generate new access token
	const accessToken = genAccessToken({ userId });

	// 3. Optional rotation: generate new refresh token and delete old one
	if (rotate) {
		const { raw, expiresAt } = await createRefreshTokenRow(userId);
		await prisma.refreshToken.delete({ where: { id: token.id } });
		setRefreshCookie(res, raw, expiresAt);
	}

	return { accessToken, user: { id: token.user.id, email: token.user.email } };
}


// logoutService 

export async function logoutService(userId: string, res: Response) {
  await prisma.refreshToken.deleteMany({ where: { userId } });
  res.clearCookie('taskify_refresh', { path: '/api' });
}