import express from "express"
import {Request , Response , NextFunction } from "express"

const app = express();
import dotenv from "dotenv"
dotenv.config(); 
const port = process.env.PORT




app.use(express.json()); 

app.get("/health" , (req:Request , res:Response , next:NextFunction)=>{

	res.status(200).json("ok!"); 
})



app.listen(port , () =>{
	console.log("listening on the port ")
}) 

