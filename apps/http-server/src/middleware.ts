import { Request,Response,NextFunction } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/config";

export const middleware = (req:Request,res:Response,next:NextFunction) => {
    console.log("Entereed Middleware")
    const token = req.headers["authorization"]?.split(" ")[1] as string;
    console.log("Token:",token)

    if(!token)return
    const decoded = jwt.verify(token,JWT_SECRET as string) as JwtPayload
    if (!req.user) {
        req.user = { userId: "" }; 
      }
  
    if(decoded){
        req.user.userId = decoded.userId
        next();
    }else{
        res.status(403).json({
            message:"Unauthorized"
        })
    }
}