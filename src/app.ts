import express from "express"
import {Request , Response , NextFunction } from "express"
import cookieParser from "cookie-parser";
import authRouter from './auth/auth.route';


import pino from "pino-http"
import cors from "cors"

const app = express();
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(pino());
app.use(authRouter);


app.get('/', (req:Request, res:Response) => {
  req.log.info('something')
  res.send('hello world')
})



app.get("/health" , async (req:Request , res:Response , next:NextFunction)=>{

	res.status(200).json("ok!"); 
})

export default app; 

