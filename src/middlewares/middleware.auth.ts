// src/middlewares/middleware.auth.ts
import { NextFunction, Request, Response } from "express"; // Import Request
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";
import { AuthenticatedRequest } from "../types/auth.types"; // Keep this import

export default function authMiddleware(req: Request, res: Response, next: NextFunction) {
	const auth = req.headers.authorization?.split(" ");
	if (!auth || auth[0] !== "Bearer") return res.status(401).json({ message: "Missing token" });

	try {
		const payload = jwt.verify(auth[1], JWT_SECRET) as JwtPayload & { userId: string };
		// Use a type assertion to assign the user property
		(req as AuthenticatedRequest).user = { id: payload.userId };
		next();
	} catch {
		return res.status(401).json({ message: "Invalid or expired token" });
	}
}