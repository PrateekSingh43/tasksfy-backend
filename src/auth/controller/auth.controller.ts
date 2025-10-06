// src/auth/controller/auth.controller.ts
import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.services";
import { rotate } from "../../config/env";
import { logoutService } from "../services/auth.services";



// signup Controller 


export async function signupController(req: Request, res: Response, next: NextFunction) {
  try {
    const { user, accessToken } = await authService.signupService(req.body, res, { autoLogin: false });
    return res.status(201).json(accessToken ? { user, accessToken } : { user });
  } catch (err) {
    next(err);
  }
}
// loginController 

export async function loginController(req: Request, res: Response, next: NextFunction) {
  try {
    const { user, accessToken } = await authService.loginService(req.body, res);
    return res.status(200).json({ user, accessToken });
  } catch (err) {
    next(err);
  }
}


// refershController 

export async function refreshTokenController(req: Request, res: Response, next: NextFunction) {
  try {
    const rawToken = req.cookies?.taskify_refresh;
    if (!rawToken) return res.status(401).json({ message: 'No refresh token provided' });

    const result = await authService.refreshTokenService(rawToken, res, rotate); // rotate by default
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}



export async function logoutController(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  await logoutService(req.user.id, res);
  res.status(204).end();
}




