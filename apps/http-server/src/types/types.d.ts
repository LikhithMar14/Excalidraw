import { Request } from "express";

export interface IUser{
    userId:string
}
declare module 'jsonwebtoken' {
    interface JwtPayload {
      userId: string;
      email?: string;
      username?: string;
    }
  }
declare module 'express'{
    interface Request {
        user?:IUser
    }
}