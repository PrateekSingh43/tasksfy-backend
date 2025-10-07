

import { Router } from  "express";
import { loginSchema, signupSchema } from "./auth.validation";
import { validateBody } from "../middlewares/middleware.ValidateBody";
import { loginController, refreshTokenController, signupController , logoutController } from "./auth.controller";

import authMiddleware from "../middlewares/middleware.auth";


const router = Router()

// signup route 

router.post("/api/v0/signup" , validateBody(signupSchema), signupController)


// login route 
router.post("/api/v0/login" ,validateBody(loginSchema) , loginController )


// refersh route 

router.post("/api/v0/refresh" , refreshTokenController) 


// logout router 

router.post("/api/v0/logout", authMiddleware, logoutController);



export default router;