import { NextFunction, Request , Response} from "express";
import jwt from "jsonwebtoken"
import {JWT_SECRET} from "@repo/backend-common/config"
import { db } from "@repo/db/client";
import type { User } from "@repo/db/types";


export const verifyToken = async(req:Request,res:Response,next:NextFunction) => {
    try{

        const token:string = req.header('Authorization')?.replace('Bearer ','') as string;
        
        console.log("Token in middleware: ",token)
        if(!token){
         res.status(404).json({
                "message":"Unauthorized"
            })
        }

        const decodedPayload = jwt.verify(
            token,
            JWT_SECRET as string
        )
        if(typeof decodedPayload === 'string'){
             res.status(404).json({
                "message":"Unauthorized"
            })
            return;
        }
        console.log("Decoded Paylaod: ",decodedPayload)
        const userExists = await db.user.findFirst({
            where:{id:decodedPayload.id}
        })

        console.log("user:",userExists)
        if(userExists === null){
            req.user = undefined;
            res.status(404).json({
                message:"Invalid user"
            })
            return;
        }

        req.user = userExists
        console.log("User in the middleware: ",req.user)
        next()



    }catch(err){
        console.log(err)
         res.status(404).json({
            "message":"Invalid token"
        })
    }
}