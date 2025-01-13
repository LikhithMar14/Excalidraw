import { Request } from "express";
import { db } from "@repo/db/client"
import type { User } from "@repo/db/client";


declare module 'jsonwebtoken' {
    interface JwtPayload {
      id: string;
      email?: string;
      username?: string;
    }
  }
declare module 'express'{
    interface Request {
        user?:User
    }
}
